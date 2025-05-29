// Pre-defined constants to avoid repeated string comparisons
const TYPEOF_OBJECT = 'object';
const TYPEOF_FUNCTION = 'function';
const TYPEOF_NUMBER = 'number';
const TYPEOF_STRING = 'string';
const TYPEOF_BOOLEAN = 'boolean';

// Inline NaN check for maximum speed
const isNaN = Number.isNaN;

// Cache for constructor checks
const dateConstructor = Date;
const regExpConstructor = RegExp;
const mapConstructor = Map;
const setConstructor = Set;
const arrayBufferConstructor = ArrayBuffer;
const promiseConstructor = Promise;
const errorConstructor = Error;

export function fastIsEqual(a: any, b: any) {
  // Fast path for strict equality
  if (a === b) return true;

  // Handle null/undefined early with single comparison
  if (a == null || b == null) return false;

  // Get types once
  const typeA = typeof a;

  // Type mismatch = not equal (avoid second typeof if possible)
  if (typeA === TYPEOF_NUMBER) {
    // Optimize number comparison - avoid typeof b when possible
    return typeof b === TYPEOF_NUMBER && isNaN(a) && isNaN(b);
  }

  if (typeA === TYPEOF_STRING || typeA === TYPEOF_BOOLEAN || typeA === TYPEOF_FUNCTION) {
    return false; // We know a !== b from first check
  }

  // Now check if b is also object
  if (typeof b !== TYPEOF_OBJECT) return false;

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

    // Empty arrays
    if (len === 0) return true;

    // Small arrays - unroll loop with minimal overhead
    if (len < 8) {
      for (let i = 0; i < len; i++) {
        // Sparse array check
        const hasA = i in a;
        if (hasA !== (i in b)) return false;
        if (!hasA) continue;

        const elemA = a[i];
        const elemB = b[i];

        // Fast path for identical elements
        if (elemA === elemB) continue;

        // Null check
        if (elemA == null || elemB == null) return false;

        // Type check
        const elemTypeA = typeof elemA;
        if (elemTypeA !== typeof elemB) return false;

        // Number special case
        if (elemTypeA === TYPEOF_NUMBER) {
          if (!isNaN(elemA) || !isNaN(elemB)) return false;
          continue;
        }

        // Primitive comparison
        if (elemTypeA !== TYPEOF_OBJECT && elemTypeA !== TYPEOF_FUNCTION) {
          return false;
        }

        // Need deep comparison - use minimal visited map
        if (!deepEqual(elemA, elemB, new Map())) return false;
      }
      return true;
    }

    // Large arrays - use deep equal
    return deepEqual(a, b, new Map());
  }

  // Handle built-in types inline for common cases
  if (aCtor === dateConstructor) {
    return a.getTime() === b.getTime();
  }

  if (aCtor === regExpConstructor) {
    return a.source === b.source && a.flags === b.flags;
  }

  // For all other objects, use deep comparison
  return deepEqual(a, b, new Map());
}

