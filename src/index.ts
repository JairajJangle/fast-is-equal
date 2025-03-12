export function fastIsEqual(a: any, b: any) {
  // Fast path for strict equality
  if (a === b) return true;

  // Handle NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true;

  // Early exit for null/undefined or type mismatch
  if (a == null || b == null || typeof a !== typeof b) return a === b;

  // Check if both are arrays or both are not arrays
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray !== bIsArray) return false;

  // Check if both are the same type of object (e.g., both Map, both Set, etc.)
  if (a.constructor !== b.constructor) return false;

  // Fast path for arrays
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const elemA = a[i];
      const elemB = b[i];
      if (elemA === elemB) continue;
      if (Number.isNaN(elemA) && Number.isNaN(elemB)) continue;
      if (typeof elemA === 'object' || typeof elemB === 'object' ||
        typeof elemA === 'function' || typeof elemB === 'function') {
        return deepEqual(elemA, elemB, new Map());
      }
      if (elemA !== elemB) return false;
    }
    return true;
  }

  // For other non-primitive types, use deepEqual with a visited Map
  return deepEqual(a, b, new Map());
}

function deepEqual(valA: any, valB: any, visited: Map<any, any>): boolean {
  // Strict equality and NaN checks
  if (valA === valB) return true;
  if (Number.isNaN(valA) && Number.isNaN(valB)) return true;
  if (valA == null || valB == null) return valA === valB;
  if (typeof valA !== typeof valB) return false;

  // Handle Dates
  if (valA instanceof Date && valB instanceof Date) {
    return valA.getTime() === valB.getTime();
  }

  // Handle Regular Expressions
  if (valA instanceof RegExp && valB instanceof RegExp) {
    return valA.toString() === valB.toString();
  }

  // Handle Promises (reference equality)
  if (valA instanceof Promise && valB instanceof Promise) {
    return valA === valB;
  }

  // Handle Arrays
  if (Array.isArray(valA) && Array.isArray(valB)) {
    if (valA.length !== valB.length) return false;
    for (let i = 0; i < valA.length; i++) {
      const elemA = valA[i];
      const elemB = valB[i];
      if (elemA === elemB) continue;
      if (Number.isNaN(elemA) && Number.isNaN(elemB)) continue;
      if (typeof elemA === 'object' || typeof elemB === 'object' ||
        typeof elemA === 'function' || typeof elemB === 'function') {
        if (!deepEqual(elemA, elemB, visited)) return false;
      } else if (elemA !== elemB) {
        return false;
      }
    }
    return true;
  }

  // Handle Maps
  if (valA instanceof Map && valB instanceof Map) {
    if (valA.size !== valB.size) return false;
    for (const [key, value] of valA) {
      if (!valB.has(key) || !deepEqual(value, valB.get(key), visited)) return false;
    }
    return true;
  }

  // Handle Sets
  if (valA instanceof Set && valB instanceof Set) {
    if (valA.size !== valB.size) return false;
    for (const value of valA) {
      if (!valB.has(value)) return false;
    }
    return true;
  }

  // Handle Objects with circular reference tracking
  if (typeof valA === 'object' && typeof valB === 'object') {
    if (visited.has(valA) && visited.get(valA) === valB) return true;
    visited.set(valA, valB);

    const keysA = Object.keys(valA);
    const keysB = Object.keys(valB);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(valB, key) ||
        !deepEqual(valA[key], valB[key], visited)) {
        return false;
      }
    }
    return true;
  }

  // Default to strict equality
  return valA === valB;
}