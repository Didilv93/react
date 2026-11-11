export const pagination = <T>(data: T[], page: number, pageSize: number): T[] => {
  if (page < 1 || pageSize < 1) {
    throw new Error('Page and pageSize must be greater than 0');
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}