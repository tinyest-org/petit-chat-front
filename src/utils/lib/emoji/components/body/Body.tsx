import { ClassNames } from '../../DomUtils/classNames';
import { useOnMouseMove } from '../../hooks/useDisallowMouseMove';
import { useMouseDownHandlers } from '../../hooks/useMouseDownHandlers';
import { useOnScroll } from '../../hooks/useOnScroll';
import { useBodyRef } from '../context/ElementRefContext';

import { EmojiList } from './EmojiList';
import { EmojiVariationPicker } from './EmojiVariationPicker';

import './Body.css';

export function Body() {
  const BodyRef = useBodyRef();
  const [_, setRef] = BodyRef;
  useOnScroll(BodyRef);
  useMouseDownHandlers(BodyRef);
  useOnMouseMove();

  return (
    <div class={ClassNames.scrollBody} ref={setRef}>
      <EmojiVariationPicker />
      <EmojiList />
    </div>
  );
}
