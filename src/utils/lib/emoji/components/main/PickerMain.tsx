import clsx from 'clsx';

import { ClassNames } from '../../DomUtils/classNames';
import { usePickerSizeConfig, useThemeConfig } from '../../config/useConfig';
import useIsSearchMode from '../../hooks/useIsSearchMode';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useOnFocus } from '../../hooks/useOnFocus';
import { Theme } from '../../types/exposedTypes';
import { usePickerMainRef } from '../context/ElementRefContext';
import { PickerContextProvider } from '../context/PickerContext';
import './PickerMain.css';
import { JSX } from 'solid-js';

type Props = Readonly<{
  children: JSX.Element;
}>;

export default function PickerMain({ children }: Props) {
  return (
    <PickerContextProvider>
      <PickerRootElement>{children}</PickerRootElement>
    </PickerContextProvider>
  );
}

type RootProps = Readonly<{
  children: JSX.Element;
}>;

function PickerRootElement({ children }: RootProps) {
  const theme = useThemeConfig();
  const searchModeActive = useIsSearchMode();
  const [, setRef] = usePickerMainRef();
  const { height, width } = usePickerSizeConfig();

  useKeyboardNavigation();
  useOnFocus();

  const style = {
    height,
    width
  };

  return (
    <aside
      className={clsx(ClassNames.emojiPicker, 'epr-main', {
        [ClassNames.searchActive]: searchModeActive,
        'epr-dark-theme': theme === Theme.DARK
      })}
      ref={setRef}
      // @ts-ignore
      style={style}
    >
      {children}
    </aside>
  );
}
