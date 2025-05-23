// Pre-defined constants to avoid repeated string comparisons
const TYPEOF_OBJECT = 'object';
const TYPEOF_FUNCTION = 'function';
const TYPEOF_NUMBER = 'number';
const TYPEOF_STRING = 'string';
const TYPEOF_BOOLEAN = 'boolean';

export function fastIsEqual(a: any, b: any) {
  // Fast path for strict equality
  if (a === b) return true;

  // Handle null/undefined early
  if (a == null || b == null) return false;

  // Get types once
  const typeA = typeof a;
  const typeB = typeof b;

  // Type mismatch = not equal
  if (typeA !== typeB) return false;

  // Handle primitives inline
  switch (typeA) {
    case TYPEOF_NUMBER:
      // Only NaN needs special handling
      return Number.isNaN(a) && Number.isNaN(b);
    case TYPEOF_STRING:
    case TYPEOF_BOOLEAN:
      return false; // We know a !== b
    case TYPEOF_FUNCTION:
      return false; // Functions use reference equality
  }

  // At this point, we know both are objects

  // Array check using fastest method
  const aIsArray = Array.isArray(a);
  if (aIsArray !== Array.isArray(b)) return false;

  // Constructor check
  const aCtor = a.constructor;
  if (aCtor !== b.constructor) return false;

  // Fast path for arrays - highly optimized
  if (aIsArray) {
    const len = a.length;
    if (len !== b.length) return false;

    // Optimized array comparison
    for (let i = 0; i < len; i++) {
      // Sparse array check using in operator
      if ((i in a) !== (i in b)) return false;
      if (!(i in a)) continue;

      const elemA = a[i];
      const elemB = b[i];

      // Fast path for identical elements
      if (elemA === elemB) continue;

      // Type check for deep comparison need
      const elemTypeA = typeof elemA;
      if (elemTypeA !== typeof elemB) return false;

      // Primitive comparison
      if (elemTypeA !== TYPEOF_OBJECT && elemTypeA !== TYPEOF_FUNCTION) {
        // Check for NaN
        if (elemTypeA === TYPEOF_NUMBER && Number.isNaN(elemA) && Number.isNaN(elemB)) continue;
        return false;
      }

      // Need deep comparison - use minimal visited map
      if (!deepEqual(elemA, elemB, new Map())) return false;
    }
    return true;
  }

  // For all other objects, use deep comparison
  return deepEqual(a, b, new Map());
}

// Inline helper for checking if value is primitive
function isPrimitive(val: any): boolean {
  const t = typeof val;
  return t !== TYPEOF_OBJECT && t !== TYPEOF_FUNCTION;
}

