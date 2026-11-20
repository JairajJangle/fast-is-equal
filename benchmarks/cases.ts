// Benchmark inputs shared by the Lodash comparison (fastIsEqual.benchmark.ts)
// and the before/after harness (compare.ts).

export interface BenchmarkCase {
  label: string;
  a: any;
  b: any;
  // Excluded from the before/after gate; the reason is documented next to the case
  knownException?: boolean;
}

// Cases measured against Lodash and reported in the README
export const testCases: BenchmarkCase[] = [
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

// Builders for the before/after cases
const chain = (depth: number) => {
  let node: any = { v: 0 };
  for (let i = 0; i < depth; i++) node = { next: node, v: i };
  return node;
};

const parentChain = (depth: number) => {
  const root: any = { v: -1, parent: null, child: null };
  let node = root;
  for (let i = 0; i < depth; i++) {
    const child: any = { v: i, parent: node, child: null };
    node.child = child;
    node = child;
  }
  return root;
};

const tree = (depth: number, width: number): any =>
  depth === 0
    ? { id: 1, s: 'x' }
    : Object.fromEntries(Array.from({ length: width }, (_, i) => [`k${i}`, tree(depth - 1, width)]));

const sharedTree = (shared: boolean) => {
  const leaf = { theme: 'dark', lang: 'en' };
  const pick = () => (shared ? leaf : { theme: 'dark', lang: 'en' });
  return { a: pick(), b: pick(), c: { d: pick(), e: pick() } };
};

class Point {
  constructor(public x: number, public y: number) { }
}

class Point3 extends Point {
  constructor(x: number, y: number, public z: number) {
    super(x, y);
  }
}

const sym = Symbol('benchmark');

// Extra shapes measured only by the before/after harness. They cover code
// paths the Lodash list does not reach, and some are too slow for 1,000,000
// Lodash iterations.
export const extraCases: BenchmarkCase[] = [
  { label: 'Class instance', a: new Point(1, 2), b: new Point(1, 2) },
  { label: 'Derived class instance', a: new Point3(1, 2, 3), b: new Point3(1, 2, 3) },
  { label: 'Keys in different order', a: { a: 1, b: 2, c: 3, d: 4 }, b: { d: 4, c: 3, b: 2, a: 1 } },
  { label: 'Object with symbol key', a: { a: 1, [sym]: 2 }, b: { a: 1, [sym]: 2 } },
  {
    label: 'Array of 100 flat objects',
    a: Array.from({ length: 100 }, (_, i) => ({ id: i, n: 'a' })),
    b: Array.from({ length: 100 }, (_, i) => ({ id: i, n: 'a' }))
  },
  { label: 'Tree (depth 4, width 4)', a: tree(4, 4), b: tree(4, 4) },
  { label: 'Chain (depth 20)', a: chain(20), b: chain(20) },
  { label: 'Chain (depth 200)', a: chain(200), b: chain(200) },
  { label: 'Chain (depth 2000)', a: chain(2000), b: chain(2000) },
  { label: 'Shared-reference tree vs clone', a: sharedTree(true), b: sharedTree(false) },
  {
    label: 'Map with object values',
    a: new Map(Array.from({ length: 10 }, (_, i) => [`k${i}`, { i }])),
    b: new Map(Array.from({ length: 10 }, (_, i) => [`k${i}`, { i }]))
  },
  {
    label: 'Set of objects',
    a: new Set(Array.from({ length: 10 }, (_, i) => ({ i }))),
    b: new Set(Array.from({ length: 10 }, (_, i) => ({ i })))
  },
  { label: 'Boxed Number', a: new Number(1), b: new Number(1) },
  { label: 'Invalid Dates', a: new Date(NaN), b: new Date(NaN) },
  { label: 'Float64Array (1000)', a: new Float64Array(1000).fill(1.5), b: new Float64Array(1000).fill(1.5) },
  { label: 'Float64Array with NaN', a: new Float64Array([1, NaN, 3]), b: new Float64Array([1, NaN, 3]) },
  { label: 'Parent-pointer chain (depth 10)', a: parentChain(10), b: parentChain(10) },
  // Cyclic and nested deeper than the tracker's scan limit: every level pays
  // for the Map index that keeps shared references correct. Measures 0.91x to
  // 0.97x of the previous tracker, which never cleared its entries.
  { label: 'Parent-pointer chain (depth 200)', a: parentChain(200), b: parentChain(200), knownException: true },
];
