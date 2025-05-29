import { fastIsEqual } from '../index';

describe('isEqual', () => {
  // **Primitives**
  it('should return true for identical primitives', () => {
    expect(fastIsEqual(1, 1)).toBe(true);
    expect(fastIsEqual('a', 'a')).toBe(true);
    expect(fastIsEqual(true, true)).toBe(true);
  });

  it('should return false for different primitives', () => {
    expect(fastIsEqual(1, 2)).toBe(false);
    expect(fastIsEqual('a', 'b')).toBe(false);
    expect(fastIsEqual(true, false)).toBe(false);
  });

  // **NaN**
  it('should return true for NaN and NaN', () => {
    expect(fastIsEqual(NaN, NaN)).toBe(true);
  });

  // **Null and Undefined**
  it('should return true for null and null', () => {
    expect(fastIsEqual(null, null)).toBe(true);
  });

  it('should return true for undefined and undefined', () => {
    expect(fastIsEqual(undefined, undefined)).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(fastIsEqual(null, undefined)).toBe(false);
  });

  // **Objects**
  it('should return true for identical objects', () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(fastIsEqual(obj, obj)).toBe(true);
  });

  it('should return true for deeply equal objects', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };
    expect(fastIsEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for objects with different keys', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 1 };
    expect(fastIsEqual(obj1, obj2)).toBe(false);
  });

  it('should return false for objects with different values', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    expect(fastIsEqual(obj1, obj2)).toBe(false);
  });

  // **Arrays**
  it('should return true for identical arrays', () => {
    const arr = [1, 2, 3];
    expect(fastIsEqual(arr, arr)).toBe(true);
  });

  it('should return true for deeply equal arrays', () => {
    const arr1 = [1, [2, 3]];
    const arr2 = [1, [2, 3]];
    expect(fastIsEqual(arr1, arr2)).toBe(true);
  });

  it('should return false for arrays with different lengths', () => {
    const arr1 = [1, 2];
    const arr2 = [1, 2, 3];
    expect(fastIsEqual(arr1, arr2)).toBe(false);
  });

  it('should return false for arrays with different elements', () => {
    const arr1 = [1, 2];
    const arr2 = [1, 3];
    expect(fastIsEqual(arr1, arr2)).toBe(false);
  });

  // **Dates**
  it('should return true for identical dates', () => {
    const date = new Date();
    expect(fastIsEqual(date, date)).toBe(true);
  });

  it('should return true for dates with the same timestamp', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    expect(fastIsEqual(date1, date2)).toBe(true);
  });

  it('should return false for dates with different timestamps', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-02');
    expect(fastIsEqual(date1, date2)).toBe(false);
  });

  // **Regular Expressions**
  it('should return true for identical regexes', () => {
    const regex = /a/g;
    expect(fastIsEqual(regex, regex)).toBe(true);
  });

  it('should return true for regexes with the same pattern and flags', () => {
    const regex1 = /a/g;
    const regex2 = /a/g;
    expect(fastIsEqual(regex1, regex2)).toBe(true);
  });

  it('should return false for regexes with different patterns', () => {
    const regex1 = /a/g;
    const regex2 = /b/g;
    expect(fastIsEqual(regex1, regex2)).toBe(false);
  });

  it('should return false for regexes with different flags', () => {
    const regex1 = /a/g;
    const regex2 = /a/i;
    expect(fastIsEqual(regex1, regex2)).toBe(false);
  });

  // **Maps**
  it('should return true for identical maps', () => {
    const map = new Map<string, number>([['a', 1]]);
    expect(fastIsEqual(map, map)).toBe(true);
  });

  it('should return true for maps with the same key-value pairs', () => {
    const map1 = new Map<string, number>([['a', 1]]);
    const map2 = new Map<string, number>([['a', 1]]);
    expect(fastIsEqual(map1, map2)).toBe(true);
  });

  it('should return false for maps with different key-value pairs', () => {
    const map1 = new Map<string, number>([['a', 1]]);
    const map2 = new Map<string, number>([['a', 2]]);
    expect(fastIsEqual(map1, map2)).toBe(false);
  });

  it('should return false for maps with different sizes', () => {
    const map1 = new Map<string, number>([['a', 1]]);
    const map2 = new Map<string, number>([['a', 1], ['b', 2]]);
    expect(fastIsEqual(map1, map2)).toBe(false);
  });

  // **Sets**
  it('should return true for identical sets', () => {
    const set = new Set<number>([1, 2]);
    expect(fastIsEqual(set, set)).toBe(true);
  });

  it('should return true for sets with the same elements', () => {
    const set1 = new Set<number>([1, 2]);
    const set2 = new Set<number>([1, 2]);
    expect(fastIsEqual(set1, set2)).toBe(true);
  });

  it('should return false for sets with different elements', () => {
    const set1 = new Set<number>([1, 2]);
    const set2 = new Set<number>([1, 3]);
    expect(fastIsEqual(set1, set2)).toBe(false);
  });

  it('should return false for sets with different sizes', () => {
    const set1 = new Set<number>([1, 2]);
    const set2 = new Set<number>([1]);
    expect(fastIsEqual(set1, set2)).toBe(false);
  });

  // **Circular References**
  it('should return true for circular references', () => {
    const obj1: any = {};
    obj1.self = obj1;
    const obj2: any = {};
    obj2.self = obj2;
    expect(fastIsEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for different circular references', () => {
    const obj1: any = {};
    obj1.self = obj1;
    const obj2: any = { self: {} };
    expect(fastIsEqual(obj1, obj2)).toBe(false);
  });

  // **Other Types (Functions, Promises)**
  it('should return true for the same function reference', () => {
    const func = () => { };
    expect(fastIsEqual(func, func)).toBe(true);
  });

  it('should return false for different functions', () => {
    const func1 = () => { };
    const func2 = () => { };
    expect(fastIsEqual(func1, func2)).toBe(false);
  });

  it('should return false for different promises', () => {
    const p1 = Promise.resolve(1);
    const p2 = Promise.resolve(1);
    expect(fastIsEqual(p1, p2)).toBe(false);
  });

  // **Mixed Types**
  it('should return false for different types', () => {
    expect(fastIsEqual(1, '1')).toBe(false);
    expect(fastIsEqual({}, [])).toBe(false);
    expect(fastIsEqual(new Map(), new Set())).toBe(false);
  });
});

