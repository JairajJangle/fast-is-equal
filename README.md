# fast-is-equal

⚡️Blazing-fast equality checks, minus the baggage. A lean, standalone alternative to Lodash's `isEqual` - because speed matters.

[![npm version](https://img.shields.io/npm/v/fast-is-equal)](https://badge.fury.io/js/fast-is-equal) [![License](https://img.shields.io/github/license/JairajJangle/fast-is-equal)](https://github.com/JairajJangle/fast-is-equal/blob/main/LICENSE) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-is-equal) [![Workflow Status](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml/badge.svg)](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml) [![React Compatibility](https://img.shields.io/badge/React-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![React Native Compatibility](https://img.shields.io/badge/React%20Native-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![Angular Compatibility](https://img.shields.io/badge/Angular-Compatible-DD0031?logo=angular)](https://github.com/JairajJangle/fast-is-equal) [![Vue Compatibility](https://img.shields.io/badge/Vue-Compatible-4FC08D?logo=vue.js)](https://github.com/JairajJangle/fast-is-equal) [![Svelte Compatibility](https://img.shields.io/badge/Svelte-Compatible-FF3E00?logo=svelte)](https://github.com/JairajJangle/fast-is-equal) [![Modern JS Frameworks](https://img.shields.io/badge/Modern%20JS%20Frameworks-Compatible-F7DF1E?logo=javascript)](https://github.com/JairajJangle/fast-is-equal)

## Why fast-is-equal?

- 🚀 **Lightning Speed**: Up to **55.84x faster** than Lodash's `isEqual` (average **11.73x faster** across 49 test cases).
- 🪶 **Lightweight**: Dependency-free, minimal footprint.
- 🔄 **Versatile**: Handles primitives, objects, arrays, Maps, Sets, typed arrays, circular references, and more.
- 🏆 **Proven**: Outperforms Lodash in **93.9%** of benchmark cases.

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

## Performance Benchmarks

`fast-is-equal` was tested against Lodash's `isEqual` across **49 diverse test cases** with **1,000,000 iterations each**. The results speak for themselves:

### Key Highlights

- **Average Speed**: `fastIsEqual` is **11.73x faster** (0.000172 ms vs. 0.002013 ms).
- **Win Rate**: Outperforms Lodash in **46/49 cases (93.9%)**.
- **Peak Performance**: Up to **55.84x faster** for large Sets.

### Top 10 Performance Gains

| Test Case               | fastIsEqual (ms) | Lodash isEqual (ms) | Speed Boost  |
| ----------------------- | ---------------- | ------------------- | ------------ |
| Large Set (100 items)   | 0.000673         | 0.037564            | **55.84x** 🚀 |
| Map vs Set              | 0.000018         | 0.000485            | **26.52x** 🚀 |
| Large Map (50 entries)  | 0.001059         | 0.025756            | **24.32x** 🚀 |
| Map with primitives     | 0.000092         | 0.001487            | **16.09x** 🚀 |
| Map (unequal)           | 0.000092         | 0.001406            | **15.29x** 🚀 |
| Large TypedArray (1000) | 0.000944         | 0.013165            | **13.95x** 🚀 |
| ArrayBuffer (small)     | 0.000092         | 0.001263            | **13.74x** 🚀 |
| Empty Set               | 0.000058         | 0.000691            | **11.96x** 🚀 |
| Empty Map               | 0.000058         | 0.000684            | **11.84x** 🚀 |
| Set of strings          | 0.000082         | 0.000940            | **11.51x** 🚀 |

### Performance Across Categories

- **Primitives**: Competitive performance with smart optimizations for edge cases like NaN
- **Objects**: 1.59x–2.87x faster, with best gains on simple and nested structures
- **Arrays**: 1.24x–4.38x faster, excelling at primitive arrays and sparse arrays
- **TypedArrays**: 11.30x–13.95x faster, dramatically outperforming on all variants
- **Special Objects**: 8.63x–10.25x faster for Dates and RegExp
- **Collections**: 10.84x–55.84x faster for Maps and Sets, with exceptional gains on large collections
- **Circular References**: 3.04x–3.72x faster with optimized cycle detection

### Detailed Benchmark Results

Run `yarn benchmark` or `npm run benchmark` to test locally. Full results available in [benchmarks/results.txt](https://claude.ai/chat/benchmarks/results.txt).

#### Edge Cases Where Lodash Wins

Only 3 cases where Lodash marginally outperforms (by less than 5%):

- String vs Number: 0.95x slower
- Large Numbers: 0.99x slower
- Boolean vs Number: 0.99x slower

These represent cross-type comparisons with negligible real-world impact.

## Features

- **Dependency-Free**: No bloat, just performance.
- **Comprehensive**: Supports all JavaScript types, including edge cases like circular references and typed arrays.
- **Optimized**: Fine-tuned for real-world use cases (e.g., API responses, state objects).

## License

MIT

## 🙏 Support the project

<p align="center" valign="center">   <a href="https://liberapay.com/FutureJJ/donate">     <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" >    </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">     <img src=".github/assets/upi.png" alt="Paypal_Donation_Button" height="50" >   </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">     <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >   </a> </p>
