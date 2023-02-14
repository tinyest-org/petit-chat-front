import { Accessor, createSignal } from "solid-js";
import { createDebouncedMemo } from "@solid-primitives/memo";

export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 0
): [Accessor<T>, (value: T) => Promise<T>] {
  const [state, setState] = createSignal<T>(initialValue);
  const double = createDebouncedMemo(prev => state(), delay);

  return [double, setState];
}
