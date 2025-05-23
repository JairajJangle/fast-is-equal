# fast-is-equal

⚡️Blazing-fast equality checks, minus the baggage. A lean, standalone alternative to Lodash's `isEqual` - because speed matters.

[![npm version](https://img.shields.io/npm/v/fast-is-equal)](https://badge.fury.io/js/fast-is-equal) [![License](https://img.shields.io/github/license/JairajJangle/fast-is-equal)](https://github.com/JairajJangle/fast-is-equal/blob/main/LICENSE) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-is-equal) [![Workflow Status](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml/badge.svg)](https://github.com/JairajJangle/fast-is-equal/actions/workflows/ci.yml) [![React Compatibility](https://img.shields.io/badge/React-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![React Native Compatibility](https://img.shields.io/badge/React%20Native-Compatible-61DAFB?logo=react)](https://github.com/JairajJangle/fast-is-equal) [![Angular Compatibility](https://img.shields.io/badge/Angular-Compatible-DD0031?logo=angular)](https://github.com/JairajJangle/fast-is-equal) [![Vue Compatibility](https://img.shields.io/badge/Vue-Compatible-4FC08D?logo=vue.js)](https://github.com/JairajJangle/fast-is-equal) [![Svelte Compatibility](https://img.shields.io/badge/Svelte-Compatible-FF3E00?logo=svelte)](https://github.com/JairajJangle/fast-is-equal) [![Modern JS Frameworks](https://img.shields.io/badge/Modern%20JS%20Frameworks-Compatible-F7DF1E?logo=javascript)](https://github.com/JairajJangle/fast-is-equal)


## Why fast-is-equal?

- 🚀 **Lightning Speed**: Up to **50.87x faster** than Lodash's `isEqual` (average **9.73x faster** across 49 test cases).
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

- **Average Speed**: `fastIsEqual` is **9.73x faster** (0.000212 ms vs. 0.002060 ms).
- **Win Rate**: Outperforms Lodash in **46/49 cases (93.9%)**.
- **Peak Performance**: Up to **50.87x faster** for large Sets.

### Top 10 Performance Gains

| Test Case              | fastIsEqual (ms) | Lodash isEqual (ms) | Speed Boost  |
| ---------------------- | ---------------- | ------------------- | ------------ |
| Large Set (100 items)  | 0.000760         | 0.038668            | **50.87x** 🚀 |
| Map vs Set             | 0.000019         | 0.000497            | **25.97x** 🚀 |
| Large Map (50 entries) | 0.001506         | 0.026325            | **17.48x** 🚀 |
| Map with primitives    | 0.000107         | 0.001537            | **14.33x** 🚀 |
| ArrayBuffer (small)    | 0.000090         | 0.001270            | **14.04x** 🚀 |
| Map (unequal)          | 0.000102         | 0.001414            | **13.87x** 🚀 |
| Uint8Array             | 0.000060         | 0.000664            | **10.99x** 🚀 |
| Set of strings         | 0.000087         | 0.000953            | **10.95x** 🚀 |
| Set (unequal)          | 0.000087         | 0.000954            | **10.93x** 🚀 |
| Float32Array           | 0.000061         | 0.000666            | **10.91x** 🚀 |

### Detailed Benchmark Results

Run `yarn benchmark` or `npm run benchmark` to test locally. Full results available in [benchmarks/results.txt](benchmarks/results.txt).

#### Notable Test Cases

- **Primitives**: Numbers (2.05x), NaN (1.41x), Negative Zero (1.02x).
- **Objects**: Simple (2.24x–2.73x), Nested (2.01x–2.13x), Deeply Nested (2.01x).
- **Arrays**: Primitives (4.20x–4.60x), Objects (2.40x), Typed Arrays (6.80x–14.04x).
- **Special Cases**: Circular References (3.14x–3.65x), Maps (9.79x–17.48x), Sets (10.27x–50.87x).

#### Rare Cases Where Lodash Wins

- Strings: 0.96x slower
- Booleans: 0.87x slower
- String vs Number: 0.78x slower

## Features

- **Dependency-Free**: No bloat, just performance.
- **Comprehensive**: Supports all JavaScript types, including edge cases like circular references and typed arrays.
- **Optimized**: Fine-tuned for real-world use cases (e.g., API responses, state objects).

## License

MIT

## 🙏 Support the project

<p align="center" valign="center">   <a href="https://liberapay.com/FutureJJ/donate">     <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" >    </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">     <img src=".github/assets/upi.png" alt="Paypal_Donation_Button" height="50" >   </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">     <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >   </a> </p>
