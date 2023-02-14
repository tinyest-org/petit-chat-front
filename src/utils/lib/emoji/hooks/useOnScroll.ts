
import { createEffect } from 'solid-js';
import { ElementRef } from '../components/context/ElementRefContext';

import { useCloseAllOpenToggles } from './useCloseAllOpenToggles';

export function useOnScroll(BodyRef: ElementRef) {
  const closeAllOpenToggles = useCloseAllOpenToggles();
  const [ref] = BodyRef;
  createEffect(() => {
    const bodyRef = ref();
    if (!bodyRef) {
      return;
    }

    bodyRef.addEventListener('scroll', onScroll, {
      passive: true
    });

    function onScroll() {
      closeAllOpenToggles();
    }

    return () => {
      bodyRef?.removeEventListener('scroll', onScroll);
    };
  }, [BodyRef, closeAllOpenToggles]);
}
