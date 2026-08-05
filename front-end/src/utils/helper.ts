// Generic helper utilities used across the app

// ======================================================
// ID GENERATOR
// ======================================================
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

// ======================================================
// DELAY (mock API simulation)
// ======================================================
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ======================================================
// CLASSNAME MERGER (similar to clsx)
// ======================================================
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// ======================================================
// ARRAY REORDER (used for drag-and-drop)
// ======================================================
export function reorderArray<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// ======================================================
// MOVE ITEM BETWEEN ARRAYS
// ======================================================
export function moveBetweenArrays<T>(
  source: T[],
  destination: T[],
  sourceIndex: number,
  destinationIndex: number
) {
  const sourceClone = [...source]
  const destClone = [...destination]

  const [moved] = sourceClone.splice(sourceIndex, 1)
  destClone.splice(destinationIndex, 0, moved)

  return {
    source: sourceClone,
    destination: destClone
  }
}

// ======================================================
// GROUP ARRAY BY KEY
// ======================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy<T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((result, current) => {
    const key = getKey(current)

    if (!result[key]) {
      result[key] = []
    }

    result[key].push(current)

    return result
  }, {} as Record<K, T[]>)
}

// ======================================================
// SAFE LOCALSTORAGE GET
// ======================================================
export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const value = localStorage.getItem(key)

    if (!value) return fallback

    return JSON.parse(value) as T
  } catch (error) {
    console.warn(`safeGet failed for key "${key}"`, error)
    return fallback
  }
}

// ======================================================
// SAFE LOCALSTORAGE SET
// ======================================================
export function setLocalStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`safeSet failed for key "${key}"`, error)
  }
}



