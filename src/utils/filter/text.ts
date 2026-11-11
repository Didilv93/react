export const filterByText = <T>(
  data: T[],
  searchTerm: string,
  property?: keyof T
): T[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return data.filter((item) => {
    const value = property ? item[property] : item;
    if (typeof value === 'string') {
      return value.toLowerCase().includes(lowerCaseSearchTerm);
    }
    return false;
  });
}