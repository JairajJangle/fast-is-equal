# fast-is-equal

⚡️Blazing-fast equality checks, minus the baggage. A lean, standalone alternative to Lodash's `isEqual` - because speed matters.

[![npm version](https://img.shields.io/npm/v/fast-is-equal)](https://badge.fury.io/js/fast-is-equal) [![License](https://img.shields.io/github/license/JairajJangle/fast-is-equal)](https://github.com/JairajJangle/fast-is-equal/blob/main/LICENSE) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-is-equal)

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

`fast-is-equal` outperforms Lodash's `isEqual` in most cases. Run `npm run benchmark` locally to compare:

| Test Case | fastIsEqual (ms) | Lodash isEqual (ms) | Performance Gain |
|-----------|------------------|---------------------|------------------|
| Numbers | 0.000003 | 0.000007 | **2.56x faster** |
| Strings | 0.000008 | 0.000007 | 0.92x slower |
| Booleans | 0.000007 | 0.000007 | **0.95x faster** |
| NaN | 0.000008 | 0.000017 | **2.05x faster** |
| Simple Object (equal) | 0.000137 | 0.000531 | **3.87x faster** |
| Simple Object (unequal) | 0.000137 | 0.000560 | **4.09x faster** |
| Nested Object (equal) | 0.000240 | 0.001426 | **5.95x faster** |
| Nested Object (unequal) | 0.000242 | 0.001437 | **5.93x faster** |
| Array of Primitives (equal) | 0.000025 | 0.000163 | **6.44x faster** |
| Array of Primitives (unequal) | 0.000025 | 0.000170 | **6.82x faster** |
| Array of Objects (equal) | 0.000119 | 0.001237 | **10.39x faster** |
| Circular Reference | 0.000136 | 0.000928 | **6.83x faster** |
| Map (equal) | 0.000101 | 0.001765 | **17.55x faster** |
| Map (unequal) | 0.000098 | 0.001688 | **17.22x faster** |
| Set (equal) | 0.000098 | 0.001474 | **15.04x faster** |
| Set (unequal) | 0.000101 | 0.001765 | **17.55x faster** |
| Empty Object vs Array | 0.000015 | 0.000051 | **3.51x faster** |
| Map vs Set | 0.000026 | 0.000811 | **30.69x faster** |

[Benchmark logs](benchmarks/results.txt)

### Summary
- **Average Performance**: `fastIsEqual` is **10.58x faster** than Lodash's `isEqual`
- **Best Performance**: Map vs Set comparison shows **30.69x faster** execution
- **Iterations**: 1,000,000 per test case for accurate measurements

## License

MIT

## 🙏 Support the project

<p align="center" valign="center">   <a href="https://liberapay.com/FutureJJ/donate">     <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" >    </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">     <img src=".github/assets/upi.png" alt="Paypal_Donation_Button" height="50" >   </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">     <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >   </a> </p>
