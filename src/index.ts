// Pre-defined constants to avoid repeated string comparisons
const TYPEOF_OBJECT = 'object';
const TYPEOF_FUNCTION = 'function';
const TYPEOF_NUMBER = 'number';
const TYPEOF_STRING = 'string';
const TYPEOF_BOOLEAN = 'boolean';
const TYPEOF_SYMBOL = 'symbol';
const TYPEOF_BIGINT = 'bigint';

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
const dataViewConstructor = DataView;
const objectConstructor = Object;
const numberConstructor = Number;
const booleanConstructor = Boolean;
const symbolConstructor = Symbol;
const bigIntConstructor = typeof BigInt === TYPEOF_FUNCTION ? BigInt : undefined;
const weakMapConstructor = WeakMap;
const weakSetConstructor = WeakSet;

// Constructor of the last class instance that went through the full dispatch
// chain and turned out to be an ordinary object. Instances of the same class
// then take the plain-object path directly.
let lastPlainCtor: unknown = null;

// Cycle tracker: the pairs of containers currently being compared, innermost
// last. It is one array so that ordinary nesting costs a single allocation:
//
//   [indexA, seenB, top, verified, a0, b0, a1, b1, ...]
//
// - top: index of the next free slot. Slots at or above it are stale.
// - indexA, seenB, verified: used only past DEEP_LIMIT, see enter() and
//   noDuplicateB().
//
// A pair is pushed only right before its container recurses, and popped when
// the container turns out equal. A failed comparison leaves its entries
// behind, because `false` propagates to the top; the two callers that keep
// going after a failure (Map key and Set member matching) restore `top`.
type Tracker = any[];
const TRACK_INDEX_A = 0;
const TRACK_SEEN_B = 1;
const TRACK_TOP = 2;
const TRACK_VERIFIED = 3;
const TRACK_FIRST = 4;

// Nesting depth, in pairs, up to which the cycle check scans the stack.
// Deeper comparisons switch to a Map index so the check stays O(1).
const DEEP_PAIRS = 24;
const DEEP_LIMIT = TRACK_FIRST + 2 * DEEP_PAIRS;

// In deep mode, how many of the innermost pairs are checked by scanning
// before falling back to the index
const NEAR_PAIRS = 2;

// Pushes a pair, creating the tracker on first use. Returns the tracker.
function enter(tracker: Tracker | null, valA: any, valB: any): Tracker {
  if (tracker === null) {
    // Room for 7 pairs before the array has to grow
    return [
      null, null, TRACK_FIRST + 2, 0, valA, valB,
      null, null, null, null, null, null, null, null, null, null, null, null
    ];
  }

  const top = tracker[TRACK_TOP];
  tracker[top] = valA;
  tracker[top + 1] = valB;
  tracker[TRACK_TOP] = top + 2;

  const indexA = tracker[TRACK_INDEX_A];
  if (indexA !== null) {
    indexA.set(valA, top);
  } else if (top >= DEEP_LIMIT) {
    // Too deep to keep scanning: index every A object by its stack slot.
    // Entries are never deleted; a lookup is valid only while its slot is
    // below `top` and still holds the object.
    const index = new Map();
    for (let k = TRACK_FIRST; k <= top; k += 2) index.set(tracker[k], k);
    tracker[TRACK_INDEX_A] = index;
    tracker[TRACK_VERIFIED] = TRACK_FIRST;
  }
  return tracker;
}

// Pops the innermost pair
function leave(tracker: Tracker): void {
  const top = tracker[TRACK_TOP] - 2;
  tracker[TRACK_TOP] = top;
  if (tracker[TRACK_VERIFIED] > top) tracker[TRACK_VERIFIED] = top;
}

// Drops every pair pushed since `mark` was read from TRACK_TOP
function truncate(tracker: Tracker, mark: number): void {
  tracker[TRACK_TOP] = mark;
  if (tracker[TRACK_VERIFIED] > mark) tracker[TRACK_VERIFIED] = mark;
}

