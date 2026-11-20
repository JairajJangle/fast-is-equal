// Before/after benchmark: runs the baseline build of src/index.ts and the
// working tree side by side in one process and fails when a case is slower.
//
// Usage: yarn benchmark:compare [git-ref]
// The baseline defaults to the merge base of HEAD and origin/main.
//
// Set BENCH_FILTER to a regular expression to run only the matching cases,
// for example BENCH_FILTER="chain|circular". A filtered run prints the table
// but does not rewrite before-after.txt.
//
// How the engine optimizes a function depends on everything the process ran
// before it, so a case can measure a few percent slower in one process and
// not in the next. Cases that come out slower are therefore measured again in
// a fresh process, and only fail when they are slower there too.

import { execFileSync, spawnSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { testCases, extraCases, BenchmarkCase } from './cases';

type Equal = (a: any, b: any) => boolean;

const THRESHOLD = 0.97; // 3% noise allowance
const MIN_DELTA_NS = 0.5; // differences smaller than this are timer noise
const ROUNDS = 9;
const ROUND_BUDGET_NS = 25e6; // time spent on one build in one round
const RETRIES = 2; // re-measure cases that land under the threshold

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' });

function resolveBaselineRef(): string {
  const requested = process.argv[2];
  if (requested) return git('rev-parse', requested).trim();
  for (const upstream of ['origin/main', 'main']) {
    try {
      return git('merge-base', 'HEAD', upstream).trim();
    } catch {
      // try the next candidate
    }
  }
  throw new Error('Cannot find a baseline: pass a git ref as the first argument');
}

function loadBaseline(ref: string): Equal {
  const dir = join(__dirname, '.baseline');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.ts'), git('show', `${ref}:src/index.ts`));
  return require('./.baseline/index').fastIsEqual;
}

type Timer = (fn: Equal, a: any, b: any, iterations: number) => number;

// Each build gets its own copy of the timing loop. With one shared loop the
// call site would see two targets, and the engine could inline one build but
// not the other.
function makeTimer(): Timer {
  return new Function('fn', 'a', 'b', 'iterations', `
    let sink = 0;
    const start = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
      if (fn(a, b)) sink++;
    }
    const elapsed = Number(process.hrtime.bigint() - start);
    if (sink < 0) throw new Error('unreachable');
    return elapsed / iterations;
  `) as Timer;
}

const timeBefore = makeTimer();
const timeAfter = makeTimer();

interface Measurement {
  before: number;
  after: number;
}

function measure(before: Equal, after: Equal, a: any, b: any): Measurement {
  const probe = Math.max(timeBefore(before, a, b, 200), timeAfter(after, a, b, 200), 1);
  const iterations = Math.max(50, Math.min(2_000_000, Math.floor(ROUND_BUDGET_NS / probe)));

  // Warm up both builds
  timeBefore(before, a, b, iterations);
  timeAfter(after, a, b, iterations);

  let bestBefore = Infinity;
  let bestAfter = Infinity;
  for (let round = 0; round < ROUNDS; round++) {
    // Alternate which build runs first so neither always gets the cooler slot
    if (round % 2 === 0) {
      bestBefore = Math.min(bestBefore, timeBefore(before, a, b, iterations));
      bestAfter = Math.min(bestAfter, timeAfter(after, a, b, iterations));
    } else {
      bestAfter = Math.min(bestAfter, timeAfter(after, a, b, iterations));
      bestBefore = Math.min(bestBefore, timeBefore(before, a, b, iterations));
    }
  }
  return { before: bestBefore, after: bestAfter };
}

const isSlower = (m: Measurement) =>
  m.before / m.after < THRESHOLD && m.after - m.before > MIN_DELTA_NS;

interface Row {
  label: string;
  before: number;
  after: number;
  ratio: number;
  note: string;
  gated: boolean;
  slower: boolean;
}

function run() {
  const ref = resolveBaselineRef();
  const before = loadBaseline(ref);
  const after: Equal = require('../src/index').fastIsEqual;

  const filter = process.env.BENCH_FILTER ? new RegExp(process.env.BENCH_FILTER, 'i') : null;
  const cases: BenchmarkCase[] = [...testCases, ...extraCases].filter(c => !filter || filter.test(c.label));
  if (cases.length === 0) throw new Error(`BENCH_FILTER matches no case: ${process.env.BENCH_FILTER}`);
  const rows: Row[] = [];

  for (const { label, a, b, knownException } of cases) {
    const resultChanged = before(a, b) !== after(a, b);

    let m = measure(before, after, a, b);
    for (let retry = 0; retry < RETRIES && isSlower(m); retry++) {
      const again = measure(before, after, a, b);
      m = { before: Math.min(m.before, again.before), after: Math.min(m.after, again.after) };
    }

    const note = resultChanged
      ? 'result changed, not comparable'
      : knownException
        ? 'known exception'
        : '';
    rows.push({
      label,
      before: m.before,
      after: m.after,
      ratio: m.before / m.after,
      note,
      gated: !resultChanged && !knownException,
      slower: isSlower(m)
    });
  }

  const labelWidth = Math.max(...rows.map(r => r.label.length)) + 2;
  const lines: string[] = [];
  lines.push(`Before: ${ref.slice(0, 7)} (src/index.ts)   After: working tree`);
  lines.push(`Node ${process.version}, best of ${ROUNDS} alternating rounds, ns per call`);
  lines.push(`A case fails when it is below ${THRESHOLD.toFixed(2)}x and more than ${MIN_DELTA_NS} ns slower`);
  lines.push('');
  lines.push(`${'Case'.padEnd(labelWidth)}${'Before'.padStart(12)}${'After'.padStart(12)}${'Ratio'.padStart(9)}  Note`);
  lines.push('-'.repeat(labelWidth + 33 + 6));
  for (const r of rows) {
    lines.push(
      `${r.label.padEnd(labelWidth)}${r.before.toFixed(1).padStart(12)}${r.after.toFixed(1).padStart(12)}` +
      `${(r.ratio.toFixed(2) + 'x').padStart(9)}  ${r.note}`
    );
  }

  const gated = rows.filter(r => r.gated);
  const geoMean = Math.exp(gated.reduce((sum, r) => sum + Math.log(r.ratio), 0) / gated.length);
  let slower = gated.filter(r => r.slower);

  lines.push('');
  lines.push(`Geometric mean speedup over ${gated.length} comparable cases: ${geoMean.toFixed(2)}x`);
  lines.push(
    slower.length === 0
      ? 'No case is slower'
      : `Slower: ${slower.map(r => `${r.label} (${r.ratio.toFixed(2)}x)`).join(', ')}`
  );

  if (slower.length > 0 && !process.env.BENCH_RECHECK) {
    const escape = (label: string) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const recheck = spawnSync('yarn', ['benchmark:compare', ref], {
      encoding: 'utf8',
      env: {
        ...process.env,
        BENCH_RECHECK: '1',
        BENCH_FILTER: `^(${slower.map(r => escape(r.label)).join('|')})$`
      }
    });
    lines.push('');
    lines.push('Recheck of the slower cases in a fresh process:');
    lines.push(...recheck.stdout.split('\n').filter(line => /\dx\s|slower/i.test(line)));
    if (recheck.status === 0) slower = [];
    lines.push(slower.length === 0 ? 'Recheck passed: no case is slower' : 'Recheck failed: still slower');
  }

  const report = lines.join('\n') + '\n';
  process.stdout.write(report);
  if (!filter) writeFileSync(join(__dirname, 'before-after.txt'), report);

  if (slower.length > 0) process.exit(1);
}

run();
