import { useEffect, useState } from "react";

export const useDebounced = <T,>(value: T, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  
  return debouncedValue
}