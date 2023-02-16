import { emojiFromElement, NullableElement } from '../DomUtils/selectors';
import { useSetAnchoredEmojiRef } from '../components/context/ElementRefContext';
import { PickerContext, useEmojiVariationPickerState } from '../components/context/PickerContext';
import { useContext } from 'solid-js';

export default function useSetVariationPicker() {
  const setAnchoredEmojiRef = useSetAnchoredEmojiRef();
  // const [, setEmojiVariationPicker] = useEmojiVariationPickerState();
  const [state, setState] = useContext(PickerContext)!;
  const setEmojiVariationPicker = (b: any) => {
    setState(old => ({ ...old, emojiVariationPickerState: b }));
  }

  return function setVariationPicker(element: NullableElement) {
    const [emoji] = emojiFromElement(element);

    if (emoji) {
      setAnchoredEmojiRef(element);
      setEmojiVariationPicker(emoji);
    }
  };
}
