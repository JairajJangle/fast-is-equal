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

| Test Case                     | fastIsEqual (ms) | Lodash isEqual (ms) | Performance Gain  |
| ----------------------------- | ---------------- | ------------------- | ----------------- |
| Numbers                       | 0.000003         | 0.000006            | **1.67x faster**  |
| Strings                       | 0.000005         | 0.000005            | **1.08x faster**  |
| Booleans                      | 0.000005         | 0.000005            | **1.07x faster**  |
| NaN                           | 0.000006         | 0.000012            | **1.96x faster**  |
| Simple Object (equal)         | 0.000098         | 0.000272            | **2.78x faster**  |
| Simple Object (unequal)       | 0.000105         | 0.000275            | **2.63x faster**  |
| Nested Object (equal)         | 0.000199         | 0.000846            | **4.26x faster**  |
| Nested Object (unequal)       | 0.000211         | 0.000867            | **4.11x faster**  |
| Array of Primitives (equal)   | 0.000016         | 0.000098            | **5.92x faster**  |
| Array of Primitives (unequal) | 0.000015         | 0.000103            | **6.90x faster**  |
| Array of Objects (equal)      | 0.000080         | 0.000615            | **7.73x faster**  |
| Circular Reference            | 0.000095         | 0.000518            | **5.48x faster**  |
| Map (equal)                   | 0.000075         | 0.001401            | **18.57x faster** |
| Map (unequal)                 | 0.000070         | 0.001324            | **18.91x faster** |
| Set (equal)                   | 0.000071         | 0.000919            | **12.92x faster** |
| Set (unequal)                 | 0.000071         | 0.000913            | **12.93x faster** |
| Empty Object vs Array         | 0.000009         | 0.000033            | **3.67x faster**  |
| Map vs Set                    | 0.000018         | 0.000464            | **26.05x faster** |

[Benchmark logs](benchmarks/results.txt)

### Summary

- **Average Performance**: `fastIsEqual` is **7.54x faster** than Lodash's `isEqual`
- **Best Performance**: Map vs Set comparison shows **26.05x faster** execution
- **Iterations**: 1,000,000 per test case for accurate measurements

## License

MIT

## 🙏 Support the project

<p align="center" valign="center">   <a href="https://liberapay.com/FutureJJ/donate">     <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" >    </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">     <img src=".github/assets/upi.png" alt="Paypal_Donation_Button" height="50" >   </a>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">     <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >   </a> </p>
