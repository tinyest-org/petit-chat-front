import { createSignal, Signal } from 'solid-js';
import { GetEmojiUrl } from '../components/emoji/Emoji';
import { emojiUrlByUnified } from '../dataUtils/emojiSelectors';
import {
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  SkinTones,
  SuggestionMode,
  Theme
} from '../types/exposedTypes';

import {
  CategoriesConfig,
  baseCategoriesConfig,
  mergeCategoriesConfig
} from './categoryConfig';

export function mergeConfig(
  // @ts-ignore
  userConfig: PickerConfig = [() => ({}), (s: any) => { }]
): PickerConfigInternal {
  const base = basePickerConfig();

  const previewConfig = Object.assign(
    base.previewConfig,
    userConfig.previewConfig ?? {}
  );
  const config = Object.assign(base, userConfig);
  console.log(userConfig);
  
  // @ts-ignore
  const categories = mergeCategoriesConfig(userConfig[0]().categories, {
    suggestionMode: config.suggestedEmojisMode
  });

  const skinTonePickerLocation = config.searchDisabled
    ? SkinTonePickerLocation.PREVIEW
    : config.skinTonePickerLocation;

  return createSignal({
    ...config,
    categories,
    previewConfig,
    skinTonePickerLocation
  });
}

export function baseSignal(): PickerConfigInternal {
  return createSignal({
    autoFocusSearch: true,
    categories: baseCategoriesConfig(),
    defaultSkinTone: SkinTones.NEUTRAL,
    emojiStyle: EmojiStyle.APPLE,
    emojiVersion: null,
    getEmojiUrl: emojiUrlByUnified,
    height: 450,
    lazyLoadEmojis: false,
    onEmojiClick: function defaultOnClickHandler(
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      emoji: EmojiClickData,
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      event: MouseEvent
    ) { },
    previewConfig: {
      ...basePreviewConfig
    },
    searchDisabled: false,
    searchPlaceHolder: 'Search',
    skinTonePickerLocation: SkinTonePickerLocation.SEARCH,
    skinTonesDisabled: false,
    suggestedEmojisMode: SuggestionMode.FREQUENT,
    theme: Theme.LIGHT,
    width: 350
  })
}

export function basePickerConfig() {
  return {
    autoFocusSearch: true,
    categories: baseCategoriesConfig(),
    defaultSkinTone: SkinTones.NEUTRAL,
    emojiStyle: EmojiStyle.APPLE,
    emojiVersion: null,
    getEmojiUrl: emojiUrlByUnified,
    height: 450,
    lazyLoadEmojis: false,
    onEmojiClick: function defaultOnClickHandler(
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      emoji: EmojiClickData,
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      event: MouseEvent
    ) { },
    previewConfig: {
      ...basePreviewConfig
    },
    searchDisabled: false,
    searchPlaceHolder: 'Search',
    skinTonePickerLocation: SkinTonePickerLocation.SEARCH,
    skinTonesDisabled: false,
    suggestedEmojisMode: SuggestionMode.FREQUENT,
    theme: Theme.LIGHT,
    width: 350
  }
}

export type PickerConfigInternal = Signal<{
  emojiVersion: string | null;
  searchPlaceHolder: string;
  defaultSkinTone: SkinTones;
  skinTonesDisabled: boolean;
  autoFocusSearch: boolean;
  emojiStyle: EmojiStyle;
  categories: CategoriesConfig;
  onEmojiClick: (emoji: EmojiClickData, event: MouseEvent) => void;
  theme: Theme;
  suggestedEmojisMode: SuggestionMode;
  lazyLoadEmojis: boolean;
  previewConfig: PreviewConfig;
  height: PickerDimensions;
  width: PickerDimensions;
  getEmojiUrl: GetEmojiUrl;
  searchDisabled: boolean;
  skinTonePickerLocation: SkinTonePickerLocation;
}>;

export type PreviewConfig = {
  defaultEmoji: string;
  defaultCaption: string;
  showPreview: boolean;
};

const basePreviewConfig: PreviewConfig = {
  defaultEmoji: '1f60a',
  defaultCaption: "What's your mood?",
  showPreview: true
};

type ConfigExternal = {
  previewConfig: Partial<PreviewConfig>;
} & Omit<PickerConfigInternal, 'previewConfig'>;

export type PickerConfig = Partial<ConfigExternal>;

export type PickerDimensions = string | number;