function deepEqual(valA: any, valB: any, visited: Map<any, any>): boolean {
  // Fast equality check
  if (valA === valB) return true;

  // Null check
  if (valA == null || valB == null) return false;

  // Type check
  const typeA = typeof valA;
  if (typeA !== typeof valB) return false;

  // Primitive types
  if (typeA === TYPEOF_NUMBER) {
    return isNaN(valA) && isNaN(valB);
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

  // Date - inline comparison
  if (ctorA === dateConstructor) {
    return valA.getTime() === valB.getTime();
  }

  // RegExp - inline comparison
  if (ctorA === regExpConstructor) {
    return valA.source === valB.source && valA.flags === valB.flags;
  }

  // Promise and Error - reference equality only
  if (ctorA === promiseConstructor || ctorA === errorConstructor) {
    return false;
  }

  // Arrays - optimized
  if (Array.isArray(valA)) {
    const len = valA.length;
    if (len !== valB.length) return false;

    // Mark visited early
    visited.set(valA, valB);
    visited.set(valB, valA);

    // Empty arrays
    if (len === 0) return true;

    // Optimized loop - check primitives first for early exit
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
  if (ctorA === mapConstructor) {
    const mapA = valA as Map<any, any>;
    const mapB = valB as Map<any, any>;

    if (mapA.size !== mapB.size) return false;

    // Empty maps
    if (mapA.size === 0) return true;

    visited.set(valA, valB);
    visited.set(valB, valA);

    // Optimized iteration
    for (const [key, valueA] of mapA) {
      // Fast primitive key path
      const keyType = typeof key;
      if (keyType !== TYPEOF_OBJECT && keyType !== TYPEOF_FUNCTION) {
        if (!mapB.has(key)) return false;
        const valueB = mapB.get(key);
        if (valueA !== valueB && !deepEqual(valueA, valueB, visited)) {
          return false;
        }
      } else {
        // Complex key - need full search
        let found = false;
        for (const [keyB, valueB] of mapB) {
          if (deepEqual(key, keyB, visited) && deepEqual(valueA, valueB, visited)) {
            found = true;
            break;
          }
        }
        if (!found) return false;
      }
    }
    return true;
  }

  // Set - highly optimized
  if (ctorA === setConstructor) {
    const setA = valA as Set<any>;
    const setB = valB as Set<any>;

    if (setA.size !== setB.size) return false;

    // Empty sets
    if (setA.size === 0) return true;

    // Early visited check
    visited.set(valA, valB);
    visited.set(valB, valA);

    // For equal sets, we can optimize by checking if all primitives exist first
    let hasPrimitives = false;
    let hasObjects = false;

    // First pass - categorize and check primitives
    for (const val of setA) {
      const valType = typeof val;
      if (valType === TYPEOF_OBJECT || valType === TYPEOF_FUNCTION) {
        hasObjects = true;
      } else {
        hasPrimitives = true;
        if (!setB.has(val)) return false; // Fast fail for primitives
      }
    }

    // If only primitives, we're done
    if (!hasObjects) return true;

    // For objects, create arrays for matching
    const objectsA: any[] = [];
    const objectsB: any[] = [];

    for (const val of setA) {
      const valType = typeof val;
      if (valType === TYPEOF_OBJECT || valType === TYPEOF_FUNCTION) {
        objectsA.push(val);
      }
    }

    for (const val of setB) {
      const valType = typeof val;
      if (valType === TYPEOF_OBJECT || valType === TYPEOF_FUNCTION) {
        objectsB.push(val);
      }
    }

    // Match objects
    const used = new Uint8Array(objectsB.length);
    for (const valA of objectsA) {
      let found = false;
      for (let j = 0; j < objectsB.length; j++) {
        if (!used[j]) {
          const newVisited = new Map(visited);
          if (deepEqual(valA, objectsB[j], newVisited)) {
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
  if (ctorA === arrayBufferConstructor) {
    const bufA = valA as ArrayBuffer;
    const bufB = valB as ArrayBuffer;

    const byteLength = bufA.byteLength;
    if (byteLength !== bufB.byteLength) return false;

    const viewA = new Uint8Array(bufA);
    const viewB = new Uint8Array(bufB);

    // Unroll loop for better performance on larger buffers
    let i = 0;
    const unrollEnd = byteLength - 7;

    for (; i < unrollEnd; i += 8) {
      if (viewA[i] !== viewB[i] ||
        viewA[i + 1] !== viewB[i + 1] ||
        viewA[i + 2] !== viewB[i + 2] ||
        viewA[i + 3] !== viewB[i + 3] ||
        viewA[i + 4] !== viewB[i + 4] ||
        viewA[i + 5] !== viewB[i + 5] ||
        viewA[i + 6] !== viewB[i + 6] ||
        viewA[i + 7] !== viewB[i + 7]) {
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

    // Small typed arrays
    if (len < 16) {
      for (let i = 0; i < len; i++) {
        if (arrA[i] !== arrB[i]) return false;
      }
      return true;
    }

    // Large typed arrays - unroll loop
    let i = 0;
    const unrollLen = len - 3;
    for (; i < unrollLen; i += 4) {
      if (arrA[i] !== arrB[i] ||
        arrA[i + 1] !== arrB[i + 1] ||
        arrA[i + 2] !== arrB[i + 2] ||
        arrA[i + 3] !== arrB[i + 3]) {
        return false;
      }
    }
    // Handle remaining
    for (; i < len; i++) {
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

  // Empty objects - check symbols
  if (keysALen === 0) {
    const checkSymbols = Object.getOwnPropertySymbols !== undefined;
    if (checkSymbols) {
      const symbolsA = Object.getOwnPropertySymbols(valA);
      if (symbolsA.length !== Object.getOwnPropertySymbols(valB).length) {
        return false;
      }
      // Check symbol properties
      for (let i = 0; i < symbolsA.length; i++) {
        const sym = symbolsA[i];
        if (!(sym in valB) || !deepEqual(valA[sym], valB[sym], visited)) {
          return false;
        }
      }
    }
    return true;
  }

  // Optimized property checking - batch primitive checks
  for (let i = 0; i < keysALen; i++) {
    const key = keysA[i];
    // Use in operator for fastest check
    if (!(key in valB)) return false;

    const propA = valA[key];
    const propB = valB[key];

    // Quick primitive equality check
    if (propA !== propB) {
      // Only do deep comparison if needed
      const propTypeA = typeof propA;
      if (propTypeA === TYPEOF_OBJECT || propTypeA === TYPEOF_FUNCTION) {
        if (!deepEqual(propA, propB, visited)) return false;
      } else if (propTypeA === TYPEOF_NUMBER) {
        if (!isNaN(propA) || !isNaN(propB)) return false;
      } else {
        return false;
      }
    }
  }

  // Check for symbols only if likely to have them
  const checkSymbols = Object.getOwnPropertySymbols !== undefined;
  if (checkSymbols) {
    const symbolsA = Object.getOwnPropertySymbols(valA);
    if (symbolsA.length > 0) {
      if (symbolsA.length !== Object.getOwnPropertySymbols(valB).length) {
        return false;
      }
      // Check symbol properties
      for (let i = 0; i < symbolsA.length; i++) {
        const sym = symbolsA[i];
        if (!(sym in valB) || !deepEqual(valA[sym], valB[sym], visited)) {
          return false;
        }
      }
    }
  }

  return true;
}