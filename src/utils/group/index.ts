import { sortBy } from "../sort";

export const groupBy = <T>(array: T[], key: keyof T): Map<T[keyof T], T[]> => {
  const map = new Map<T[keyof T], T[]>();

  for (const item of array) {
    const value = item[key];

    if (!map.has(value)) {
      map.set(value, []);
    }

    map.get(value)?.push(item);
  }

  return map;
}

export const groupByKeys = <T>(
  array: T[],
  keyFn: (item: T) => string = JSON.stringify,
): Map<string, T[]> => {
  const map = new Map<string, T[]>();

  for (const item of array) {
    const groupKey = keyFn(item);
    if (!map.has(groupKey)) {
      map.set(groupKey, []);
    }
    map.get(groupKey)?.push(item);
  }

  return map;
}