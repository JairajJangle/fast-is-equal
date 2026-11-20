import { fastIsEqual } from '../src/index';
import isEqual from 'lodash/isEqual';
import { testCases } from './cases';
import { performance } from 'perf_hooks';

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const WHITE = '\x1b[37m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';


// Each case runs ROUNDS rounds of ITERATIONS calls per library, alternating
// which library goes first, and keeps each library's fastest round. A single
// long run is easily skewed by whatever the machine does at that moment.
const ROUNDS = 5;
const ITERATIONS = 200_000;

// Speed ratios within this band count as a tie: differences this small are
// within run-to-run noise
const TIE_BAND = 0.03;

type Timer = (fn: any, a: any, b: any, iterations: number) => number;

// One timing loop per library. A shared loop would see two targets at one
// call site, and the engine could optimize one library's calls but not the
// other's.
function makeTimer(): Timer {
  return function (fn: any, a: any, b: any, iterations: number) {
    let sink = 0;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      if (fn(a, b)) sink++;
    }
    const end = performance.now();
    if (sink < 0) throw new Error('unreachable');
    return (end - start) / iterations; // average time per call in ms
  };
}

const timeFast = makeTimer();
const timeLodash = makeTimer();

function measure(a: any, b: any) {
  // Warm up both
  timeFast(fastIsEqual, a, b, ITERATIONS / 4);
  timeLodash(isEqual, a, b, ITERATIONS / 4);

  let customTime = Infinity;
  let lodashTime = Infinity;
  for (let round = 0; round < ROUNDS; round++) {
    if (round % 2 === 0) {
      customTime = Math.min(customTime, timeFast(fastIsEqual, a, b, ITERATIONS));
      lodashTime = Math.min(lodashTime, timeLodash(isEqual, a, b, ITERATIONS));
    } else {
      lodashTime = Math.min(lodashTime, timeLodash(isEqual, a, b, ITERATIONS));
      customTime = Math.min(customTime, timeFast(fastIsEqual, a, b, ITERATIONS));
    }
  }
  return { customTime, lodashTime };
}

// Run the performance comparison
console.log(`${BOLD}Performance Comparison: fastIsEqual vs Lodash isEqual${RESET}`);
console.log(`Per test case: best of ${ROUNDS} rounds of ${ITERATIONS.toLocaleString('en-US')} calls per library`);
console.log(`Within ±${TIE_BAND * 100}% counts as a tie`);
console.log('═'.repeat(80));

let totalCustomTime = 0;
let totalLodashTime = 0;
let customWins = 0;
let ties = 0;
let lodashWins = 0;

const results: Array<{ label: string, speedup: number, customTime: number, lodashTime: number; }> = [];

testCases.forEach((testCase, index) => {
  const { label, a, b } = testCase;

  const { customTime, lodashTime } = measure(a, b);
  totalCustomTime += customTime;
  totalLodashTime += lodashTime;

  // Calculate speed multiplier
  const speedMultiplier = lodashTime / customTime;

  // Track wins, ties and losses
  const isTie = Math.abs(speedMultiplier - 1) <= TIE_BAND;
  if (isTie) {
    ties++;
  } else if (speedMultiplier > 1) {
    customWins++;
  } else {
    lodashWins++;
  }

  results.push({ label, speedup: speedMultiplier, customTime, lodashTime });

  // Determine color based on speed multiplier
  let color = WHITE;
  let emoji = '';
  if (isTie) {
    emoji = '🟰';
  } else if (speedMultiplier < 0.9) {
    color = RED;
    emoji = '❌';
  } else if (speedMultiplier < 1) {
    color = YELLOW;
    emoji = '⚠️ ';
  } else if (speedMultiplier > 2) {
    color = GREEN;
    emoji = '🚀';
  } else if (speedMultiplier > 1.25) {
    color = GREEN;
    emoji = '✅';
  } else {
    emoji = '➡️ ';
  }

  // Output results with colors
  console.log(`${BOLD}Test ${index + 1}:${RESET} ${label}`);
  console.log(`  fastIsEqual:    ${customTime.toFixed(6)} ms`);
  console.log(`  Lodash isEqual: ${lodashTime.toFixed(6)} ms`);
  const verdict = isTie ? ' (tie)' : speedMultiplier > 1 ? ' faster' : ' slower';
  console.log(`${color}  ${emoji} Speed: ${speedMultiplier.toFixed(2)}x${verdict}${RESET}`);
  console.log('─'.repeat(80));
});

// Sort results by speedup for summary
const topPerformers = results
  .sort((a, b) => b.speedup - a.speedup)
  .slice(0, 10);

const worstPerformers = results
  .filter(r => r.speedup < 1 - TIE_BAND)
  .sort((a, b) => a.speedup - b.speedup);

// Calculate and print summary
console.log('═'.repeat(80));
console.log(`${BOLD}SUMMARY${RESET}`);
console.log('═'.repeat(80));

const averageCustomTime = totalCustomTime / testCases.length;
const averageLodashTime = totalLodashTime / testCases.length;
const averageSpeedMultiplier = averageLodashTime / averageCustomTime;

console.log(`${BOLD}Overall Performance:${RESET}`);
console.log(`  Average fastIsEqual time:    ${averageCustomTime.toFixed(6)} ms`);
console.log(`  Average Lodash isEqual time: ${averageLodashTime.toFixed(6)} ms`);
console.log(`  ${GREEN}${BOLD}fastIsEqual is ${averageSpeedMultiplier.toFixed(2)}x faster on average${RESET}`);
console.log();
const share = (n: number) => `${n}/${testCases.length} (${(n / testCases.length * 100).toFixed(1)}%)`;
console.log(`${BOLD}Win Rate:${RESET}`);
console.log(`  fastIsEqual wins: ${GREEN}${share(customWins)}${RESET}`);
console.log(`  Ties (±${TIE_BAND * 100}%):     ${share(ties)}`);
console.log(`  Lodash wins:      ${RED}${share(lodashWins)}${RESET}`);

console.log();
console.log(`${BOLD}🏆 Top 10 Best Performance Gains:${RESET}`);
topPerformers.forEach((result, i) => {
  console.log(`  ${i + 1}. ${result.label}: ${GREEN}${result.speedup.toFixed(2)}x faster${RESET}`);
});

if (worstPerformers.length > 0) {
  console.log();
  console.log(`${BOLD}⚠️  Cases where Lodash performed better:${RESET}`);
  worstPerformers.forEach((result, i) => {
    console.log(`  ${i + 1}. ${result.label}: ${YELLOW}${result.speedup.toFixed(2)}x${RESET}`);
  });
}

console.log();
console.log('═'.repeat(80));