// benchmarks/compareIsEqual.ts
import { fastIsEqual } from '../src/index';
import isEqual from 'lodash/isEqual';
import { performance } from 'perf_hooks';

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const WHITE = '\x1b[37m';
const RESET = '\x1b[0m';

// Test cases (unchanged)
const testCases = [
  { label: 'Numbers', a: 42, b: 42 },
  { label: 'Strings', a: 'hello', b: 'hello' },
  { label: 'Booleans', a: true, b: true },
  { label: 'NaN', a: NaN, b: NaN },
  { label: 'Simple Object (equal)', a: { x: 1, y: 2 }, b: { x: 1, y: 2 } },
  { label: 'Simple Object (unequal)', a: { x: 1, y: 2 }, b: { x: 1, y: 3 } },
  { label: 'Nested Object (equal)', a: { x: { y: { z: 1 } } }, b: { x: { y: { z: 1 } } } },
  { label: 'Nested Object (unequal)', a: { x: { y: { z: 1 } } }, b: { x: { y: { z: 2 } } } },
  { label: 'Array of Primitives (equal)', a: [1, 2, 3], b: [1, 2, 3] },
  { label: 'Array of Primitives (unequal)', a: [1, 2, 3], b: [1, 2, 4] },
  { label: 'Array of Objects (equal)', a: [{ x: 1 }, { y: 2 }], b: [{ x: 1 }, { y: 2 }] },
  {
    label: 'Circular Reference',
    a: (() => { const obj: any = {}; obj.self = obj; return obj; })(),
    b: (() => { const obj: any = {}; obj.self = obj; return obj; })(),
  },
  { label: 'Map (equal)', a: new Map([[1, 'one'], [2, 'two']]), b: new Map([[1, 'one'], [2, 'two']]) },
  { label: 'Map (unequal)', a: new Map([[1, 'one'], [2, 'two']]), b: new Map([[1, 'one'], [3, 'three']]) },
  { label: 'Set (equal)', a: new Set([1, 2, 3]), b: new Set([1, 2, 3]) },
  { label: 'Set (unequal)', a: new Set([1, 2, 3]), b: new Set([1, 2, 4]) },
  { label: 'Empty Object vs Array', a: {}, b: [] },
  { label: 'Map vs Set', a: new Map(), b: new Set() },
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
console.log('Performance Comparison: fastIsEqual vs Lodash isEqual');
console.log(`Iterations per test case: ${iterations}`);
console.log('----------------------------------------');

let totalCustomTime = 0;
let totalLodashTime = 0;

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

  // Determine color based on speed multiplier
  let color = WHITE;
  if (speedMultiplier < 1) {
    color = RED;
  } else if (speedMultiplier > 1.25) {
    color = GREEN;
  }

  // Output results with colors
  console.log(`Test Case ${index + 1}: ${label}`);
  console.log(`  fastIsEqual: ${customTime.toFixed(6)} ms`);
  console.log(`  Lodash isEqual: ${lodashTime.toFixed(6)} ms`);
  console.log(`  Difference (fastIsEqual - Lodash): ${(customTime - lodashTime).toFixed(6)} ms`);
  console.log(`${color}  fastIsEqual is ${speedMultiplier.toFixed(2)}x faster than Lodash${RESET}`);
  console.log('----------------------------------------');
});

// Calculate and print average times
const averageCustomTime = totalCustomTime / testCases.length;
const averageLodashTime = totalLodashTime / testCases.length;
const averageSpeedMultiplier = averageLodashTime / averageCustomTime;

console.log('Average Performance:');
console.log(`  fastIsEqual: ${averageCustomTime.toFixed(6)} ms`);
console.log(`  Lodash isEqual: ${averageLodashTime.toFixed(6)} ms`);
console.log(`  fastIsEqual is on average ${averageSpeedMultiplier.toFixed(2)}x faster than Lodash`);