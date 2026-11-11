import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type SetStateAction<T> = T | ((prev: T) => T);
type Timer = ReturnType<typeof setTimeout>;

interface BufferedStateOptions {
  wait?: number;
  maxWait?: number;
  leading?: boolean;
}

export const useBufferedState = <T,>(
  initialState: T | (() => T),
  { wait = 500, maxWait, leading = false }: BufferedStateOptions = {},
): readonly [T, (action: SetStateAction<T>) => void, () => void] => {
  const [value, setValue] = useState(initialState);
  const buffer = useRef(value);
  const options = useRef({ wait, maxWait, leading });
  const debounceTimer = useRef<Timer | null>(null);
  const maxWaitTimer = useRef<Timer | null>(null);

  useLayoutEffect(() => {
    options.current = { wait, maxWait, leading };
  });

  const clearTimers = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (maxWaitTimer.current) clearTimeout(maxWaitTimer.current);
    debounceTimer.current = null;
    maxWaitTimer.current = null;
  }, []);

  const commit = useCallback(() => {
    const next = buffer.current;
    setValue(() => next);
  }, []);

  const flush = useCallback(() => {
    clearTimers();
    commit();
  }, [clearTimers, commit]);

  const setBufferedState = useCallback((action: SetStateAction<T>) => {
    buffer.current = typeof action === 'function'
      ? (action as (prev: T) => T)(buffer.current)
      : action;

    const { wait, maxWait, leading } = options.current;
    const idle = debounceTimer.current === null && maxWaitTimer.current === null;
    if (idle && leading) commit();

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(flush, wait);

    if (maxWait !== undefined) maxWaitTimer.current ??= setTimeout(flush, maxWait);
  }, [commit, flush]);

  useEffect(() => clearTimers, [clearTimers]);

  return [value, setBufferedState, flush];
};

export default useBufferedState;