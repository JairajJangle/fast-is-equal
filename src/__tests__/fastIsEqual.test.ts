import { fastIsEqual } from '../index';

describe('fastIsEqual', () => {
  describe('Primitive Types', () => {
    describe('Basic primitives', () => {
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

      it('should return false for different types', () => {
        expect(fastIsEqual(1, '1')).toBe(false);
        expect(fastIsEqual({}, [])).toBe(false);
        expect(fastIsEqual(new Map(), new Set())).toBe(false);
      });

      it('should handle number comparison with non-number efficiently', () => {
        expect(fastIsEqual(42, '42')).toBe(false);
        expect(fastIsEqual(NaN, 'NaN')).toBe(false);
      });

      it('should efficiently handle primitive type mismatches', () => {
        expect(fastIsEqual('string', true)).toBe(false);
        expect(fastIsEqual(true, 42)).toBe(false);
        expect(fastIsEqual(() => { }, 'function')).toBe(false);
      });
    });

    describe('Special numeric values', () => {
      it('should return true for NaN and NaN', () => {
        expect(fastIsEqual(NaN, NaN)).toBe(true);
      });

      it('should handle -0 and +0', () => {
        expect(fastIsEqual(-0, +0)).toBe(true);
      });

      it('should handle -0 === +0 correctly', () => {
        expect(fastIsEqual(-0, +0)).toBe(true);
        expect(fastIsEqual(-0, 0)).toBe(true);
      });

      it('should handle Infinity', () => {
        expect(fastIsEqual(Infinity, Infinity)).toBe(true);
        expect(fastIsEqual(-Infinity, -Infinity)).toBe(true);
        expect(fastIsEqual(Infinity, -Infinity)).toBe(false);
      });
    });

    describe('Null and undefined', () => {
      it('should return true for null and null', () => {
        expect(fastIsEqual(null, null)).toBe(true);
      });

      it('should return true for undefined and undefined', () => {
        expect(fastIsEqual(undefined, undefined)).toBe(true);
      });

      it('should return false for null and undefined', () => {
        expect(fastIsEqual(null, undefined)).toBe(false);
      });
    });

    describe('Symbols', () => {
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
    });

    describe('BigInt', () => {
      it('should handle BigInt values', () => {
        expect(fastIsEqual(BigInt(123), BigInt(123))).toBe(true);
        expect(fastIsEqual(BigInt(123), BigInt(124))).toBe(false);
        expect(fastIsEqual(BigInt(123), 123)).toBe(false);
      });
    });
  });

  describe('Objects', () => {
    describe('Plain objects', () => {
      it('should return true for empty objects', () => {
        const obj1 = {};
        const obj2 = {};
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });

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

      it('should return false for objects with different numbers of keys', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 1, b: 2 };
        expect(fastIsEqual(obj1, obj2)).toBe(false);
      });

      it('should return false for objects with different values', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 2 };
        expect(fastIsEqual(obj1, obj2)).toBe(false);
      });

      it('should return true for objects with matching NaN values', () => {
        const obj1 = { a: NaN };
        const obj2 = { a: NaN };
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });

      it('should handle objects with numeric string keys correctly', () => {
        const obj1 = { '0': 'a', '1': 'b', '2': 'c' };
        const obj2 = { '2': 'c', '0': 'a', '1': 'b' };
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });

      it('should handle objects with exactly 8 properties', () => {
        const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
        const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });

      it('should return false comparing object to a symbol', () => {
        const sym = Symbol('test');
        const obj = {};
        expect(fastIsEqual(obj, sym)).toBe(false);
      });
    });

    describe('Objects with special prototypes', () => {
      it('should handle objects with null prototype', () => {
        const obj1 = Object.create(null);
        obj1.a = 1;
        const obj2 = Object.create(null);
        obj2.a = 1;
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });

      it('should handle null prototype objects with symbols', () => {
        const sym = Symbol('test');
        const obj1 = Object.create(null);
        obj1[sym] = { nested: true };
        const obj2 = Object.create(null);
        obj2[sym] = { nested: true };
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });
    });

    describe('Objects with symbol properties', () => {
      it('should handle empty objects with only symbol properties', () => {
        const sym = Symbol('test');
        const obj1 = { [sym]: 'value' };
        const obj2 = { [sym]: 'value' };
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });

      it('should correctly handle objects with only non-enumerable symbol properties', () => {
        const sym1 = Symbol('test');
        const sym2 = Symbol('test2');

        const obj1 = {};
        Object.defineProperty(obj1, sym1, { value: 'a', enumerable: false });
        Object.defineProperty(obj1, sym2, { value: 'b', enumerable: false });

        const obj2 = {};
        Object.defineProperty(obj2, sym1, { value: 'a', enumerable: false });
        Object.defineProperty(obj2, sym2, { value: 'b', enumerable: false });

        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });
    });

    describe('Objects with property descriptors', () => {
      it('should handle non-enumerable properties', () => {
        const obj1 = {};
        Object.defineProperty(obj1, 'hidden', { value: 'secret', enumerable: false });
        const obj2 = {};
        Object.defineProperty(obj2, 'hidden', { value: 'secret', enumerable: false });
        expect(fastIsEqual(obj1, obj2)).toBe(true);
      });
    });
  });

  describe('Arrays', () => {
    describe('Basic arrays', () => {
      it('should return true for identical arrays, same ref', () => {
        const arr = [1, 2, 3];
        expect(fastIsEqual(arr, arr)).toBe(true);
      });

      it('should return true for identical arrays', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
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

      it('should return true for empty arrays', () => {
        const arr1 = new Array();
        const arr2 = new Array();
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });
    });

    describe('Special cases small arrays', () => {
      it('should return true for two NaNs in a small array', () => {
        const arr1 = [1, 2, NaN, 3];
        const arr2 = [1, 2, NaN, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false for different symbols, different content', () => {
        const arr1 = [Symbol('one')];
        const arr2 = [Symbol('two')];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false for different symbols, same content', () => {
        const arr1 = [Symbol('one')];
        const arr2 = [Symbol('one')];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false if it contains mismatching nullish', () => {
        const arr1 = [1, 2, null, 3];
        const arr2 = [1, 2, undefined, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true if it contains matching nullish', () => {
        const arr1 = [1, 2, undefined, 3];
        const arr2 = [1, 2, undefined, 3];
        const arr3 = [1, 2, null, 3];
        const arr4 = [1, 2, null, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
        expect(fastIsEqual(arr3, arr4)).toBe(true);
      });

      it('should return false if it contains mismatching types', () => {
        const arr1 = [1, 2, Symbol('test'), 3];
        const arr2 = [1, 2, {}, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true for contained empty arrays', () => {
        const arr1 = [[]];
        const arr2 = [[]];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });
    });

    describe('Special cases arrays n > 8', () => {
      it('should return false if it contains mismatching nullish', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, null, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, undefined, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true if it contains matching nullish', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, undefined, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, undefined, 10];
        const arr3 = [1, 2, 3, 4, 5, 6, 7, 8, null, 10];
        const arr4 = [1, 2, 3, 4, 5, 6, 7, 8, null, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
        expect(fastIsEqual(arr3, arr4)).toBe(true);
      });

      it('should return false if it contains mismatching types', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, Symbol('test'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, {}, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false for contained array length mismatch', () => {
        const arr1 = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
        const arr2 = [[1, 2, 3, 4, 5, 6, 7, 8, 9]];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('shoulld return true for matching contained sparse arrays', () => {
        const arr1 = [[1, , 3, , 5, , 7, , 9, , 11, , 13, , 15]];
        const arr2 = [[1, , 3, , 5, , 7, , 9, , 11, , 13, , 15]];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('shoulld return false for different contained sparse arrays', () => {
        const arr1 = [[1, , 3, , 5, , 7, , 9, , 11, , 13, , 15]];
        const arr2 = [[1, , 3, , 5, , 7, , 9, , 11, 12, 13, , 15]];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true for two NaNs', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, NaN, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, NaN, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false for different symbols, different content', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, Symbol('one'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, Symbol('two'), 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true for matching dates', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-01'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-01'), 10];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false for different dates', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-01'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-02'), 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true for matching regular expressions', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]+$/, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]+$/, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false for different regular expressions', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]+$/, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]*$/, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false for objects with different symbol keys, different descriptions', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('two');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb2]: 'two' }, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false for objects with different symbol keys, same descriptions', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb2]: 'one' }, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true for objects with the same symbol properties', () => {
        const symb1 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false for objects with the mismatching symbol properties', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one', [symb2]: 'two' }, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true for objects with the same symbol properties, same content, and other props', () => {
        const symb1 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one', hello: 'world' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one', hello: 'world' }, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false for objects with different symbol properties and matching other props', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb2]: 'one' }, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false for objects with same symbol properties, but too many, matching other props', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb1]: 'one', [symb2]: 'one' }, 10];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });
    });

    describe('Arrays with objects', () => {
      it('should return true with equal objects', () => {
        const arr1 = [1, 2, { one: 'two' }, 3];
        const arr2 = [1, 2, { one: 'two' }, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false with equal objects but different other values', () => {
        const arr1 = [1, 2, { one: 'two' }, 3];
        const arr2 = [1, 2, { one: 'two' }, 4];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false with different objects', () => {
        const arr1 = [1, 2, { one: 'two' }, 3];
        const arr2 = [1, 2, { one: 'three' }, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true with equal objects at the end', () => {
        const arr1 = [1, 2, { one: 'two' }, 3, { four: 'five' }];
        const arr2 = [1, 2, { one: 'two' }, 3, { four: 'five' }];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false with different objects at the end', () => {
        const arr1 = [1, 2, { one: 'two' }, 3, { four: 'five' }];
        const arr2 = [1, 2, { one: 'two' }, 3, { four: 'six' }];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });
    });

    describe('Array optimization boundaries', () => {
      it('should handle arrays of exactly 8 elements (boundary case)', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should early exit on first few elements difference in large arrays', () => {
        const arr1 = new Array(1000).fill(1);
        const arr2 = new Array(1000).fill(1);
        arr2[2] = 2;
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });
    });

    describe('Sparse arrays', () => {
      it('should handle sparse arrays correctly', () => {
        const arr1 = [1, , 3]; // sparse array with hole
        const arr2 = [1, undefined, 3];
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should handle sparse arrays in small array optimization path', () => {
        const arr1 = [1, , 3, , 5];
        const arr2 = [1, , 3, , 5];
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });
    });

    describe('Arrays with circular references', () => {
      it('should handle arrays with circular references', () => {
        const arr1: any[] = [1, 2];
        const arr2: any[] = [1, 2];
        arr1.push(arr1);
        arr2.push(arr2);
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should handle deeply nested circular references', () => {
        const arr1: any = [1, { a: [] }];
        arr1[1].a.push(arr1);
        arr1.push(arr1[1]);

        const arr2: any = [1, { a: [] }];
        arr2[1].a.push(arr2);
        arr2.push(arr2[1]);

        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });
    });
  });

  describe('Built-in Objects', () => {
    describe('Date objects', () => {
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
    });

    describe('RegExp objects', () => {
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
    });

    describe('Error objects', () => {
      it('should return true for identical Error instances', () => {
        const err = new Error('test');
        expect(fastIsEqual(err, err)).toBe(true);
      });

      it('should return false for different Error instances with same message', () => {
        const err1 = new Error('test');
        const err2 = new Error('test');
        expect(fastIsEqual(err1, err2)).toBe(false);
      });
    });

    describe('Promise objects', () => {
      it('should return false for different promises', () => {
        const p1 = Promise.resolve(1);
        const p2 = Promise.resolve(1);
        expect(fastIsEqual(p1, p2)).toBe(false);
      });

      it('should handle promises with additional properties', () => {
        const p1 = Promise.resolve(1);
        const p2 = Promise.resolve(1);
        (p1 as any).customProp = 'test';
        (p2 as any).customProp = 'test';
        expect(fastIsEqual(p1, p2)).toBe(false);
      });
    });

    describe('Function objects', () => {
      it('should return true for the same function reference', () => {
        const func = () => { };
        expect(fastIsEqual(func, func)).toBe(true);
      });

      it('should return false for different functions', () => {
        const func1 = () => { };
        const func2 = () => { };
        expect(fastIsEqual(func1, func2)).toBe(false);
      });

      it('should handle functions with properties', () => {
        const func1 = () => { };
        func1.customProp = 'value';
        const func2 = () => { };
        func2.customProp = 'value';
        expect(fastIsEqual(func1, func2)).toBe(false);
      });
    });
  });

  describe('Collections', () => {
    describe('Map objects', () => {
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

      it('should handle empty maps', () => {
        expect(fastIsEqual(new Map(), new Map())).toBe(true);
      });

      it('should handle maps with object keys', () => {
        const key1 = { id: 1 };
        const key2 = { id: 1 };
        const map1 = new Map([[key1, 'value']]);
        const map2 = new Map([[key2, 'value']]);
        expect(fastIsEqual(map1, map2)).toBe(true);
      });

      it('should handle maps with NaN keys', () => {
        const map1 = new Map([[NaN, 'value']]);
        const map2 = new Map([[NaN, 'value']]);
        expect(fastIsEqual(map1, map2)).toBe(true);
      });

      it('should handle maps with undefined values', () => {
        const map1 = new Map([['key', undefined]]);
        const map2 = new Map([['key', undefined]]);
        expect(fastIsEqual(map1, map2)).toBe(true);
      });

      it('should handle maps with circular references between keys and values', () => {
        const key1: any = { id: 1 };
        const value1: any = { data: key1 };
        key1.ref = value1;

        const key2: any = { id: 1 };
        const value2: any = { data: key2 };
        key2.ref = value2;

        const map1 = new Map([[key1, value1]]);
        const map2 = new Map([[key2, value2]]);

        expect(fastIsEqual(map1, map2)).toBe(true);
      });

      it('should return false for maps with completely disperate objects, primitive keys', () => {
        const map1 = new Map([['one', { name: 'test' }]]);
        const map2 = new Map([['two', { last: 12 }]]);
        expect(fastIsEqual(map1, map2)).toBe(false);
      });

      it ('should return true for maps with matching objects, primitive keys', () => {
        const map1 = new Map([['one', { name: 'test' }]]);
        const map2 = new Map([['one', { name: 'test' }]]);
        expect(fastIsEqual(map1, map2)).toBe(true);
      });

      it('should return false for maps with completely disperate objects, object keys', () => {
        const map1 = new Map([[{ key: 'one' }, { name: 'test' }]]);
        const map2 = new Map([[{ key: 'two' }, { last: 12 }]]);
        expect(fastIsEqual(map1, map2)).toBe(false);
      });

      it('should return true for maps with matching objects, object keys', () => {
        const map1 = new Map([[{ key: 'one' }, { name: 'test' }]]);
        const map2 = new Map([[{ key: 'one' }, { name: 'test' }]]);
        expect(fastIsEqual(map1, map2)).toBe(true);
      });
    });

    describe('Set objects', () => {
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

      it('should handle sets with duplicate-looking but different objects', () => {
        const obj1a = { x: { y: 1 } };
        const obj1b = { x: { y: 1 } };
        const obj2a = { x: { y: 1 } };
        const obj2b = { x: { y: 1 } };

        const set1 = new Set([obj1a, obj1b]);
        const set2 = new Set([obj2a, obj2b]);

        expect(fastIsEqual(set1, set2)).toBe(true);
      });

      it('should handle sets containing self-referential objects', () => {
        const obj1: any = { name: 'test' };
        obj1.self = obj1;
        const obj2: any = { name: 'test' };
        obj2.self = obj2;

        const set1 = new Set([obj1, 'primitive']);
        const set2 = new Set(['primitive', obj2]);

        expect(fastIsEqual(set1, set2)).toBe(true);
      });

      it('should handle sets with many similar objects efficiently', () => {
        const createObj = (n: number) => ({ a: 1, b: 2, c: 3, id: n });
        const set1 = new Set(Array.from({ length: 100 }, (_, i) => createObj(i)));
        const set2 = new Set(Array.from({ length: 100 }, (_, i) => createObj(i)));

        expect(fastIsEqual(set1, set2)).toBe(true);
      });

      it('should return false for one empty set', () => {
        const set1 = new Set();
        const set2 = new Set<number>([1, 2, 3]);
        expect(fastIsEqual(set1, set2)).toBe(false);
      });

      it('should return true for matching empty sets', () => {
        const set1 = new Set();
        const set2 = new Set();
        expect(fastIsEqual(set1, set2)).toBe(true);
      });

      it('should handle sets of completely disperate objects', () => {
        const set1 = new Set([{ name: 'test' }]);
        const set2 = new Set([{ last: 12 }]);
        expect(fastIsEqual(set1, set2)).toBe(false);
      });
    });
  });

  describe('Binary Data Types', () => {
    describe('ArrayBuffer', () => {
      it('should return true for empty ArrayBuffers', () => {
        const buffer1 = new ArrayBuffer();
        const buffer2 = new ArrayBuffer();
        expect(fastIsEqual(buffer1, buffer2)).toBe(true);
      });

      it('should return false for ArrayBuffers of different lengths', () => {
        const buffer1 = new ArrayBuffer(4);
        const buffer2 = new ArrayBuffer(3);
        expect(fastIsEqual(buffer1, buffer2)).toBe(false);
      });

      it('should return false for different TypedArray views', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint16Array([1, 2, 3]);
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false for different array buffers', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -11, -12]);
        expect(fastIsEqual(arr1.buffer, arr2.buffer)).toBe(false);
      });

      it('should return false for different larger array buffers', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, -16, 17]);
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return false for different larger array buffers > 16', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, -17]);
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

      it('should return true for matching larger array buffers > 16', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should handle ArrayBuffer comparison', () => {
        const buffer1 = new ArrayBuffer(8);
        const buffer2 = new ArrayBuffer(8);
        new Uint8Array(buffer1).set([1, 2, 3, 4]);
        new Uint8Array(buffer2).set([1, 2, 3, 4]);
        expect(fastIsEqual(buffer1, buffer2)).toBe(true);
      });

      it('should handle ArrayBuffer with non-4-byte-aligned size', () => {
        const buffer1 = new ArrayBuffer(33); // 8 * 4 + 1
        const buffer2 = new ArrayBuffer(33);
        new Uint8Array(buffer1).fill(42);
        new Uint8Array(buffer2).fill(42);
        expect(fastIsEqual(buffer1, buffer2)).toBe(true);
      });

      it('should handle small ArrayBuffer (< 32 bytes)', () => {
        const buffer1 = new ArrayBuffer(16);
        const buffer2 = new ArrayBuffer(16);
        new Uint8Array(buffer1).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        new Uint8Array(buffer2).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        expect(fastIsEqual(buffer1, buffer2)).toBe(true);
      });

      it('should handle ArrayBuffer of exactly 32 bytes', () => {
        const buffer1 = new ArrayBuffer(32);
        const buffer2 = new ArrayBuffer(32);
        const view1 = new Uint8Array(buffer1);
        const view2 = new Uint8Array(buffer2);

        for (let i = 0; i < 32; i++) {
          view1[i] = i;
          view2[i] = i;
        }

        expect(fastIsEqual(buffer1, buffer2)).toBe(true);
      });

      it('should handle ArrayBuffer with different views correctly', () => {
        const buffer1 = new ArrayBuffer(8);
        const view1 = new DataView(buffer1);
        view1.setInt32(0, 42);
        view1.setInt32(4, 100);

        const buffer2 = new ArrayBuffer(8);
        const view2 = new DataView(buffer2);
        view2.setInt32(0, 42);
        view2.setInt32(4, 200);

        expect(fastIsEqual(buffer1, buffer2)).toBe(false);
      });
    });

    describe('TypedArrays', () => {
      it('should return true for empty TypedArrays', () => {
        const arr1 = new Uint8Array([]);
        const arr2 = new Uint8Array([]);
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });

      it('should return false for different TypedArray lengths', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([1, 2]);
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

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

      it('should return false for different TypedArray constructors with same values', () => {
        const arr1 = new Uint16Array([1, 2, 3]);
        const arr2 = new Uint32Array([1, 2, 3]);
        expect(fastIsEqual(arr1, arr2)).toBe(false);
      });

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

      it('should handle TypedArrays with different buffer offsets', () => {
        const buffer = new ArrayBuffer(16);
        const arr1 = new Uint8Array(buffer, 4, 4);
        const arr2 = new Uint8Array(buffer, 8, 4);
        arr1.set([1, 2, 3, 4]);
        arr2.set([1, 2, 3, 4]);
        expect(fastIsEqual(arr1, arr2)).toBe(true);
      });
    });

    describe('DataView', () => {
      it('should handle DataView comparison', () => {
        const buffer1 = new ArrayBuffer(8);
        const view1 = new DataView(buffer1);
        view1.setInt32(0, 42);
        view1.setFloat32(4, 3.14);

        const buffer2 = new ArrayBuffer(8);
        const view2 = new DataView(buffer2);
        view2.setInt32(0, 42);
        view2.setFloat32(4, 3.14);

        expect(fastIsEqual(view1, view2)).toBe(true);
      });

      it('should handle DataView with different values', () => {
        const view1 = new DataView(new ArrayBuffer(8));
        const view2 = new DataView(new ArrayBuffer(8));
        view1.setInt32(0, 42);
        view2.setInt32(0, 43);

        expect(fastIsEqual(view1, view2)).toBe(false);
      });

      it('should handle DataView with different byte lengths', () => {
        const view1 = new DataView(new ArrayBuffer(8));
        const view2 = new DataView(new ArrayBuffer(16));

        expect(fastIsEqual(view1, view2)).toBe(false);
      });
    });
  });

  describe('Circular References', () => {
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

    it('should handle mutual circular references', () => {
      const obj1: any = { a: {} };
      const obj2: any = { a: {} };
      obj1.a.b = obj1;
      obj2.a.b = obj2;
      expect(fastIsEqual(obj1, obj2)).toBe(true);
    });

    it('should handle different circular reference structures', () => {
      const obj1: any = { a: { b: {} } };
      obj1.a.b.c = obj1.a;
      const obj2: any = { a: { b: {} } };
      obj2.a.b.c = obj2;
      expect(fastIsEqual(obj1, obj2)).toBe(false);
    });
  });
});