// Deep mode only. While scanning, a B object that is already in progress
// under a different partner fails the comparison immediately. Deep mode
// skips that test on the way down and runs it here instead, when an A object
// closes a cycle: true when no B object is on the stack twice. Slots below
// `verified` are already recorded, so each pair is recorded once per visit
// and acyclic data never gets here.
function noDuplicateB(tracker: Tracker): boolean {
  let seenB = tracker[TRACK_SEEN_B];
  if (seenB === null) seenB = tracker[TRACK_SEEN_B] = new Set();

  const top = tracker[TRACK_TOP];
  for (let k = tracker[TRACK_VERIFIED]; k < top; k += 2) {
    const b = tracker[k + 1];
    const size = seenB.size;
    seenB.add(b);
    if (seenB.size === size) {
      // Recorded before. Either it was popped since, or it is still on the
      // stack under another partner - the stack itself tells which.
      for (let j = k - 1; j > TRACK_FIRST; j -= 2) {
        if (tracker[j] === b) return false;
      }
    }
  }
  tracker[TRACK_VERIFIED] = top;
  return true;
}

export function fastIsEqual(a: any, b: any) {
  // Fast path for strict equality
  if (a === b) return true;

  // Handle null/undefined early with single comparison
  if (a == null || b == null) return false;

  // Get types once
  const typeA = typeof a;

  // Type mismatch = not equal (avoid second typeof if possible)
  if (typeA === TYPEOF_NUMBER) {
    // Only NaN pairs survive a failed === between numbers; x !== x is the
    // cheapest NaN test (no call)
    return typeof b === TYPEOF_NUMBER && a !== a && b !== b;
  }

  // undefined is excluded by the null check above, so any remaining
  // non-object type (string/boolean/function/symbol/bigint) can't be equal -
  // we know a !== b from the first check
  if (typeA !== TYPEOF_OBJECT) return false;

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
      // Phase 1 - dense fast loop, no `in` operator at all
      let i = 0;
      for (; i < len; i++) {
        const elemA = a[i];
        const elemB = b[i];

        // Possible hole or explicit undefined - fall to sparse-aware loop for the rest
        if (elemA === undefined || elemB === undefined) break;

        // Fast path for identical elements
        if (elemA === elemB) continue;

        // Null check (null still possible - only undefined breaks out)
        if (elemA == null || elemB == null) return false;

        // Type check
        const elemTypeA = typeof elemA;
        if (elemTypeA !== typeof elemB) return false;

        // Number special case
        if (elemTypeA === TYPEOF_NUMBER) {
          if (!(isNaN(elemA) && isNaN(elemB))) return false;
          continue;
        }

        // Primitives and functions - unequal, since they are not identical
        if (elemTypeA !== TYPEOF_OBJECT) {
          return false;
        }

        // Need deep comparison - visited map allocated lazily on demand
        if (!deepEqualObjects(elemA, elemB, null)) return false;
      }
      if (i === len) return true;

      // Phase 2 - sparse-aware remainder, baseline per-element logic
      for (; i < len; i++) {
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
          if (!(isNaN(elemA) && isNaN(elemB))) return false;
          continue;
        }

        // Primitives and functions - unequal, since they are not identical
        if (elemTypeA !== TYPEOF_OBJECT) {
          return false;
        }

        // Need deep comparison - visited map allocated lazily on demand
        if (!deepEqualObjects(elemA, elemB, null)) return false;
      }
      return true;
    }

    // Large arrays - use deep equal
    return deepEqual(a, b, null);
  }

  // Handle built-in types inline for common cases
  if (aCtor === dateConstructor) {
    // Invalid dates have a NaN time value and are equal to each other
    const timeA = a.getTime();
    const timeB = b.getTime();
    return timeA === timeB || (timeA !== timeA && timeB !== timeB);
  }

  if (aCtor === regExpConstructor) {
    return a.source === b.source && a.flags === b.flags;
  }

  // Plain objects - the most common case, skip the dispatch chain
  if (aCtor === objectConstructor || aCtor === undefined) {
    return equalPlainObjects(a, b, null);
  }

  // For all other objects, use deep comparison
  return deepEqualObjects(a, b, null);
}