// **Symbols**
it('should return true for identical symbols', () => {
  const sym = Symbol('test');
  expect(fastIsEqual(sym, sym)).toBe(true);
});

it('should return false for different symbols', () => {
  const sym1 = Symbol('test');
  const sym2 = Symbol('test');
  expect(fastIsEqual(sym1, sym2)).toBe(false);
});

it('should handle objects with symbol properties', () => {
  const sym = Symbol('test');
  const obj1 = { [sym]: 'value' };
  const obj2 = { [sym]: 'value' };
  expect(fastIsEqual(obj1, obj2)).toBe(true);
});

// **TypedArrays**
it('should return true for identical TypedArrays', () => {
  const arr1 = new Uint8Array([1, 2, 3]);
  const arr2 = new Uint8Array([1, 2, 3]);
  expect(fastIsEqual(arr1, arr2)).toBe(true);
});

it('should return false for TypedArrays with different values', () => {
  const arr1 = new Uint8Array([1, 2, 3]);
  const arr2 = new Uint8Array([1, 2, 4]);
  expect(fastIsEqual(arr1, arr2)).toBe(false);
});

it('should return false for different TypedArray types', () => {
  const arr1 = new Uint8Array([1, 2, 3]);
  const arr2 = new Int8Array([1, 2, 3]);
  expect(fastIsEqual(arr1, arr2)).toBe(false);
});

// **Sets with complex values**
it('should return true for sets with equal objects', () => {
  const obj1 = { a: 1 };
  const obj2 = { a: 1 };
  const set1 = new Set([obj1]);
  const set2 = new Set([obj2]);
  expect(fastIsEqual(set1, set2)).toBe(true);
});

