import { inspect, isDeepStrictEqual } from 'util';
import { fastIsEqual } from '../index';

// Randomized comparison against two references, in both argument orders.
//
// Structures are checked against Node's isDeepStrictEqual. The generator
// stays inside the behaviour the two share: no -0, no array holes, no symbol
// keys, no errors, no functions and no invalid dates (Node versions before
// 26 report two invalid dates as unequal).
//
// Cyclic graphs are checked against a small reference implementation of the
// library's own rule instead. Node gives order-dependent answers for cycles
// of different shapes that unroll to the same infinite tree, so it cannot
// serve as the reference there.
//
// Run another seed with: FUZZ_SEED=<number> yarn test

const SEED = Number(process.env.FUZZ_SEED) || 20261118;
const PAIRS = 20000;

type Random = () => number;

// Small deterministic PRNG (mulberry32)
function makeRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class UTCDate extends Date { }
class Registry extends Map<any, any> { }
class Point {
  constructor(public x: any, public y: any) { }
}

const PRIMITIVES = [1, 2, NaN, '', 'a', true, null, undefined, BigInt(1)];
const never: Random = () => 1;

// Wraps a value in single-key objects, deep enough to switch the cycle
// tracker from scanning to its Map index
function wrap(value: any, depth: number) {
  for (let i = 0; i < depth; i++) value = { s: value };
  return value;
}

// Builds a random value. `random` decides the shape; `mutation` occasionally
// swaps a primitive, so two calls with the same `random` seed give values
// that are equal or differ in a few leaves.
function generateStructure(random: Random, mutation: Random): any {
  const pick = <T>(items: T[]): T => items[Math.floor(random() * items.length)];
  const primitive = () => {
    const chosen = pick(PRIMITIVES);
    return mutation() < 0.04 ? PRIMITIVES[Math.floor(mutation() * PRIMITIVES.length)] : chosen;
  };

  // `pool` holds the containers created so far, so later values can refer
  // back to them: that produces shared references and cycles
  const pool: any[] = [];

  const generate = (depth: number): any => {
    const roll = random();
    if (depth <= 0 || roll < 0.28) return primitive();
    if (pool.length > 0 && roll < 0.42) return pick(pool);

    let value: any;
    if (roll < 0.6) {
      value = {};
      pool.push(value);
      const count = Math.floor(random() * 3);
      for (let i = 0; i < count; i++) value[pick(['a', 'b', 'c'])] = generate(depth - 1);
    } else if (roll < 0.74) {
      value = [];
      pool.push(value);
      const count = Math.floor(random() * 3);
      for (let i = 0; i < count; i++) value.push(generate(depth - 1));
    } else if (roll < 0.8) {
      value = random() < 0.8 ? new Map() : new Registry();
      const count = Math.floor(random() * 3);
      for (let i = 0; i < count; i++) value.set(generate(depth - 1), generate(depth - 1));
    } else if (roll < 0.86) {
      value = new Set();
      const count = Math.floor(random() * 3);
      for (let i = 0; i < count; i++) value.add(generate(depth - 1));
    } else if (roll < 0.9) {
      const time = pick([0, 1, 2]);
      value = random() < 0.7 ? new Date(time) : new UTCDate(time);
    } else if (roll < 0.94) {
      value = new Float32Array([pick([0, 1, NaN]), pick([0, 1, NaN])]);
    } else if (roll < 0.97) {
      value = random() < 0.5 ? new Number(pick([1, 2, NaN])) : new Boolean(pick([true, false]));
    } else {
      value = new Point(null, primitive());
      pool.push(value);
      value.x = generate(depth - 1);
    }
    return value;
  };

  return generate(4);
}

