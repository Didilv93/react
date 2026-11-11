type SortOptions = {
  parser?: (value: unknown) => unknown;
};

export const sortBy = <T>(
  data: T[],
  desc = false,
  property?: keyof T,
  options: SortOptions = {}
): T[] => {
  const sortedData = data.sort((a, b) => {
    let aValue: unknown = a;
    let bValue: unknown = b;

    if (property !== undefined) {
      aValue = a[property];
      bValue = b[property];
    }

    const parsedAValue = options.parser ? options.parser(aValue) : aValue;
    const parsedBValue = options.parser ? options.parser(bValue) : bValue;

    if (parsedAValue == null && parsedBValue == null) return 0;


    if (parsedAValue == null) return desc ? -1 : 1;
    if (parsedBValue == null) return desc ? 1 : -1;


    if (parsedAValue < parsedBValue) return desc ? 1 : -1;
    if (parsedAValue > parsedBValue) return desc ? -1 : 1;
    return 0;
  });

  return sortedData;
}
