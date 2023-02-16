import { isSystemDarkTheme } from '../DomUtils/isDarkTheme';
import { usePickerConfig } from '../components/context/PickerConfigContext';
import {
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  SkinTones,
  SuggestionMode,
  Theme
} from '../types/exposedTypes';

import { CategoriesConfig } from './categoryConfig';
import { PickerDimensions, PreviewConfig } from './config';

export function useSearchPlaceHolderConfig() {
  const [state] = usePickerConfig()!;
  return () => state().searchPlaceHolder;
}

export function useDefaultSkinToneConfig() {
  const [state] = usePickerConfig()!;
  return () => state().defaultSkinTone;
}

export function useSkinTonesDisabledConfig() {
  const [state] = usePickerConfig()!;
  return () => state().skinTonesDisabled;
}

export function useEmojiStyleConfig() {
  const [state] = usePickerConfig()!;
  return () => state().emojiStyle;
}

export function useAutoFocusSearchConfig() {
  const [state] = usePickerConfig()!;
  return () => state().autoFocusSearch;
}

export function useCategoriesConfig() {
  const [state] = usePickerConfig()!;
  return () => state().categories;
}

export function useOnEmojiClickConfig() {
  const [state] = usePickerConfig()!;
  return () => state().onEmojiClick;
}

export function usePreviewConfig() {
  const [state] = usePickerConfig()!;
  return () => state().previewConfig;
}

export function useThemeConfig() {
  const [state] = usePickerConfig()!;
  return () => {
    if (state().theme === Theme.AUTO) {
      return isSystemDarkTheme() ? Theme.DARK : Theme.LIGHT;
    }
  
    return state().theme;
  }
}

export function useSuggestedEmojisModeConfig() {
  const [state] = usePickerConfig()!;
  return () => state().suggestedEmojisMode;
}

export function useLazyLoadEmojisConfig() {
  const [state] = usePickerConfig()!;
  return () => state().lazyLoadEmojis;
}

export function usePickerSizeConfig() {
  const [state] = usePickerConfig()!;
  return () => ({
    height: getDimension(state().height),
    width: getDimension(state().width)
  });
}

export function useEmojiVersionConfig() {
  const [state] = usePickerConfig()!;
  return () => state().emojiVersion;
}

export function useSearchDisabledConfig() {
  const [state] = usePickerConfig()!;
  return () => state().searchDisabled;
}

export function useSkinTonePickerLocationConfig() {
  const [state] = usePickerConfig()!;
  return () => state().skinTonePickerLocation;
}

export function useGetEmojiUrlConfig() {
  const [state] = usePickerConfig()!;
  return () => state().getEmojiUrl;
}

function getDimension(dimensionConfig: PickerDimensions): PickerDimensions {
  return typeof dimensionConfig === 'number'
    ? `${dimensionConfig}px`
    : dimensionConfig;
}
