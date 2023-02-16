import EmojiPickerReact from './EmojiPickerReact';
// import ErrorBoundary from './components/ErrorBoundary';
import { PickerConfig } from './config/config';
import { ErrorBoundary } from 'solid-js';

export { ExportedEmoji as Emoji } from './components/emoji/ExportedEmoji';

export type {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  SuggestionMode,
  SkinTonePickerLocation
} from './types/exposedTypes';

export interface Props extends PickerConfig {}

export default function EmojiPicker(props: Props) {
  return (
    // <ErrorBoundary fallback={err => err}>
      // @ts-ignore
      <EmojiPickerReact {...props} />
    // </ErrorBoundary>
  );
}