// Builds a small graph of up to four nodes whose links point at random
// nodes, so most graphs are cyclic and many pairs unroll to the same
// infinite tree without being the same shape
function generateGraph(random: Random): any {
  const count = 1 + Math.floor(random() * 4);
  const nodes: any[] = Array.from({ length: count }, () => ({ v: random() < 0.85 ? 0 : 1 }));
  for (const node of nodes) {
    node.n = nodes[Math.floor(random() * count)];
    if (random() < 0.5) node.m = random() < 0.8 ? nodes[Math.floor(random() * count)] : 0;
  }
  return nodes[0];
}

// The cycle rule, written the obvious way: two graphs are equal when they
// can be walked in step, each object in progress on one side always facing
// the same object on the other side. A self-loop therefore differs from a
// two-node loop. Handles the plain objects and numbers generateGraph makes.
function referenceGraphEqual(
  a: any,
  b: any,
  partnerOfA = new Map<any, any>(),
  inProgressB = new Set<any>()
): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (partnerOfA.has(a)) return partnerOfA.get(a) === b;
  if (inProgressB.has(b)) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  partnerOfA.set(a, b);
  inProgressB.add(b);
  const equal = keys.every(
    key => Object.prototype.hasOwnProperty.call(b, key) && referenceGraphEqual(a[key], b[key], partnerOfA, inProgressB)
  );
  partnerOfA.delete(a);
  inProgressB.delete(b);
  return equal;
}

function describeMismatch(a: any, b: any, expected: boolean): string | null {
  const forward = fastIsEqual(a, b);
  const backward = fastIsEqual(b, a);
  if (forward === expected && backward === expected) return null;
  return `expected ${expected}, got ${forward} for (a, b) and ${backward} for (b, a):\n` +
    inspect([a, b], { depth: 8, breakLength: 120 });
}

describe(`fastIsEqual on random inputs (seed ${SEED})`, () => {
  it(`agrees with util.isDeepStrictEqual on ${PAIRS} structures with shared references`, () => {
    const choose = makeRandom(SEED);
    let equalPairs = 0;

    for (let i = 0; i < PAIRS; i++) {
      const kind = choose();
      let a = generateStructure(makeRandom(SEED + i), never);
      let b =
        kind < 0.4
          ? generateStructure(makeRandom(SEED + i), never) // same value, separate objects
          : kind < 0.8
            ? generateStructure(makeRandom(SEED + i), makeRandom(SEED - i - 1)) // a few leaves differ
            : generateStructure(makeRandom(SEED + PAIRS + i), never); // unrelated

      // A third of the pairs are nested past the tracker's scan limit
      if (i % 3 === 0) {
        a = wrap(a, 30);
        b = wrap(b, 30);
      }

      const expected = isDeepStrictEqual(a, b);
      if (expected) equalPairs++;
      const mismatch = describeMismatch(a, b, expected);
      if (mismatch) throw new Error(`pair ${i}: ${mismatch}`);
    }

    // The run only means something if it sees plenty of both outcomes
    expect(equalPairs).toBeGreaterThan(PAIRS * 0.3);
    expect(equalPairs).toBeLessThan(PAIRS * 0.9);
  });

  it(`agrees with the reference cycle rule on ${PAIRS} cyclic graphs`, () => {
    const random = makeRandom(SEED ^ 0x5bd1e995);
    let equalPairs = 0;

    for (let i = 0; i < PAIRS; i++) {
      let a = generateGraph(random);
      let b = generateGraph(random);

      // Half of the pairs are nested past the tracker's scan limit
      if (i % 2 === 0) {
        a = wrap(a, 30);
        b = wrap(b, 30);
      }

      // The rule is symmetric, so the reference must be too
      const expected = referenceGraphEqual(a, b);
      if (referenceGraphEqual(b, a) !== expected) throw new Error(`pair ${i}: reference is not symmetric`);

      if (expected) equalPairs++;
      const mismatch = describeMismatch(a, b, expected);
      if (mismatch) throw new Error(`pair ${i}: ${mismatch}`);
    }

    expect(equalPairs).toBeGreaterThan(PAIRS * 0.02);
    expect(equalPairs).toBeLessThan(PAIRS * 0.9);
  });
});
