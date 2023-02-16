
import { buttonFromTarget, emojiFromElement } from '../DomUtils/selectors';
import { useBodyRef } from '../components/context/ElementRefContext';
import { useEmojiStyleConfig, useGetEmojiUrlConfig } from '../config/useConfig';
import { emojiHasVariations } from '../dataUtils/emojiSelectors';
import { EmojiStyle } from '../types/exposedTypes';

import { preloadEmoji } from './preloadEmoji';
import { createEffect, onCleanup } from 'solid-js';

export function useOnFocus() {
  const BodyRef = useBodyRef();
  const emojiStyle = useEmojiStyleConfig();
  const getEmojiUrl = useGetEmojiUrlConfig();

  createEffect(() => {
    if (emojiStyle() === EmojiStyle.NATIVE) {
      return;
    }

    const bodyRef = BodyRef();

    bodyRef[0]()?.addEventListener('focusin', onFocus);

    onCleanup(() => {
      
      bodyRef[0]()?.removeEventListener('focusin', onFocus);
    });

    function onFocus(event: FocusEvent) {
      const button = buttonFromTarget(event.target as HTMLElement);

      if (!button) {
        return;
      }

      const [emoji] = emojiFromElement(button);

      if (!emoji) {
        return;
      }

      if (emojiHasVariations(emoji)) {
        preloadEmoji(getEmojiUrl(), emoji, emojiStyle());
      }
    }
  });
}
