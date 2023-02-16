import { focusElement, focusFirstElementChild } from '../DomUtils/focusElement';
import {
  useCategoryNavigationRef,
  useSearchInputRef,
  useSkinTonePickerRef
} from '../components/context/ElementRefContext';

export function useFocusSearchInput() {
  const SearchInputRef = useSearchInputRef();
  const [searchInputRef] = SearchInputRef();
  return () => {
    focusElement(searchInputRef());
  }
}

export function useFocusSkinTonePicker() {
  const SkinTonePickerRef = useSkinTonePickerRef();
  const [skinTonePickerRef] = SkinTonePickerRef();
  return () => {
    if (!SkinTonePickerRef()) {
      return;
    }

    focusFirstElementChild(skinTonePickerRef());
  }
}

export function useFocusCategoryNavigation() {
  const CategoryNavigationRef = useCategoryNavigationRef();
  const [categoryNavigationRef] = CategoryNavigationRef();
  return () => {
    if (!categoryNavigationRef()) {
      return;
    }

    focusFirstElementChild(categoryNavigationRef());
  }
}
