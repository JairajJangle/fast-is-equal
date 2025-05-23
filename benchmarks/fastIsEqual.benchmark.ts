import { fastIsEqual } from '../src/index';
import isEqual from 'lodash/isEqual';
import { performance } from 'perf_hooks';

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const WHITE = '\x1b[37m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Test cases
const testCases = [
  // Primitives
  { label: 'Numbers', a: 42, b: 42 },
  { label: 'Strings', a: 'hello', b: 'hello' },
  { label: 'Booleans', a: true, b: true },
  { label: 'NaN', a: NaN, b: NaN },
  { label: 'Large Numbers', a: 9007199254740991, b: 9007199254740991 },
  { label: 'Negative Zero', a: -0, b: +0 },

  // Simple Objects
  { label: 'Empty Objects', a: {}, b: {} },
  { label: 'Single Property Object', a: { id: 123 }, b: { id: 123 } },
  { label: 'Simple Object (equal)', a: { x: 1, y: 2 }, b: { x: 1, y: 2 } },
  { label: 'Simple Object (unequal)', a: { x: 1, y: 2 }, b: { x: 1, y: 3 } },
  { label: 'Object with null prototype', a: Object.create(null), b: Object.create(null) },

  // Nested Objects
  { label: 'Nested Object (equal)', a: { x: { y: { z: 1 } } }, b: { x: { y: { z: 1 } } } },
  { label: 'Nested Object (unequal)', a: { x: { y: { z: 1 } } }, b: { x: { y: { z: 2 } } } },
  {
    label: 'Deeply Nested (5 levels)',
    a: { a: { b: { c: { d: { e: 'value' } } } } },
    b: { a: { b: { c: { d: { e: 'value' } } } } }
  },

  // Arrays
  { label: 'Empty Arrays', a: [], b: [] },
  { label: 'Single Element Array', a: [1], b: [1] },
  { label: 'Array of Primitives (equal)', a: [1, 2, 3], b: [1, 2, 3] },
  { label: 'Array of Primitives (unequal)', a: [1, 2, 3], b: [1, 2, 4] },
  { label: 'Large Array of Numbers (100)', a: Array(100).fill(42), b: Array(100).fill(42) },
  { label: 'Array of Strings', a: ['a', 'b', 'c', 'd'], b: ['a', 'b', 'c', 'd'] },
  { label: 'Mixed Type Array', a: [1, 'two', true, null], b: [1, 'two', true, null] },
  { label: 'Sparse Array', a: [1, , , 4], b: [1, , , 4] },
  { label: 'Array of Objects (equal)', a: [{ x: 1 }, { y: 2 }], b: [{ x: 1 }, { y: 2 }] },

  // TypedArrays
  { label: 'Uint8Array', a: new Uint8Array([1, 2, 3, 4]), b: new Uint8Array([1, 2, 3, 4]) },
  { label: 'Float32Array', a: new Float32Array([1.1, 2.2, 3.3]), b: new Float32Array([1.1, 2.2, 3.3]) },
  {
    label: 'Large TypedArray (1000)',
    a: new Int32Array(1000).fill(99),
    b: new Int32Array(1000).fill(99)
  },

  // ArrayBuffer
  {
    label: 'ArrayBuffer (small)',
    a: new Uint8Array([1, 2, 3, 4]).buffer,
    b: new Uint8Array([1, 2, 3, 4]).buffer
  },

  // Special Objects
  { label: 'Dates (equal)', a: new Date('2024-01-01'), b: new Date('2024-01-01') },
  { label: 'RegExp (equal)', a: /test/gi, b: /test/gi },
  { label: 'RegExp (unequal flags)', a: /test/g, b: /test/i },

  // Circular References
  {
    label: 'Circular Reference',
    a: (() => { const obj: any = {}; obj.self = obj; return obj; })(),
    b: (() => { const obj: any = {}; obj.self = obj; return obj; })(),
  },
  {
    label: 'Mutual Circular',
    a: (() => { const a: any = { name: 'a' }; const b = { ref: a }; a.ref = b; return a; })(),
    b: (() => { const a: any = { name: 'a' }; const b = { ref: a }; a.ref = b; return a; })(),
  },

  // Maps
  { label: 'Empty Map', a: new Map(), b: new Map() },
  { label: 'Map with primitives', a: new Map([[1, 'one'], [2, 'two']]), b: new Map([[1, 'one'], [2, 'two']]) },
  { label: 'Map (unequal)', a: new Map([[1, 'one'], [2, 'two']]), b: new Map([[1, 'one'], [3, 'three']]) },
  {
    label: 'Large Map (50 entries)',
    a: new Map(Array.from({ length: 50 }, (_, i) => [i, `value${i}`])),
    b: new Map(Array.from({ length: 50 }, (_, i) => [i, `value${i}`]))
  },

  // Sets
  { label: 'Empty Set', a: new Set(), b: new Set() },
  { label: 'Set of numbers', a: new Set([1, 2, 3]), b: new Set([1, 2, 3]) },
  { label: 'Set (unequal)', a: new Set([1, 2, 3]), b: new Set([1, 2, 4]) },
  { label: 'Set of strings', a: new Set(['a', 'b', 'c']), b: new Set(['a', 'b', 'c']) },
  {
    label: 'Large Set (100 items)',
    a: new Set(Array.from({ length: 100 }, (_, i) => i)),
    b: new Set(Array.from({ length: 100 }, (_, i) => i))
  },

  // Mixed types (should fail fast)
  { label: 'Object vs Array', a: {}, b: [] },
  { label: 'Map vs Set', a: new Map(), b: new Set() },
  { label: 'String vs Number', a: '42', b: 42 },
  { label: 'Boolean vs Number', a: true, b: 1 },

  // Real-world-like objects
  {
    label: 'User Object',
    a: { id: 1, name: 'John', email: 'john@example.com', active: true },
    b: { id: 1, name: 'John', email: 'john@example.com', active: true }
  },
  {
    label: 'API Response',
    a: { status: 200, data: { users: [{ id: 1 }, { id: 2 }], total: 2 }, timestamp: 1234567890 },
    b: { status: 200, data: { users: [{ id: 1 }, { id: 2 }], total: 2 }, timestamp: 1234567890 }
  },
  {
    label: 'Config Object',
    a: { debug: false, port: 3000, host: 'localhost', features: ['auth', 'api', 'ui'] },
    b: { debug: false, port: 3000, host: 'localhost', features: ['auth', 'api', 'ui'] }
  },
  {
    label: 'State Object',
    a: {
      counter: 0,
      items: [],
      loading: false,
      error: null,
      metadata: { version: '1.0.0', lastUpdated: null }
    },
    b: {
      counter: 0,
      items: [],
      loading: false,
      error: null,
      metadata: { version: '1.0.0', lastUpdated: null }
    }
  }
];