function deepEqual(valA: any, valB: any, visited: Map<any, any>): boolean {
  // Fast equality check
  if (valA === valB) return true;

  // Null check
  if (valA == null || valB == null) return false;

  // Type check with caching
  const typeA = typeof valA;
  if (typeA !== typeof valB) return false;

  // Primitive types
  if (typeA === TYPEOF_NUMBER) {
    return Number.isNaN(valA) && Number.isNaN(valB);
  }

  if (typeA !== TYPEOF_OBJECT && typeA !== TYPEOF_FUNCTION) {
    return false;
  }

  // Check visited - optimized with single lookup
  const visitedVal = visited.get(valA);
  if (visitedVal !== undefined) return visitedVal === valB;
  if (visited.has(valB)) return false;

  // Constructor check
  const ctorA = valA.constructor;
  if (ctorA !== valB.constructor) return false;

  // Handle built-in types with switch for better performance
  // Using constructor as discriminator when possible

  // Date - inline comparison
  if (ctorA === Date) {
    return valA.getTime() === valB.getTime();
  }

  // RegExp - inline comparison
  if (ctorA === RegExp) {
    return valA.source === valB.source && valA.flags === valB.flags;
  }

  // Promise and Error - reference equality only
  if (ctorA === Promise || ctorA === Error) {
    return false;
  }

  // Arrays - optimized
  if (Array.isArray(valA)) {
    const len = valA.length;
    if (len !== valB.length) return false;

    // Mark visited early
    visited.set(valA, valB);
    visited.set(valB, valA);

    // Optimized loop
    for (let i = 0; i < len; i++) {
      // Sparse array handling
      const hasA = i in valA;
      if (hasA !== (i in valB)) return false;
      if (!hasA) continue;

      const elemA = valA[i];
      const elemB = valB[i];

      if (elemA !== elemB && !deepEqual(elemA, elemB, visited)) {
        return false;
      }
    }
    return true;
  }

  // Map - optimized
  if (ctorA === Map) {
    const mapA = valA as Map<any, any>;
    const mapB = valB as Map<any, any>;

    if (mapA.size !== mapB.size) return false;

    visited.set(valA, valB);
    visited.set(valB, valA);

    // Try fast path first - assume primitive keys
    let complexKeyFound = false;

    for (const [key, valueA] of mapA) {
      if (!isPrimitive(key)) {
        complexKeyFound = true;
        break;
      }

      if (!mapB.has(key) || !deepEqual(valueA, mapB.get(key), visited)) {
        return false;
      }
    }

    if (!complexKeyFound) return true;

    // Slow path - complex keys
    for (const [keyA, valueA] of mapA) {
      let found = false;
      for (const [keyB, valueB] of mapB) {
        if (deepEqual(keyA, keyB, visited) && deepEqual(valueA, valueB, visited)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  // Set - highly optimized
  if (ctorA === Set) {
    const setA = valA as Set<any>;
    const setB = valB as Set<any>;

    if (setA.size !== setB.size) return false;

    // Early visited check
    visited.set(valA, valB);

    // Scan for complexity
    let hasComplex = false;
    for (const val of setA) {
      if (!isPrimitive(val)) {
        hasComplex = true;
        break;
      }
    }

    // Fast path - all primitives
    if (!hasComplex) {
      for (const val of setA) {
        if (!setB.has(val)) return false;
      }
      return true;
    }

    // Slow path - need one-to-one matching
    // Avoid Array.from for performance
    const iterB = setB.values();
    const arrB: any[] = [];
    for (const val of iterB) {
      arrB.push(val);
    }

    const used = new Uint8Array(arrB.length); // Faster than boolean array

    for (const valA of setA) {
      let found = false;
      for (let j = 0; j < arrB.length; j++) {
        if (!used[j]) {
          const newVisited = new Map(visited);
          if (deepEqual(valA, arrB[j], newVisited)) {
            used[j] = 1;
            found = true;
            break;
          }
        }
      }
      if (!found) return false;
    }

    return true;
  }

  // ArrayBuffer - optimized
  if (ctorA === ArrayBuffer) {
    const bufA = valA as ArrayBuffer;
    const bufB = valB as ArrayBuffer;

    const byteLength = bufA.byteLength;
    if (byteLength !== bufB.byteLength) return false;

    const viewA = new Uint8Array(bufA);
    const viewB = new Uint8Array(bufB);

    // Unroll loop for better performance
    let i = 0;
    const len = byteLength - 3;
    for (; i < len; i += 4) {
      if (viewA[i] !== viewB[i] ||
        viewA[i + 1] !== viewB[i + 1] ||
        viewA[i + 2] !== viewB[i + 2] ||
        viewA[i + 3] !== viewB[i + 3]) {
        return false;
      }
    }
    // Handle remaining bytes
    for (; i < byteLength; i++) {
      if (viewA[i] !== viewB[i]) return false;
    }

    return true;
  }

  // TypedArrays
  if (ArrayBuffer.isView(valA)) {
    const arrA = valA as any;
    const arrB = valB as any;
    const len = arrA.length;
    if (len !== arrB.length) return false;

    // Direct comparison
    for (let i = 0; i < len; i++) {
      if (arrA[i] !== arrB[i]) return false;
    }
    return true;
  }

  // Plain objects - highly optimized
  visited.set(valA, valB);
  visited.set(valB, valA);

  // Get keys efficiently
  const keysA = Object.keys(valA);
  const keysALen = keysA.length;

  // Quick length check
  if (keysALen !== Object.keys(valB).length) return false;

  // Check for symbols only if likely
  let symbolsA: symbol[] | null = null;
  const checkSymbols = Object.getOwnPropertySymbols !== undefined;

  if (checkSymbols) {
    symbolsA = Object.getOwnPropertySymbols(valA);
    if (symbolsA.length > 0) {
      if (symbolsA.length !== Object.getOwnPropertySymbols(valB).length) {
        return false;
      }
    }
  }

  // Optimized property checking
  for (let i = 0; i < keysALen; i++) {
    const key = keysA[i];
    // Use in operator for fastest check
    if (!(key in valB)) return false;

    const propA = valA[key];
    const propB = valB[key];

    if (propA !== propB && !deepEqual(propA, propB, visited)) {
      return false;
    }
  }

  // Check symbols if present
  if (symbolsA && symbolsA.length > 0) {
    for (let i = 0; i < symbolsA.length; i++) {
      const sym = symbolsA[i];
      if (!(sym in valB) || !deepEqual(valA[sym], valB[sym], visited)) {
        return false;
      }
    }
  }

  return true;
}