it('should handle sets with nested structures', () => {
  const set1 = new Set([{ a: { b: 1 } }, [1, 2]]);
  const set2 = new Set([[1, 2], { a: { b: 1 } }]);
  expect(fastIsEqual(set1, set2)).toBe(true);
});

// **Maps with complex keys**
it('should handle maps with object keys', () => {
  const key1 = { id: 1 };
  const key2 = { id: 1 };
  const map1 = new Map([[key1, 'value']]);
  const map2 = new Map([[key2, 'value']]);
  expect(fastIsEqual(map1, map2)).toBe(true);
});

// **Error objects**
it('should return true for identical Error instances', () => {
  const err = new Error('test');
  expect(fastIsEqual(err, err)).toBe(true);
});

it('should return false for different Error instances with same message', () => {
  const err1 = new Error('test');
  const err2 = new Error('test');
  expect(fastIsEqual(err1, err2)).toBe(false);
});

// **Functions with properties**
it('should handle functions with properties', () => {
  const func1 = () => { };
  func1.customProp = 'value';
  const func2 = () => { };
  func2.customProp = 'value';
  expect(fastIsEqual(func1, func2)).toBe(false); // Different function references
});

// **Edge cases**
it('should handle objects with null prototype', () => {
  const obj1 = Object.create(null);
  obj1.a = 1;
  const obj2 = Object.create(null);
  obj2.a = 1;
  expect(fastIsEqual(obj1, obj2)).toBe(true);
});

it('should handle -0 and +0', () => {
  expect(fastIsEqual(-0, +0)).toBe(true);
});

it('should handle Infinity', () => {
  expect(fastIsEqual(Infinity, Infinity)).toBe(true);
  expect(fastIsEqual(-Infinity, -Infinity)).toBe(true);
  expect(fastIsEqual(Infinity, -Infinity)).toBe(false);
});

// **Complex nested circular references**
it('should handle mutual circular references', () => {
  const obj1: any = { a: {} };
  const obj2: any = { a: {} };
  obj1.a.b = obj1;
  obj2.a.b = obj2;
  expect(fastIsEqual(obj1, obj2)).toBe(true);
});

it('should handle arrays with circular references', () => {
  const arr1: any[] = [1, 2];
  const arr2: any[] = [1, 2];
  arr1.push(arr1);
  arr2.push(arr2);
  expect(fastIsEqual(arr1, arr2)).toBe(true);
});

// **Mixed circular references**
it('should handle different circular reference structures', () => {
  const obj1: any = { a: { b: {} } };
  obj1.a.b.c = obj1.a;
  const obj2: any = { a: { b: {} } };
  obj2.a.b.c = obj2;
  expect(fastIsEqual(obj1, obj2)).toBe(false);
});

// **ArrayBuffer and DataView**
it('should handle ArrayBuffer comparison', () => {
  const buffer1 = new ArrayBuffer(8);
  const buffer2 = new ArrayBuffer(8);
  new Uint8Array(buffer1).set([1, 2, 3, 4]);
  new Uint8Array(buffer2).set([1, 2, 3, 4]);
  expect(fastIsEqual(buffer1, buffer2)).toBe(true);
});

// **Property descriptors edge case**
it('should handle non-enumerable properties', () => {
  const obj1 = {};
  Object.defineProperty(obj1, 'hidden', { value: 'secret', enumerable: false });
  const obj2 = {};
  Object.defineProperty(obj2, 'hidden', { value: 'secret', enumerable: false });
  expect(fastIsEqual(obj1, obj2)).toBe(true); // Should ignore non-enumerable
});

// **Sparse arrays**
it('should handle sparse arrays correctly', () => {
  const arr1 = [1, , 3]; // sparse array with hole
  const arr2 = [1, undefined, 3];
  expect(fastIsEqual(arr1, arr2)).toBe(false);
});

// Test the unrolled loop optimization for small arrays
it('should handle arrays of exactly 8 elements (boundary case)', () => {
  const arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
  const arr2 = [1, 2, 3, 4, 5, 6, 7, 8];
  expect(fastIsEqual(arr1, arr2)).toBe(true);
});

