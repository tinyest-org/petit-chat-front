import { createMemo, For } from 'solid-js';
import { CategoryConfig } from '../../config/categoryConfig';
import {
  useEmojiStyleConfig,
  useGetEmojiUrlConfig,
  useSuggestedEmojisModeConfig,
} from '../../config/useConfig';
import { emojiByUnified } from '../../dataUtils/emojiSelectors';
import { getsuggested } from '../../dataUtils/suggested';
import { useUpdateSuggested } from '../context/PickerContext';
import { ClickableEmoji } from '../emoji/Emoji';

import { EmojiCategory } from './EmojiCategory';

type Props = Readonly<{
  categoryConfig: CategoryConfig;
}>;

export function Suggested({ categoryConfig }: Props) {
  const [suggestedUpdated] = useUpdateSuggested();
  const suggestedEmojisModeConfig = useSuggestedEmojisModeConfig();
  const getEmojiUrl = useGetEmojiUrlConfig();
  const suggested = createMemo(() => {
    suggestedUpdated();
    getsuggested(suggestedEmojisModeConfig) ?? []
  });
  const emojiStyle = useEmojiStyleConfig();

  return (
    <EmojiCategory
      categoryConfig={categoryConfig}
      hiddenOnSearch
      hidden={suggested().length === 0}
    >
      <For each={suggested()}>
        {(suggestedItem) => {
          {
            const emoji = emojiByUnified(suggestedItem.original);

            if (!emoji) {
              return null;
            }

            return (
              <ClickableEmoji
                showVariations={false}
                unified={suggestedItem.unified}
                emojiStyle={emojiStyle}
                emoji={emoji}
                getEmojiUrl={getEmojiUrl}
              />
            );
          }
        }}
      </For>
    </EmojiCategory>
  );
}
