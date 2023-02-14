import { createContext, JSX, useContext } from 'solid-js';
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

export function PickerConfigProvider({ children, ...config }: Props) {
  return (
    <ConfigContext.Provider value={mergeConfig(config)}>
      {children}
    </ConfigContext.Provider>
  );
}

export function usePickerConfig() {
  return useContext(ConfigContext);
}