// Test the Uint32Array optimization for ArrayBuffer
it('should handle ArrayBuffer with non-4-byte-aligned size', () => {
  const buffer1 = new ArrayBuffer(33); // 33 bytes = 8 * 4 + 1
  const buffer2 = new ArrayBuffer(33);
  new Uint8Array(buffer1).fill(42);
  new Uint8Array(buffer2).fill(42);
  expect(fastIsEqual(buffer1, buffer2)).toBe(true);
});

// Test small vs large ArrayBuffer paths
it('should handle small ArrayBuffer (< 32 bytes)', () => {
  const buffer1 = new ArrayBuffer(16);
  const buffer2 = new ArrayBuffer(16);
  new Uint8Array(buffer1).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  new Uint8Array(buffer2).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  expect(fastIsEqual(buffer1, buffer2)).toBe(true);
});

it('should handle sets with mixed primitive and complex values', () => {
  const obj1 = { a: 1 };
  const obj2 = { a: 1 };
  const set1 = new Set([1, 'hello', obj1, true]);
  const set2 = new Set([true, obj2, 1, 'hello']);
  expect(fastIsEqual(set1, set2)).toBe(true);
});

it('should handle sets where >70% are primitives (optimization path)', () => {
  const set1 = new Set([1, 2, 3, 4, 5, 6, 7, { a: 1 }, { b: 2 }]);
  const set2 = new Set([7, 6, 5, 4, 3, 2, 1, { b: 2 }, { a: 1 }]);
  expect(fastIsEqual(set1, set2)).toBe(true);
});

// Test empty object with symbols
it('should handle empty objects with only symbol properties', () => {
  const sym = Symbol('test');
  const obj1 = { [sym]: 'value' };
  const obj2 = { [sym]: 'value' };
  expect(fastIsEqual(obj1, obj2)).toBe(true);
});

// Test objects with exactly 8 properties (unroll boundary)
it('should handle objects with exactly 8 properties', () => {
  const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
  const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
  expect(fastIsEqual(obj1, obj2)).toBe(true);
});

// Test the optimized number type checking
it('should handle number comparison with non-number efficiently', () => {
  expect(fastIsEqual(42, '42')).toBe(false);
  expect(fastIsEqual(NaN, 'NaN')).toBe(false);
});

// Test early exit for primitives
it('should efficiently handle primitive type mismatches', () => {
  expect(fastIsEqual('string', true)).toBe(false);
  expect(fastIsEqual(true, 42)).toBe(false);
  expect(fastIsEqual(() => { }, 'function')).toBe(false);
});

// Test unrolled loop for typed arrays
it('should handle typed arrays with length exactly 16', () => {
  const arr1 = new Float32Array(16).fill(3.14);
  const arr2 = new Float32Array(16).fill(3.14);
  expect(fastIsEqual(arr1, arr2)).toBe(true);
});

it('should handle typed arrays with non-multiple-of-4 length', () => {
  const arr1 = new Int32Array([1, 2, 3, 4, 5, 6, 7]);
  const arr2 = new Int32Array([1, 2, 3, 4, 5, 6, 7]);
  expect(fastIsEqual(arr1, arr2)).toBe(true);
});

it('should handle empty maps', () => {
  expect(fastIsEqual(new Map(), new Map())).toBe(true);
});

it('should early exit on first few elements difference in large arrays', () => {
  const arr1 = new Array(1000).fill(1);
  const arr2 = new Array(1000).fill(1);
  arr2[2] = 2; // Difference in first 4 elements
  expect(fastIsEqual(arr1, arr2)).toBe(false);
});

it('should handle -0 === +0 correctly', () => {
  expect(fastIsEqual(-0, +0)).toBe(true);
  expect(fastIsEqual(-0, 0)).toBe(true);
});

it('should handle sparse arrays in small array optimization path', () => {
  const arr1 = [1, , 3, , 5]; // length 5, sparse
  const arr2 = [1, , 3, , 5];
  expect(fastIsEqual(arr1, arr2)).toBe(true);
});