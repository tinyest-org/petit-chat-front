import clsx from 'clsx';

import { ClassNames } from '../../DomUtils/classNames';
import { usePickerSizeConfig, useThemeConfig } from '../../config/useConfig';
import useIsSearchMode from '../../hooks/useIsSearchMode';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useOnFocus } from '../../hooks/useOnFocus';
import { Theme } from '../../types/exposedTypes';
import { usePickerMainRef } from '../context/ElementRefContext';
import { PickerContext, PickerContextProvider } from '../context/PickerContext';
import './PickerMain.css';
import { JSX, useContext } from 'solid-js';

type Props = Readonly<{
  children: JSX.Element;
}>;

export default function PickerMain(props: Props) {
  return (
    <PickerContextProvider>
      <PickerRootElement>{props.children}</PickerRootElement>
    </PickerContextProvider>
  );
}

type RootProps = Readonly<{
  children: JSX.Element;
}>;

function PickerRootElement(props: RootProps) {
  const state = useContext(PickerContext)!;
  console.log(state);
  const theme = useThemeConfig();
  const searchModeActive = useIsSearchMode();
  const r  = usePickerMainRef();
  const [, setRef] = r();
  const i = usePickerSizeConfig();
  const { height, width } = i();
  useKeyboardNavigation();
  useOnFocus();
  
  const style = {
    height,
    width
  };

  return (
    <aside
      className={clsx(ClassNames.emojiPicker, 'epr-main', {
        [ClassNames.searchActive]: searchModeActive(),
        'epr-dark-theme': theme() === Theme.DARK
      })}
      ref={setRef}
      // @ts-ignore
      style={style}
    >
      {props.children}
    </aside>
  );
}
