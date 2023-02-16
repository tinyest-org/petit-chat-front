import { useContext } from 'solid-js';
import {
  PickerContext,
  useEmojiVariationPickerState,
  useSkinToneFanOpenState
} from '../components/context/PickerContext';

export function useCloseAllOpenToggles() {
  const variationPicker = useEmojiVariationPickerState();
  const skinToneFanOpen = useSkinToneFanOpenState();
  const [state, setState] = useContext(PickerContext)!;

  const setVariationPicker = (a: any) => {
    setState(old => ({ ...old, emojiVariationPickerState: a }));
  }

  const setSkinToneFanOpen = (a: any) => {
    setState(old => ({ ...old, skinToneFanOpenState: a }));
  }

  const closeAllOpenToggles = () => {
    if (variationPicker()) {
      setVariationPicker(null);
    }

    if (skinToneFanOpen()) {
      setSkinToneFanOpen(false);
    }
  };

  return closeAllOpenToggles;
}

export function useHasOpenToggles() {
  const variationPicker = useEmojiVariationPickerState();
  const skinToneFanOpen = useSkinToneFanOpenState();

  return function hasOpenToggles() {
    return !!variationPicker() || skinToneFanOpen();
  };
}
