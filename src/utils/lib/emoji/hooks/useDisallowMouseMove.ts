import { createEffect, onCleanup, useContext } from 'solid-js';
import { useBodyRef } from '../components/context/ElementRefContext';
import { PickerContext, useDisallowMouseRef } from '../components/context/PickerContext';

export function useDisallowMouseMove() {
  const [state, setState] = useContext(PickerContext)!;
  return function disallowMouseMove() {
    setState(old => ({...old, disallowMouseRef: true}));
  };
}

export function useAllowMouseMove() {
  const [state, setState] = useContext(PickerContext)!;
  return function allowMouseMove() {
    setState(old => ({...old, disallowMouseRef: false}));
  };
}

export function useIsMouseDisallowed() {
  const DisallowMouseRef = useDisallowMouseRef();
  return DisallowMouseRef;
}

export function useOnMouseMove() {
  const BodyRef = useBodyRef();
  const allowMouseMove = useAllowMouseMove();
  const isMouseDisallowed = useIsMouseDisallowed();

  createEffect(() => {
    const [bodyRef] = BodyRef();
    bodyRef()?.addEventListener('mousemove', onMouseMove, {
      passive: true
    });

    function onMouseMove() {
      if (isMouseDisallowed()) {
        allowMouseMove();
      }
    }
    onCleanup(() => {
      bodyRef()?.removeEventListener('mousemove', onMouseMove);
    });
  });
}
