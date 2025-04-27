# fast-is-equal

Blazing-fast equality checks, minus the baggage. A lean, standalone alternative to Lodash’s `isEqual` - because speed matters.

[![npm version](https://img.shields.io/npm/v/fast-is-equal)](https://badge.fury.io/js/fast-is-equal)

## Installation

Using yarn:

```bash
yarn add fast-is-equal
```

Using npm:

```bash
npm install fast-is-equal
```

## Usage
```typescript
import { fastIsEqual } from 'fast-is-equal';

console.log(fastIsEqual(1, 1)); // true
console.log(fastIsEqual({ a: 1 }, { a: 1 })); // true
console.log(fastIsEqual([1, 2], [1, 3])); // false
```

## Features
- Lightweight and dependency-free.
- Handles primitives, objects, arrays, Maps, Sets, circular references, and more.
- Optimized for performance (see benchmarks).

## Benchmarks
`fast-is-equal` outperforms Lodash’s `isEqual` in most cases. Run `npm run benchmark` locally to compare:
```bash
Performance Comparison: fastIsEqual vs Lodash isEqual
Iterations per test case: 1000000
----------------------------------------
Test Case 1: Numbers
  fastIsEqual: 0.000003 ms
  Lodash isEqual: 0.000006 ms
  Difference (fastIsEqual - Lodash): -0.000002 ms
  fastIsEqual is 1.62x faster than Lodash
----------------------------------------
Test Case 2: Strings
  fastIsEqual: 0.000005 ms
  Lodash isEqual: 0.000005 ms
  Difference (fastIsEqual - Lodash): -0.000000 ms
  fastIsEqual is 1.08x faster than Lodash
----------------------------------------
Test Case 3: Booleans
  fastIsEqual: 0.000005 ms
  Lodash isEqual: 0.000005 ms
  Difference (fastIsEqual - Lodash): -0.000000 ms
  fastIsEqual is 1.06x faster than Lodash
----------------------------------------
Test Case 4: NaN
  fastIsEqual: 0.000006 ms
  Lodash isEqual: 0.000012 ms
  Difference (fastIsEqual - Lodash): -0.000006 ms
  fastIsEqual is 1.98x faster than Lodash
----------------------------------------
Test Case 5: Simple Object (equal)
  fastIsEqual: 0.000097 ms
  Lodash isEqual: 0.000271 ms
  Difference (fastIsEqual - Lodash): -0.000174 ms
  fastIsEqual is 2.80x faster than Lodash
----------------------------------------
Test Case 6: Simple Object (unequal)
  fastIsEqual: 0.000105 ms
  Lodash isEqual: 0.000271 ms
  Difference (fastIsEqual - Lodash): -0.000165 ms
  fastIsEqual is 2.57x faster than Lodash
----------------------------------------
Test Case 7: Nested Object (equal)
  fastIsEqual: 0.000184 ms
  Lodash isEqual: 0.000835 ms
  Difference (fastIsEqual - Lodash): -0.000651 ms
  fastIsEqual is 4.53x faster than Lodash
----------------------------------------
Test Case 8: Nested Object (unequal)
  fastIsEqual: 0.000197 ms
  Lodash isEqual: 0.000850 ms
  Difference (fastIsEqual - Lodash): -0.000653 ms
  fastIsEqual is 4.31x faster than Lodash
----------------------------------------
Test Case 9: Array of Primitives (equal)
  fastIsEqual: 0.000017 ms
  Lodash isEqual: 0.000102 ms
  Difference (fastIsEqual - Lodash): -0.000085 ms
  fastIsEqual is 5.95x faster than Lodash
----------------------------------------
Test Case 10: Array of Primitives (unequal)
  fastIsEqual: 0.000015 ms
  Lodash isEqual: 0.000103 ms
  Difference (fastIsEqual - Lodash): -0.000088 ms
  fastIsEqual is 6.79x faster than Lodash
----------------------------------------
Test Case 11: Array of Objects (equal)
  fastIsEqual: 0.000078 ms
  Lodash isEqual: 0.000638 ms
  Difference (fastIsEqual - Lodash): -0.000560 ms
  fastIsEqual is 8.15x faster than Lodash
----------------------------------------
Test Case 12: Circular Reference
  fastIsEqual: 0.000095 ms
  Lodash isEqual: 0.000493 ms
  Difference (fastIsEqual - Lodash): -0.000399 ms
  fastIsEqual is 5.22x faster than Lodash
----------------------------------------
Test Case 13: Map (equal)
  fastIsEqual: 0.000074 ms
  Lodash isEqual: 0.001383 ms
  Difference (fastIsEqual - Lodash): -0.001309 ms
  fastIsEqual is 18.67x faster than Lodash
----------------------------------------
Test Case 14: Map (unequal)
  fastIsEqual: 0.000076 ms
  Lodash isEqual: 0.001330 ms
  Difference (fastIsEqual - Lodash): -0.001255 ms
  fastIsEqual is 17.59x faster than Lodash
----------------------------------------
Test Case 15: Set (equal)
  fastIsEqual: 0.000073 ms
  Lodash isEqual: 0.000949 ms
  Difference (fastIsEqual - Lodash): -0.000876 ms
  fastIsEqual is 13.07x faster than Lodash
----------------------------------------
Test Case 16: Set (unequal)
  fastIsEqual: 0.000070 ms
  Lodash isEqual: 0.000930 ms
  Difference (fastIsEqual - Lodash): -0.000860 ms
  fastIsEqual is 13.22x faster than Lodash
----------------------------------------
Test Case 17: Empty Object vs Array
  fastIsEqual: 0.000009 ms
  Lodash isEqual: 0.000043 ms
  Difference (fastIsEqual - Lodash): -0.000034 ms
  fastIsEqual is 4.74x faster than Lodash
----------------------------------------
Test Case 18: Map vs Set
  fastIsEqual: 0.000018 ms
  Lodash isEqual: 0.000469 ms
  Difference (fastIsEqual - Lodash): -0.000452 ms
  fastIsEqual is 26.55x faster than Lodash
----------------------------------------
Average Performance:
  fastIsEqual: 0.000063 ms
  Lodash isEqual: 0.000483 ms
  fastIsEqual is on average 7.71x faster than Lodash
```

## License
MIT
```
MIT License

Copyright (c) 2025 Jairaj Jangle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
