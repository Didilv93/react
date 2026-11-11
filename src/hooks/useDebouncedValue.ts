import { useEffect, useState } from 'react';

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => {
      console.log('TRACE Clearing timeout for value:', value);
      clearTimeout(timer)
    };
  }, [value, delay]);

  return debounced;
}

export default useDebouncedValue;