# fast-is-equal

⚡️Blazing-fast equality checks, minus the baggage. A lean, standalone alternative to Lodash's `isEqual` - because speed matters.

[![npm version](https://img.shields.io/npm/v/fast-is-equal)](https://badge.fury.io/js/fast-is-equal) [![License](https://img.shields.io/github/license/JairajJangle/fast-is-equal)](https://github.com/JairajJangle/fast-is-equal/blob/main/LICENSE) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-is-equal) [![Workflow Status](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml/badge.svg)](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml) [![Coverage](https://raw.githubusercontent.com/JairajJangle/fast-is-equal/gh-pages/badges/coverage.svg)](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml) [![React Compatibility](https://img.shields.io/badge/React-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![React Native Compatibility](https://img.shields.io/badge/React%20Native-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![Angular Compatibility](https://img.shields.io/badge/Angular-Compatible-DD0031?logo=angular)](https://github.com/JairajJangle/fast-is-equal) [![Vue Compatibility](https://img.shields.io/badge/Vue-Compatible-4FC08D?logo=vue.js)](https://github.com/JairajJangle/fast-is-equal) [![Svelte Compatibility](https://img.shields.io/badge/Svelte-Compatible-FF3E00?logo=svelte)](https://github.com/JairajJangle/fast-is-equal) [![Modern JS Frameworks](https://img.shields.io/badge/Modern%20JS%20Frameworks-Compatible-F7DF1E?logo=javascript)](https://github.com/JairajJangle/fast-is-equal) [![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=flat&logo=github-sponsors)](https://github.com/sponsors/JairajJangle)


## Why fast-is-equal?

- 🚀 **Lightning Speed**: Up to **64.53x faster** than Lodash's `isEqual` (average **13.21x faster** across 49 test cases).
- 🪶 **Lightweight**: Dependency-free, minimal footprint.
- 🔄 **Versatile**: Handles primitives, objects, arrays, Maps, Sets, typed arrays, circular references, and more.
- 🏆 **Proven**: Outperforms Lodash in **98%** of benchmark cases.

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

- **Average Speed**: `fastIsEqual` is **13.21x faster** (0.000147 ms vs. 0.001941 ms).
- **Win Rate**: Outperforms Lodash in **48/49 cases (98.0%)**.
- **Peak Performance**: Up to **64.53x faster** for large Sets.

### Top 10 Performance Gains

| Test Case               | fastIsEqual (ms) | Lodash isEqual (ms) | Speed Boost  |
| ----------------------- | ---------------- | ------------------- | ------------ |
| Large Set (100 items)   | 0.000585         | 0.037756            | **64.53x** 🚀 |
| Large Map (50 entries)  | 0.000912         | 0.025252            | **27.70x** 🚀 |
| Map vs Set              | 0.000018         | 0.000469            | **26.45x** 🚀 |
| ArrayBuffer (small)     | 0.000068         | 0.001242            | **18.40x** 🚀 |
| Empty Map               | 0.000037         | 0.000661            | **18.04x** 🚀 |
| Empty Set               | 0.000037         | 0.000668            | **17.96x** 🚀 |
| Map with primitives     | 0.000081         | 0.001405            | **17.27x** 🚀 |
| Uint8Array              | 0.000038         | 0.000654            | **17.08x** 🚀 |
| Map (unequal)           | 0.000080         | 0.001316            | **16.41x** 🚀 |
| Float32Array            | 0.000041         | 0.000652            | **15.72x** 🚀 |

### Performance Across Categories

- **Primitives**: Competitive performance with smart optimizations for edge cases like NaN
- **Objects**: 1.45x–3.02x faster, with best gains on simple and nested structures
- **Arrays**: 2.40x–4.06x faster, excelling at primitive arrays and sparse arrays
- **TypedArrays**: 12.62x–17.08x faster, dramatically outperforming on all variants
- **Special Objects**: 9.43x–10.95x faster for Dates and RegExp
- **Collections**: 11.34x–64.53x faster for Maps and Sets, with exceptional gains on large collections
- **Circular References**: 3.48x–3.87x faster with optimized cycle detection

### Detailed Benchmark Results

Run `yarn benchmark` or `npm run benchmark` to test locally. Full results available in [benchmarks/results.txt](benchmarks/results.txt).

#### Edge Cases Where Lodash Wins

Only 1 case where Lodash marginally outperforms:

- Strings: 0.85x slower

This is a ~5-nanosecond comparison at the benchmark's measurement resolution, with negligible real-world impact.

## Features

- **Dependency-Free**: No bloat, just performance.
- **Comprehensive**: Supports all JavaScript types, including edge cases like circular references and typed arrays.
- **Optimized**: Fine-tuned for real-world use cases (e.g., API responses, state objects).

## License

MIT

## 🙏 Support the project

<p align="center" valign="center">   <a href="https://liberapay.com/FutureJJ/donate">     <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" >    </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">     <img src=".github/assets/upi.png" alt="Paypal_Donation_Button" height="50" >   </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">     <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >   </a> </p>
