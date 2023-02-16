import clsx from 'clsx';

import { ClassNames } from '../../DomUtils/classNames';
import { focusFirstVisibleEmoji } from '../../DomUtils/keyboardNavigation';
import {
  buttonFromTarget,
  elementHeight,
  emojiTrueOffsetTop,
  emojiTruOffsetLeft
} from '../../DomUtils/selectors';
import {
  useEmojiStyleConfig,
  useGetEmojiUrlConfig
} from '../../config/useConfig';
import {
  emojiHasVariations,
  emojiUnified,
  emojiVariations
} from '../../dataUtils/emojiSelectors';
import {
  useAnchoredEmojiRef,
  useBodyRef,
  useSetAnchoredEmojiRef,
  useVariationPickerRef
} from '../context/ElementRefContext';
import { useEmojiVariationPickerState } from '../context/PickerContext';
import { ClickableEmoji } from '../emoji/Emoji';
import './EmojiVariationPicker.css';
import { Accessor, createEffect, JSX } from 'solid-js';

enum Direction {
  Up,
  Down
}

export function EmojiVariationPicker() {
  const anchoredEmojiRef = useAnchoredEmojiRef();
  const [AnchoredEmojiRef] = anchoredEmojiRef();
  const variationPickerRef = useVariationPickerRef();
  const [VariationPickerRef] = variationPickerRef();
  const emoji = useEmojiVariationPickerState();
  const emojiStyle = useEmojiStyleConfig();

  const { getTop, getMenuDirection } = useVariationPickerTop(
    VariationPickerRef
  );
  const setAnchoredEmojiRef = useSetAnchoredEmojiRef();
  const getPointerStyle = usePointerStyle(AnchoredEmojiRef);
  const getEmojiUrl = useGetEmojiUrlConfig();

  const button = buttonFromTarget(AnchoredEmojiRef());

  const visible =
    emoji &&
    button &&
    emojiHasVariations(emoji()!) &&
    button.classList.contains(ClassNames.emojiHasVariatios);

  createEffect(() => {
    if (!visible) {
      return;
    }

    focusFirstVisibleEmoji(VariationPickerRef());
  }, [VariationPickerRef, visible, AnchoredEmojiRef]);

  let top, pointerStyle;

  if (!visible && AnchoredEmojiRef()) {
    setAnchoredEmojiRef(null);
  } else {
    top = getTop();
    pointerStyle = getPointerStyle();
  }

  return (
    <div
      ref={VariationPickerRef}
      class={clsx(ClassNames.variationPicker, {
        visible,
        'pointing-up': getMenuDirection() === Direction.Down
      })}
      style={{ top: `${top}px` }}
    >
      {visible && emoji()
        ? [emojiUnified(emoji()!)]
          .concat(emojiVariations(emoji()!))
          .slice(0, 6)
          .map(unified => (
            <ClickableEmoji
              // key={unified}
              emoji={emoji()!}
              unified={unified}
              emojiStyle={emojiStyle()}
              showVariations={false}
              getEmojiUrl={getEmojiUrl()}
            />
          ))
        : null}
      <div class="epr-emoji-pointer" style={pointerStyle} />
    </div>
  );
}

function usePointerStyle(VariationPickerRef: Accessor<HTMLElement | null>) {
  const AnchoredEmojiRef = useAnchoredEmojiRef()!;
  return function getPointerStyle() {
    const style: JSX.CSSProperties = {};
    if (!VariationPickerRef()) {
      return style;
    }

    if (AnchoredEmojiRef()) {
      const button = buttonFromTarget(AnchoredEmojiRef()[0]());

      const offsetLeft = emojiTruOffsetLeft(button);

      if (!button) {
        return style;
      }

      // half of the button
      style.left = `${offsetLeft + button?.clientWidth / 2}px`;
    }

    return style;
  };
}

function useVariationPickerTop(
  VariationPickerRef: Accessor<HTMLElement | null>
) {
  const AnchoredEmojiRef = useAnchoredEmojiRef()!;
  const BodyRef = useBodyRef()!;
  let direction = Direction.Up;

  return {
    getMenuDirection,
    getTop
  };

  function getMenuDirection() {
    return direction;
  }

  function getTop() {
    direction = Direction.Up;
    let emojiOffsetTop = 0;

    if (!VariationPickerRef()) {
      return 0;
    }

    const height = elementHeight(VariationPickerRef());

    if (AnchoredEmojiRef()) {
      const [bodyRef] = BodyRef();
      const button = buttonFromTarget(AnchoredEmojiRef()[0]());

      const buttonHeight = elementHeight(button);

      emojiOffsetTop = emojiTrueOffsetTop(button);

      const scrollTop = bodyRef()?.scrollTop ?? 0;

      if (scrollTop > emojiOffsetTop - height) {
        direction = Direction.Down;
        emojiOffsetTop += buttonHeight + height;
      }
    }

    return emojiOffsetTop - height;
  }
}
