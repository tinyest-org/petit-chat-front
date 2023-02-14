import { createMemo } from 'solid-js';
import { useEmojiVersionConfig } from '../config/useConfig';
import { DataEmoji } from '../dataUtils/DataTypes';
import {
  addedIn,
  allEmojis,
  emojiUnified,
  unifiedWithoutSkinTone
} from '../dataUtils/emojiSelectors';

export function useDisallowedEmojis() {
  let disallowedEmojis: Record<string, boolean> = {};
  const emojiVersionConfig = useEmojiVersionConfig();

  return createMemo(() => {
    const emojiVersion = parseFloat(`${emojiVersionConfig}`);

    if (!emojiVersionConfig || Number.isNaN(emojiVersion)) {
      return disallowedEmojis;
    }

    allEmojis.forEach((emoji) => {
      if (addedInNewerVersion(emoji, emojiVersion)) {
        disallowedEmojis[emojiUnified(emoji)] = true;
      }
    });
    return disallowedEmojis;
  });
}

export function useIsEmojiDisallowed() {
  const disallowedEmojis = useDisallowedEmojis();

  return function isEmojiDisallowed(emoji: DataEmoji) {
    const unified = unifiedWithoutSkinTone(emojiUnified(emoji));

    return Boolean(disallowedEmojis()[unified]);
  };
}

function addedInNewerVersion(
  emoji: DataEmoji,
  supportedLevel: number
): boolean {
  return addedIn(emoji) > supportedLevel;
}