// Number of iterations to average the performance
const iterations = 1_000_000;

// Function to measure performance of a given equality function
function measurePerformance(fn: any, a: any, b: any) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn(a, b);
  }
  const end = performance.now();
  return (end - start) / iterations; // Return average time per iteration in ms
}

// Run the performance comparison
console.log(`${BOLD}Performance Comparison: fastIsEqual vs Lodash isEqual${RESET}`);
console.log(`Iterations per test case: ${iterations.toLocaleString()}`);
console.log('═'.repeat(80));

let totalCustomTime = 0;
let totalLodashTime = 0;
let customWins = 0;
let lodashWins = 0;

const results: Array<{ label: string, speedup: number, customTime: number, lodashTime: number; }> = [];

testCases.forEach((testCase, index) => {
  const { label, a, b } = testCase;

  // Measure custom isEqual performance
  const customTime = measurePerformance(fastIsEqual, a, b);
  totalCustomTime += customTime;

  // Measure Lodash isEqual performance
  const lodashTime = measurePerformance(isEqual, a, b);
  totalLodashTime += lodashTime;

  // Calculate speed multiplier
  const speedMultiplier = lodashTime / customTime;

  // Track wins
  if (customTime < lodashTime) {
    customWins++;
  } else {
    lodashWins++;
  }

  results.push({ label, speedup: speedMultiplier, customTime, lodashTime });

  // Determine color based on speed multiplier
  let color = WHITE;
  let emoji = '';
  if (speedMultiplier < 0.9) {
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
  console.log(`${color}  ${emoji} Speed: ${speedMultiplier.toFixed(2)}x${speedMultiplier >= 1 ? ' faster' : ' slower'}${RESET}`);
  console.log('─'.repeat(80));
});

// Sort results by speedup for summary
const topPerformers = results
  .sort((a, b) => b.speedup - a.speedup)
  .slice(0, 10);

const worstPerformers = results
  .filter(r => r.speedup < 1)
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
console.log(`${BOLD}Win Rate:${RESET}`);
console.log(`  fastIsEqual wins: ${GREEN}${customWins}/${testCases.length}${RESET} (${(customWins / testCases.length * 100).toFixed(1)}%)`);
console.log(`  Lodash wins:      ${RED}${lodashWins}/${testCases.length}${RESET} (${(lodashWins / testCases.length * 100).toFixed(1)}%)`);

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