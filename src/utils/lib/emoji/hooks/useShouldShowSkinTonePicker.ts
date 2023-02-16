import { useSkinTonePickerLocationConfig } from '../config/useConfig';
import { SkinTonePickerLocation } from '../types/exposedTypes';

export function useShouldShowSkinTonePicker() {
  const skinTonePickerLocation = useSkinTonePickerLocationConfig();

  return function shouldShowSkinTonePicker(location: SkinTonePickerLocation) {
    return () => skinTonePickerLocation() === location;
  };
}

export function useIsSkinToneInSearch() {
  const skinTonePickerLocation = useSkinTonePickerLocationConfig();

  return () => skinTonePickerLocation() === SkinTonePickerLocation.SEARCH;
}

export function useIsSkinToneInPreview() {
  const skinTonePickerLocation = useSkinTonePickerLocationConfig();

  return () => skinTonePickerLocation() === SkinTonePickerLocation.PREVIEW;
}
