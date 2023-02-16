import { createContext, createSignal, JSX, splitProps, useContext } from 'solid-js';
import { spread } from 'solid-js/web';
import {
  baseSignal,
  mergeConfig,
  PickerConfig,
  PickerConfigInternal
} from '../../config/config';

type Props = PickerConfig &
  Readonly<{
    children: JSX.Element
  }>;

const ConfigContext = createContext<PickerConfigInternal>(baseSignal());

export function PickerConfigProvider(props: Props) {
  const [children, config ] = splitProps(props, ["children"]) ;
  const conf = createSignal(config);
  return (
    // @ts-ignore
    <ConfigContext.Provider value={mergeConfig(conf)}>
      {props.children}
    </ConfigContext.Provider>
  );
}

export function usePickerConfig() {
  return useContext(ConfigContext);
}
