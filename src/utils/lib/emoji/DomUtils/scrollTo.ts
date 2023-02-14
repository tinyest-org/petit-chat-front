import { useBodyRef } from '../components/context/ElementRefContext';

import { asSelectors, ClassNames } from './classNames';
import {
  categoryLabelHeight,
  closestCategory,
  closestScrollBody,
  emojiDistanceFromScrollTop,
  isEmojiBehindLabel,
  NullableElement,
  queryScrollBody
} from './selectors';

export function scrollTo(root: NullableElement, top: number = 0) {
  const $eprBody = queryScrollBody(root);

  if (!$eprBody) {
    return;
  }

  requestAnimationFrame(() => {
    $eprBody.scrollTop = top + 1;
  });
}

export function scrollBy(root: NullableElement, by: number): void {
  const $eprBody = queryScrollBody(root);

  if (!$eprBody) {
    return;
  }

  requestAnimationFrame(() => {
    $eprBody.scrollTop = $eprBody.scrollTop + by;
  });
}

export function useScrollTo() {
  const [BodyRef] = useBodyRef();

  return (
    (top: number) => {
      requestAnimationFrame(() => {
        const ref = BodyRef();
        if (ref) {
          ref.scrollTop = top;
        }
      });
    }
  );
}

export function scrollEmojiAboveLabel(emoji: NullableElement) {
  if (!emoji || !isEmojiBehindLabel(emoji)) {
    return;
  }

  if (emoji.closest(asSelectors(ClassNames.variationPicker))) {
    return;
  }

  const scrollBody = closestScrollBody(emoji);
  const by = emojiDistanceFromScrollTop(emoji);
  scrollBy(scrollBody, -(categoryLabelHeight(closestCategory(emoji)) - by));
}
