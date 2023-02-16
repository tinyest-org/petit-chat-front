import { useSearchTermState } from '../components/context/PickerContext';

export default function useIsSearchMode() {
  const value = useSearchTermState();

  return () => !!value();
}
