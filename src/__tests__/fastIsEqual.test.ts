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