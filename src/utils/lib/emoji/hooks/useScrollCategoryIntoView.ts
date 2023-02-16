import { scrollTo } from '../DomUtils/scrollTo';
import { NullableElement } from '../DomUtils/selectors';
import {
  useBodyRef,
  usePickerMainRef
} from '../components/context/ElementRefContext';

export function useScrollCategoryIntoView() {
  const BodyRef = useBodyRef();
  const PickerMainRef = usePickerMainRef();

  return function scrollCategoryIntoView(category: string): void {
    const [bodyRef] = BodyRef();
    const [pickerMainRef] = PickerMainRef();
    if (!bodyRef()) {
      return;
    }
    const $category = bodyRef()?.querySelector(
      `[data-name="${category}"]`
    ) as NullableElement;

    if (!$category) {
      return;
    }

    const offsetTop = $category.offsetTop || 0;

    scrollTo(pickerMainRef(), offsetTop);
  };
}
