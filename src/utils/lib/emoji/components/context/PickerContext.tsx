import { useDefaultSkinToneConfig } from '../../config/useConfig';
import { DataEmoji } from '../../dataUtils/DataTypes';
import { alphaNumericEmojiIndex } from '../../dataUtils/alphaNumericEmojiIndex';
import { useDebouncedState } from '../../hooks/useDebouncedState';
import { useDisallowedEmojis } from '../../hooks/useDisallowedEmojis';
import { FilterDict } from '../../hooks/useFilter';
import { useMarkInitialLoad } from '../../hooks/useInitialLoad';
import { SkinTones } from '../../types/exposedTypes';
import { useContext, createContext, createSignal, JSX, Signal, Accessor } from 'solid-js';


export function PickerContextProvider(props: Props) {
  const disallowedEmojis = useDisallowedEmojis();
  const defaultSkinTone = useDefaultSkinToneConfig();

  // Initialize the filter with the inititial dictionary
  const filterRef = alphaNumericEmojiIndex;
  const disallowClickRef = false;
  const disallowMouseRef = false;
  const disallowedEmojisRef = disallowedEmojis();

  const suggestedUpdateState = useDebouncedState(Date.now(), 200);
  const searchTerm = useDebouncedState('', 100);
  const skinToneFanOpenState = false;
  const activeSkinTone = defaultSkinTone();
  const activeCategoryState: string | null = null;
  const emojisThatFailedToLoadState = new Set<string>();
  const emojiVariationPickerState: DataEmoji | null = null;
  const [isPastInitialLoad, setIsPastInitialLoad] = createSignal(false);

  useMarkInitialLoad(setIsPastInitialLoad);

  const sig = createSignal<ContextType>({
    activeCategoryState,
    activeSkinTone,
    disallowClickRef,
    disallowMouseRef,
    disallowedEmojisRef,
    emojiVariationPickerState,
    emojisThatFailedToLoadState,
    filterRef,
    isPastInitialLoad,
    searchTerm,
    skinToneFanOpenState,
    suggestedUpdateState
  });

  return (
    <PickerContext.Provider
      value={sig}
    >
      {props.children}
    </PickerContext.Provider>
  );
}

type DebouncedState<T> = [Accessor<T>, (v: T) => Promise<void>];

type ContextType = {
  searchTerm: DebouncedState<string>;
  suggestedUpdateState: DebouncedState<number>;
  activeCategoryState: ActiveCategoryState;
  activeSkinTone: SkinTones;
  emojisThatFailedToLoadState: Set<string>;
  isPastInitialLoad: Accessor<boolean>;
  emojiVariationPickerState: DataEmoji | null;
  skinToneFanOpenState: boolean;
  filterRef: FilterState;
  disallowClickRef: boolean;
  disallowMouseRef: boolean;
  disallowedEmojisRef: Record<string, boolean>;
};

export const PickerContext = createContext<Signal<ContextType>>();

type Props = Readonly<{
  children: JSX.Element;
}>;

export function useFilterRef() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().filterRef;
}

export function useDisallowClickRef() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().disallowClickRef;
}

export function useDisallowMouseRef() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().disallowMouseRef;
}

export function useSearchTermState() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().searchTerm;
}

export function useActiveSkinToneState() {
  console.log(useContext(PickerContext));
  const [state, setState] = useContext(PickerContext)!;
  return () => state().activeSkinTone;
}

export function useEmojisThatFailedToLoadState() {
  console.log(useContext(PickerContext));
  const [state, setState] = useContext(PickerContext)!;
  return () => state().emojisThatFailedToLoadState;
}

export function useIsPastInitialLoad() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().isPastInitialLoad;
}

export function useEmojiVariationPickerState() {
  console.log(useContext(PickerContext));
  const [state, setState] = useContext(PickerContext)!;
  return () => state().emojiVariationPickerState;
}

export function useSkinToneFanOpenState() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().skinToneFanOpenState;
}

export function useDisallowedEmojisRef() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().disallowedEmojisRef;
}

export function useUpdateSuggested(): () => [number, () => void] {
  const [state] = useContext(PickerContext)!;

  return () => [
    state().suggestedUpdateState[0](),
    function updateSuggested() {
      state().suggestedUpdateState[1](Date.now());
    }
  ];
}

export type FilterState = Record<string, FilterDict>;

type ActiveCategoryState = null | string;
