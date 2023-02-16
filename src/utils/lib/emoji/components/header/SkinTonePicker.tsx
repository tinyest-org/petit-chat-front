import clsx from 'clsx';

import { ClassNames } from '../../DomUtils/classNames';
import { useSkinTonesDisabledConfig } from '../../config/useConfig';
import skinToneVariations, {
  skinTonesNamed
} from '../../data/skinToneVariations';
import { useCloseAllOpenToggles } from '../../hooks/useCloseAllOpenToggles';
import { useFocusSearchInput } from '../../hooks/useFocus';
import { SkinTones } from '../../types/exposedTypes';
import Absolute from '../Layout/Absolute';
import Relative from '../Layout/Relative';
import { Button } from '../atoms/Button';
import { ElementRefContext, useElementRef, useSkinTonePickerRef } from '../context/ElementRefContext';
import {
  PickerContext,
  useActiveSkinToneState,
  useSkinToneFanOpenState
} from '../context/PickerContext';
import './SkinTonePicker.css';
import { usePickerConfig } from '../context/PickerConfigContext';
import { useContext } from 'solid-js';

const ITEM_SIZE = 28;

type Props = {
  direction?: SkinTonePickerDirection;
};

export function SkinTonePickerMenu() {
  return (
    <Relative style={{ height: ITEM_SIZE + 'px' }}>
      <Absolute style={{ bottom: 0, right: 0 }}>
        <SkinTonePicker direction={SkinTonePickerDirection.VERTICAL} />
      </Absolute>
    </Relative>
  );
}

export function SkinTonePicker({
  direction = SkinTonePickerDirection.HORIZONTAL
}: Props) {
  // const [SkinTonePickerRef, setRef] = useSkinTonePickerRef();
  const isDisabled = useSkinTonesDisabledConfig();
  const isOpen = useSkinToneFanOpenState();
  const activeSkinTone = useActiveSkinToneState();
  const closeAllOpenToggles = useCloseAllOpenToggles();
  const focusSearchInput = useFocusSearchInput();
  const [state, setState] = usePickerConfig()!;
  const refState = useContext(ElementRefContext)!;
  const [_, setPickerState] = useContext(PickerContext)!;
  if (isDisabled()) {
    return null;
  }

  const setRef = (r: any) => {
    refState.SkinTonePickerRef[1](r);
  }

  const setActiveSkinTone = (r:any) => {
    setState(old => ({...old, skinTonesDisabled: r}));
  }

  const setIsOpen = (r:any) => {
    setPickerState(old => ({...old, skinToneFanOpenState: r}));
  }

  const fullWidth = `${ITEM_SIZE * skinToneVariations.length}px`;

  const expandedSize = isOpen() ? fullWidth : ITEM_SIZE + 'px';

  const vertical = direction === SkinTonePickerDirection.VERTICAL;

  return (
    <Relative
      className={clsx('epr-skin-tones', direction, {
        [ClassNames.open]: isOpen
      })}
      style={
        vertical
          ? { "flex-basis": expandedSize, height: expandedSize }
          : { "flex-basis": expandedSize }
      }
    >
      <div class="epr-skin-tone-select" ref={setRef}>
        {skinToneVariations.map((skinToneVariation, i) => {
          const active = skinToneVariation === activeSkinTone();
          return (
            <Button
              // @ts-ignore  
              style={{
                transform: clsx(
                  vertical
                    ? `translateY(-${i * (isOpen() ? ITEM_SIZE : 0)}px)`
                    : `translateX(-${i * (isOpen() ? ITEM_SIZE : 0)}px)`,
                  isOpen() && active && 'scale(1.3)'
                )
              }}
              onClick={() => {
                if (isOpen()) {
                  setActiveSkinTone(skinToneVariation);
                  focusSearchInput();
                } else {
                  setIsOpen(true);
                }
                closeAllOpenToggles();
              }}
              className={clsx(`epr-tone-${skinToneVariation}`, 'epr-tone', {
                [ClassNames.active]: active
              })}
              tabIndex={isOpen() ? 0 : -1}
              aria-pressed={active}
              aria-label={`Skin tone ${skinTonesNamed[skinToneVariation as SkinTones]
                }`}
            ></Button>
          );
        })}
      </div>
    </Relative>
  );
}

export enum SkinTonePickerDirection {
  VERTICAL = ClassNames.vertical,
  HORIZONTAL = ClassNames.horizontal
}
