import { useSkinTonePickerLocationConfig } from '../config/useConfig';
import { SkinTonePickerLocation } from '../types/exposedTypes';

export function useShouldShowSkinTonePicker() {
  const [state] = useSkinTonePickerLocationConfig();

  return function shouldShowSkinTonePicker(location: SkinTonePickerLocation) {
    return () => state().skinTonePickerLocation === location;
  };
}

export function useIsSkinToneInSearch() {
  const [state] = useSkinTonePickerLocationConfig();

  return () => state().skinTonePickerLocation === SkinTonePickerLocation.SEARCH;
}

export function useIsSkinToneInPreview() {
  const [state] = useSkinTonePickerLocationConfig();

  return () => state().skinTonePickerLocation === SkinTonePickerLocation.PREVIEW;
}