function deepEqual(valA: any, valB: any, visited: Tracker | null): boolean {
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

  // Strings, booleans, symbols, bigints and functions are equal only when
  // identical, which the first check already ruled out
  if (typeA !== TYPEOF_OBJECT) {
    return false;
  }

  return deepEqualObjects(valA, valB, visited);
}

// Both values are non-null objects and are not identical
function deepEqualObjects(valA: any, valB: any, visited: Tracker | null): boolean {
  // Cycle check - only when something is in progress. A pair that is already
  // being compared is equal as far as this path is concerned; an object that
  // is in progress under a different partner is not.
  if (visited !== null) {
    const top = visited[TRACK_TOP];
    const indexA = visited[TRACK_INDEX_A];
    if (indexA === null) {
      for (let k = top - 2; k >= TRACK_FIRST; k -= 2) {
        if (visited[k] === valA) return visited[k + 1] === valB;
        if (visited[k + 1] === valB) return false;
      }
    } else {
      // Nearby ancestors first: links back to a parent or grandparent are
      // the common cycle and are cheaper to find by looking than by hashing
      const stop = top - 2 * NEAR_PAIRS;
      for (let k = top - 2; k >= stop && k >= TRACK_FIRST; k -= 2) {
        if (visited[k] === valA) return visited[k + 1] === valB && noDuplicateB(visited);
      }
      const k = indexA.get(valA);
      if (k !== undefined && k < top && visited[k] === valA) {
        return visited[k + 1] === valB && noDuplicateB(visited);
      }
    }
  }

  // Constructor check
  const ctorA = valA.constructor;
  if (ctorA !== valB.constructor) return false;

  // Fast path for plain objects - the most common recursion target.
  // ({}).constructor is Object; Object.create(null) has undefined constructor.
  // lastPlainCtor covers instances of the most recently seen ordinary class.
  // Everything else falls through the dispatch chain below.
  if (ctorA === objectConstructor || ctorA === undefined || ctorA === lastPlainCtor) {
    return equalPlainObjects(valA, valB, visited);
  }

  // Date - inline comparison
  if (ctorA === dateConstructor) {
    const timeA = valA.getTime();
    const timeB = valB.getTime();
    return timeA === timeB || (timeA !== timeA && timeB !== timeB);
  }

  // RegExp - inline comparison
  if (ctorA === regExpConstructor) {
    return valA.source === valB.source && valA.flags === valB.flags;
  }

  // Promise - reference equality only
  if (ctorA === promiseConstructor) {
    return false;
  }

  // Error - equal when name and message match
  if (ctorA === errorConstructor) {
    return valA.name === valB.name && valA.message === valB.message;
  }

  // Arrays - optimized
  if (Array.isArray(valA)) {
    const len = valA.length;
    if (len !== valB.length) return false;

    // Empty arrays
    if (len === 0) return true;

    // The pair is tracked from the first element that needs recursion
    let entered = false;

    // Phase 1 - dense fast loop, no `in` operator at all
    let i = 0;
    for (; i < len; i++) {
      const elemA = valA[i];
      const elemB = valB[i];

      // Fast path for identical elements
      if (elemA === elemB) {
        // Only an undefined pair can hide a hole - disambiguate in phase 2
        if (elemA === undefined) break;
        continue;
      }

      // Possible hole or explicit undefined - fall to sparse-aware loop for the rest
      if (elemA === undefined || elemB === undefined) break;

      // Primitives, functions and null - equal only as a NaN pair
      if (typeof elemA !== TYPEOF_OBJECT || elemA === null) {
        if (elemA !== elemA && elemB !== elemB) continue;
        return false;
      }

      if (!entered) {
        visited = enter(visited, valA, valB);
        entered = true;
      }
      if (!deepEqual(elemA, elemB, visited)) {
        return false;
      }
    }

    // Phase 2 - sparse-aware remainder, baseline per-element logic
    for (; i < len; i++) {
      // Sparse array handling
      const hasA = i in valA;
      if (hasA !== (i in valB)) return false;
      if (!hasA) continue;

      const elemA = valA[i];
      const elemB = valB[i];

      if (elemA !== elemB) {
        if (!entered && typeof elemA === TYPEOF_OBJECT && elemA !== null) {
          visited = enter(visited, valA, valB);
          entered = true;
        }
        if (!deepEqual(elemA, elemB, visited)) {
          return false;
        }
      }
    }

    if (entered) leave(visited as Tracker);
    return true;
  }

  // Map
  if (ctorA === mapConstructor) {
    return equalMaps(valA, valB, visited);
  }

  // Set
  if (ctorA === setConstructor) {
    return equalSets(valA, valB, visited);
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

  // DataView - optimized
  if (ctorA === dataViewConstructor) {
    const viewA = valA as DataView;
    const viewB = valB as DataView;
    if (viewA.byteLength !== viewB.byteLength || viewA.byteOffset !== viewB.byteOffset) {
      return false;
    }
    // Compare the underlying buffer data - hoist byteLength accessor
    const n = viewA.byteLength;

    // Large views: wrap in Uint8Array and compare with unrolled loop.
    // Byte reads through a Uint8Array view of the same buffer region are
    // value-identical to getUint8 calls, so semantics are unchanged.
    if (n >= 16) {
      const bytesA = new Uint8Array(viewA.buffer, viewA.byteOffset, n);
      const bytesB = new Uint8Array(viewB.buffer, viewB.byteOffset, n);

      let i = 0;
      const unrollEnd = n - 7;
      for (; i < unrollEnd; i += 8) {
        if (bytesA[i] !== bytesB[i] ||
          bytesA[i + 1] !== bytesB[i + 1] ||
          bytesA[i + 2] !== bytesB[i + 2] ||
          bytesA[i + 3] !== bytesB[i + 3] ||
          bytesA[i + 4] !== bytesB[i + 4] ||
          bytesA[i + 5] !== bytesB[i + 5] ||
          bytesA[i + 6] !== bytesB[i + 6] ||
          bytesA[i + 7] !== bytesB[i + 7]) {
          return false;
        }
      }
      for (; i < n; i++) {
        if (bytesA[i] !== bytesB[i]) return false;
      }
      return true;
    }

    // Small views: per-byte reads avoid two typed-array allocations
    for (let i = 0; i < n; i++) {
      if (viewA.getUint8(i) !== viewB.getUint8(i)) return false;
    }
    return true;
  }

  // TypedArrays
  if (ArrayBuffer.isView(valA)) {
    const arrA = valA as any;
    const arrB = valB as any;
    const len = arrA.length;
    if (len !== arrB.length) return false;

    // Elements differ only when they are unequal and not both NaN. The NaN
    // test (x === x) runs on mismatch only, and is always true for integer
    // and BigInt arrays.

    // Small typed arrays
    if (len < 16) {
      for (let i = 0; i < len; i++) {
        const x = arrA[i];
        const y = arrB[i];
        if (x !== y && (x === x || y === y)) return false;
      }
      return true;
    }

    // Large typed arrays - unroll loop. A mismatching block falls through to
    // the NaN-aware loop below instead of failing outright.
    let i = 0;
    const unrollLen = len - 3;
    for (; i < unrollLen; i += 4) {
      if (arrA[i] !== arrB[i] ||
        arrA[i + 1] !== arrB[i + 1] ||
        arrA[i + 2] !== arrB[i + 2] ||
        arrA[i + 3] !== arrB[i + 3]) {
        break;
      }
    }
    // Remaining elements, starting at the first mismatching block if any
    for (; i < len; i++) {
      const x = arrA[i];
      const y = arrB[i];
      if (x !== y && (x === x || y === y)) return false;
    }
    return true;
  }

  // Rare kinds. Only objects that are not plain, not arrays, not one of the
  // exact built-ins above and not instances of the cached class get here.

  // Boxed Number / Boolean - compare the wrapped primitive, NaN equals NaN
  if (ctorA === numberConstructor || ctorA === booleanConstructor) {
    const primA = +valA;
    const primB = +valB;
    return primA === primB || (primA !== primA && primB !== primB);
  }

  // Boxed Symbol / BigInt - compare the wrapped primitive
  if (ctorA === symbolConstructor || ctorA === bigIntConstructor) {
    return valA.valueOf() === valB.valueOf();
  }

  // WeakMap / WeakSet - contents cannot be inspected, reference equality only
  if (ctorA === weakMapConstructor || ctorA === weakSetConstructor) {
    return false;
  }

  // Subclasses of built-ins compare like the built-in they extend
  if (valA instanceof dateConstructor) {
    const timeA = valA.getTime();
    const timeB = valB.getTime();
    return timeA === timeB || (timeA !== timeA && timeB !== timeB);
  }
  if (valA instanceof regExpConstructor) {
    return valA.source === valB.source && valA.flags === valB.flags;
  }
  if (valA instanceof mapConstructor) {
    return equalMaps(valA, valB, visited);
  }
  if (valA instanceof setConstructor) {
    return equalSets(valA, valB, visited);
  }
  if (valA instanceof errorConstructor) {
    return valA.name === valB.name && valA.message === valB.message;
  }
  if (valA instanceof promiseConstructor) {
    return false;
  }

  // An ordinary class instance - remember its constructor so the next
  // instance skips the dispatch chain, then compare own properties
  if (typeof ctorA === TYPEOF_FUNCTION) lastPlainCtor = ctorA;
  return equalPlainObjects(valA, valB, visited);
}

// Map - optimized
function equalMaps(mapA: Map<any, any>, mapB: Map<any, any>, visited: Tracker | null): boolean {
  if (mapA.size !== mapB.size) return false;

  // Empty maps
  if (mapA.size === 0) return true;

  // The pair is tracked from the first entry that needs recursion
  let entered = false;

  // B keys already matched to an object key of A - each matches at most once
  let used: Set<any> | null = null;

  // Optimized iteration
  for (const [key, valueA] of mapA) {
    // Fast path for keys compared by identity (primitives, functions, null)
    if (typeof key !== TYPEOF_OBJECT || key === null) {
      if (!mapB.has(key)) return false;
      const valueB = mapB.get(key);
      if (valueA !== valueB) {
        if (!entered && typeof valueA === TYPEOF_OBJECT && valueA !== null) {
          visited = enter(visited, mapA, mapB);
          entered = true;
        }
        if (!deepEqual(valueA, valueB, visited)) return false;
      }
    } else {
      // Object key - search B for an unmatched entry with an equal key and value
      if (!entered) {
        visited = enter(visited, mapA, mapB);
        entered = true;
      }
      if (used === null) used = new Set();

      const tracker = visited as Tracker;
      let found = false;
      for (const [keyB, valueB] of mapB) {
        if (typeof keyB !== TYPEOF_OBJECT || keyB === null || used.has(keyB)) continue;

        // A failed attempt leaves its pairs on the stack - drop them
        const mark = tracker[TRACK_TOP];
        if (deepEqual(key, keyB, tracker) && deepEqual(valueA, valueB, tracker)) {
          used.add(keyB);
          found = true;
          break;
        }
        truncate(tracker, mark);
      }
      if (!found) return false;
    }
  }

  if (entered) leave(visited as Tracker);
  return true;
}

// Set - highly optimized
function equalSets(setA: Set<any>, setB: Set<any>, visited: Tracker | null): boolean {
  if (setA.size !== setB.size) return false;

  // Empty sets
  if (setA.size === 0) return true;

  // For equal sets, we can optimize by checking if all primitives exist first
  let hasObjects = false;

  // First pass - categorize and check primitives
  for (const val of setA) {
    if (typeof val === TYPEOF_OBJECT) {
      hasObjects = true;
    } else if (!setB.has(val)) {
      // Primitives and functions are compared by identity
      return false;
    }
  }

  // If only primitives, we're done
  if (!hasObjects) return true;

  // For objects, create arrays for matching
  const objectsA: any[] = [];
  const objectsB: any[] = [];

  for (const val of setA) {
    if (typeof val === TYPEOF_OBJECT) {
      objectsA.push(val);
    }
  }

  for (const val of setB) {
    if (typeof val === TYPEOF_OBJECT) {
      objectsB.push(val);
    }
  }

  // Match objects - each member of B matches at most once
  const tracker = enter(visited, setA, setB);
  const used = new Uint8Array(objectsB.length);
  for (const memberA of objectsA) {
    let found = false;
    for (let j = 0; j < objectsB.length; j++) {
      if (!used[j]) {
        // A failed attempt leaves its pairs on the stack - drop them
        const mark = tracker[TRACK_TOP];
        if (deepEqual(memberA, objectsB[j], tracker)) {
          used[j] = 1;
          found = true;
          break;
        }
        truncate(tracker, mark);
      }
    }
    if (!found) return false;
  }

  leave(tracker);
  return true;
}

// Plain objects - highly optimized
function equalPlainObjects(valA: any, valB: any, visited: Tracker | null): boolean {
  // Get keys efficiently
  const keysA = Object.keys(valA);
  const keysALen = keysA.length;

  // Quick length check
  if (keysALen !== Object.keys(valB).length) return false;

  // The pair is tracked from the first property that needs recursion, so
  // objects holding only primitives never touch the tracker
  let entered = false;

  // Optimized property checking - read values first, defer the "in" probe
  for (let i = 0; i < keysALen; i++) {
    const key = keysA[i];
    const propA = valA[key];
    const propB = valB[key];

    // Quick primitive equality check
    if (propA !== propB) {
      // Only do deep comparison if needed
      const propTypeA = typeof propA;
      if (propTypeA === TYPEOF_OBJECT) {
        // An object can only equal another non-null object
        if (propA === null || propB === null || typeof propB !== TYPEOF_OBJECT) return false;
        if (!entered) {
          visited = enter(visited, valA, valB);
          entered = true;
        }
        if (!deepEqualObjects(propA, propB, visited)) return false;
      } else if (propTypeA === TYPEOF_NUMBER) {
        if (!(isNaN(propA) && isNaN(propB))) return false;
      } else {
        return false;
      }
    } else if (propA === undefined && !(key in valB)) {
      // Both reads were undefined - distinguish a genuine undefined value
      // on B from a missing key masquerading as undefined
      return false;
    }
  }

  // Check for symbols only if present
  const symbolsA = Object.getOwnPropertySymbols(valA);
  if (symbolsA.length > 0) {
    if (symbolsA.length !== Object.getOwnPropertySymbols(valB).length) {
      return false;
    }
    // Check symbol properties
    for (let i = 0; i < symbolsA.length; i++) {
      const sym = symbolsA[i];
      if (!(sym in valB)) return false;

      const propA = valA[sym];
      const propB = valB[sym];
      if (propA !== propB) {
        if (!entered && typeof propA === TYPEOF_OBJECT && propA !== null) {
          visited = enter(visited, valA, valB);
          entered = true;
        }
        if (!deepEqual(propA, propB, visited)) return false;
      }
    }
  }

  if (entered) leave(visited as Tracker);
  return true;
}
