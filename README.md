# fast-is-equal

⚡️Blazing-fast equality checks, minus the baggage. A lean, standalone alternative to Lodash's `isEqual` - because speed matters.

[![npm version](https://img.shields.io/npm/v/fast-is-equal)](https://badge.fury.io/js/fast-is-equal) [![License](https://img.shields.io/github/license/JairajJangle/fast-is-equal)](https://github.com/JairajJangle/fast-is-equal/blob/main/LICENSE) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-is-equal) [![Workflow Status](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml/badge.svg)](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml) [![Coverage](https://raw.githubusercontent.com/JairajJangle/fast-is-equal/gh-pages/badges/coverage.svg)](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml) [![React Compatibility](https://img.shields.io/badge/React-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![React Native Compatibility](https://img.shields.io/badge/React%20Native-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![Angular Compatibility](https://img.shields.io/badge/Angular-Compatible-DD0031?logo=angular)](https://github.com/JairajJangle/fast-is-equal) [![Vue Compatibility](https://img.shields.io/badge/Vue-Compatible-4FC08D?logo=vue.js)](https://github.com/JairajJangle/fast-is-equal) [![Svelte Compatibility](https://img.shields.io/badge/Svelte-Compatible-FF3E00?logo=svelte)](https://github.com/JairajJangle/fast-is-equal) [![Modern JS Frameworks](https://img.shields.io/badge/Modern%20JS%20Frameworks-Compatible-F7DF1E?logo=javascript)](https://github.com/JairajJangle/fast-is-equal) [![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=flat&logo=github-sponsors)](https://github.com/sponsors/JairajJangle)


## Why fast-is-equal?

- 🚀 **Lightning Speed**: Up to **72.28x faster** than Lodash's `isEqual` (average **17.44x faster** across 49 test cases).
- 🪶 **Lightweight**: Dependency-free, minimal footprint.
- 🔄 **Versatile**: Handles primitives, objects, arrays, Maps, Sets, typed arrays, circular references, and more.
- 🏆 **Proven**: Faster than Lodash in **45 of 49** benchmark cases, tied in 2, and behind only on two 5-nanosecond primitive comparisons.

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

## Equality semantics

Two values are equal when they are the same kind of value and hold the same content. Values of different
types, or objects with different constructors, are never equal.

| Kind | Equal when |
| --- | --- |
| Primitives | They are strictly equal. `NaN` equals `NaN`, and `0` equals `-0`. |
| Plain objects, class instances | Same constructor, same own enumerable string and symbol keys, deep-equal values. Key order does not matter. |
| Arrays | Same length and deep-equal elements. A hole is not equal to `undefined`. |
| `Date` | Same time value. Two invalid dates are equal. |
| `RegExp` | Same source and flags. |
| `Map` | Same size and deep-equal entries, in any order. Object keys are matched by deep equality. |
| `Set` | Same size and deep-equal members, in any order. |
| `ArrayBuffer`, typed arrays | Same type, same length, same contents. `NaN` elements are equal to each other. |
| `DataView` | Same byte length, byte offset and bytes. |
| Boxed primitives (`new Number(1)`) | Same wrapped value. A boxed value never equals its primitive. |
| Errors | Same constructor, `name` and `message`. |
| Subclasses of `Date`, `RegExp`, `Map`, `Set`, `Error` | Same subclass, then the rule of the built-in they extend. |
| Functions, `Promise`, `WeakMap`, `WeakSet` | They are the same reference. |

Shared references and cycles are compared by structure:

- An object used in several places equals separate copies of it, so `{ a: x, b: x }` equals its JSON clone.
- Circular structures are equal when their cycles have the same shape. An object that points to itself is
  not equal to a loop of two objects, even though reading either one gives the same values forever.

### Known limits

These cases are left as they are because handling them would slow down every comparison:

- A symbol key that exists only on the second argument is not detected: `fastIsEqual({ a: 1 }, { a: 1, [sym]: 2 })`
  returns `true`, while the reverse order returns `false`.
- An own property is not told apart from an inherited one with the identical value. This needs two objects
  that share a prototype holding that value and that differ in another key.
- Objects are compared by their own enumerable properties, so two instances whose state lives elsewhere
  (`URL`, classes that use only `#private` fields) are equal when they have no such properties.
- A plain object with an own `constructor` property set to a built-in constructor, such as
  `{ constructor: Date }`, is not supported.
- `{}` and `Object.create(null)` are not equal, because their constructors differ.
- Extra own properties on arrays, dates, regular expressions and boxed primitives are ignored.

## Performance Benchmarks

`fast-is-equal` was tested against Lodash's `isEqual` across **49 diverse test cases**. Each case runs 5 rounds of 200,000 calls per library, alternating which goes first, and keeps each library's fastest round. Results within ±3% count as a tie.

### Key Highlights

- **Average Speed**: `fastIsEqual` is **17.44x faster** (0.000112 ms vs. 0.001947 ms).
- **Win Rate**: Faster in **45/49 cases**, tied in 2, slower in 2.
- **Peak Performance**: Up to **72.28x faster** for large Sets (100 items).

### Top 10 Performance Gains

| Test Case               | fastIsEqual (ms) | Lodash isEqual (ms) | Speed Boost  |
| ----------------------- | ---------------- | ------------------- | ------------ |
| Large Set (100 items)   | 0.000532         | 0.038467            | **72.28x** 🚀 |
| Large Map (50 entries)  | 0.000886         | 0.025579            | **28.87x** 🚀 |
| Map with primitives     | 0.000052         | 0.001359            | **26.18x** 🚀 |
| Map (unequal)           | 0.000050         | 0.001277            | **25.76x** 🚀 |
| Map vs Set              | 0.000018         | 0.000435            | **24.18x** 🚀 |
| Set (unequal)           | 0.000044         | 0.000869            | **19.62x** 🚀 |
| Set of numbers          | 0.000045         | 0.000876            | **19.36x** 🚀 |
| Empty Map               | 0.000034         | 0.000614            | **18.21x** 🚀 |
| Empty Set               | 0.000034         | 0.000620            | **18.17x** 🚀 |
| ArrayBuffer (small)     | 0.000063         | 0.001116            | **17.59x** 🚀 |

### Performance Across Categories

- **Primitives**: On par with Lodash; both return within a few nanoseconds
- **Objects**: 2.67x to 5.57x faster, with best gains on simple and nested structures
- **Arrays**: 2.59x to 4.56x faster, excelling at primitive arrays and arrays of objects
- **TypedArrays**: 12.68x to 16.41x faster on all variants
- **Special Objects**: 9.28x to 9.42x faster for Dates and RegExp
- **Collections**: 16.14x to 72.28x faster for Maps and Sets, with the largest gains on large collections
- **Circular References**: 4.59x to 5.51x faster
- **Real-world shapes** (user, API response, config, state objects): 2.86x to 3.45x faster

### Detailed Benchmark Results

Run `yarn benchmark` or `npm run benchmark` to test locally. Full results available in [benchmarks/results.txt](benchmarks/results.txt).

#### Edge Cases Where Lodash Wins

- Strings: 0.91x
- Booleans: 0.96x

Both are single comparisons of about 5 nanoseconds, where the call itself dominates, with negligible real-world impact. Large Numbers and Negative Zero are ties.

### Comparing Two Versions of This Library

`yarn benchmark:compare` measures the working tree against the version on `main`, both loaded into the same process, and fails if any case is slower. The latest run is in [benchmarks/before-after.txt](benchmarks/before-after.txt).

## Features

- **Dependency-Free**: No bloat, just performance.
- **Comprehensive**: Supports all JavaScript types, including edge cases like circular references and typed arrays.
- **Optimized**: Fine-tuned for real-world use cases (e.g., API responses, state objects).

## License

MIT

## 🙏 Support the project

<p align="center" valign="center">   <a href="https://liberapay.com/FutureJJ/donate">     <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" >    </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">     <img src=".github/assets/upi.png" alt="Paypal_Donation_Button" height="50" >   </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">     <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >   </a> </p>
