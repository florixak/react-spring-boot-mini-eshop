import { useState, useEffect } from "react";

type UseDebounceParams = {
  value: string;
  delay: number;
  onDebounce?: (value: string) => void;
};

const useDebounce = ({ value, delay, onDebounce }: UseDebounceParams) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      onDebounce?.(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, onDebounce]);

  return { debouncedValue };
};

export default useDebounce;
