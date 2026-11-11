export const parseNumber = (value: any): number | null => {
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  } else {
    return null;
  }
}