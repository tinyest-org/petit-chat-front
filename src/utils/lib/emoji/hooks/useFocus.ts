import { focusElement, focusFirstElementChild } from '../DomUtils/focusElement';
import {
  useCategoryNavigationRef,
  useSearchInputRef,
  useSkinTonePickerRef
} from '../components/context/ElementRefContext';

export function useFocusSearchInput() {
  const [SearchInputRef] = useSearchInputRef();

  return () => {
    focusElement(SearchInputRef());
  }
}

export function useFocusSkinTonePicker() {
  const [SkinTonePickerRef] = useSkinTonePickerRef();

  return () => {
    if (!SkinTonePickerRef()) {
      return;
    }

    focusFirstElementChild(SkinTonePickerRef());
  }
}

export function useFocusCategoryNavigation() {
  const [CategoryNavigationRef] = useCategoryNavigationRef();

  return () => {
    if (!CategoryNavigationRef()) {
      return;
    }

    focusFirstElementChild(CategoryNavigationRef());
  }
}
