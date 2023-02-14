import { useDefaultSkinToneConfig } from '../../config/useConfig';
import { DataEmoji } from '../../dataUtils/DataTypes';
import { alphaNumericEmojiIndex } from '../../dataUtils/alphaNumericEmojiIndex';
import { useDebouncedState } from '../../hooks/useDebouncedState';
import { useDisallowedEmojis } from '../../hooks/useDisallowedEmojis';
import { FilterDict } from '../../hooks/useFilter';
import { useMarkInitialLoad } from '../../hooks/useInitialLoad';
import { SkinTones } from '../../types/exposedTypes';
import { useContext, createContext, createSignal, JSX, Signal } from 'solid-js';


export function PickerContextProvider({ children }: Props) {
  const disallowedEmojis = useDisallowedEmojis();
  const defaultSkinTone = useDefaultSkinToneConfig();

  // Initialize the filter with the inititial dictionary
  const filterRef = alphaNumericEmojiIndex;
  const disallowClickRef = false;
  const disallowMouseRef = false;
  const disallowedEmojisRef = disallowedEmojis;

  const suggestedUpdateState = useDebouncedState(Date.now(), 200);
  const searchTerm = useDebouncedState('', 100);
  const skinToneFanOpenState = createSignal<boolean>(false);
  const activeSkinTone = defaultSkinTone();
  const activeCategoryState = createSignal<ActiveCategoryState>(null);
  const emojisThatFailedToLoadState = createSignal<Set<string>>(new Set());
  const emojiVariationPickerState = createSignal<DataEmoji | null>(null);
  const [isPastInitialLoad, setIsPastInitialLoad] = createSignal(false);

  useMarkInitialLoad(setIsPastInitialLoad);

  return (
    <PickerContext.Provider
      value={{
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
      }}
    >
      {children}
    </PickerContext.Provider>
  );
}

type ContextType = Signal<{
  searchTerm: string;
  suggestedUpdateState: number;
  activeCategoryState: Signal<ActiveCategoryState>;
  activeSkinTone: SkinTones;
  emojisThatFailedToLoadState: Signal<Set<string>>;
  isPastInitialLoad: boolean;
  emojiVariationPickerState: DataEmoji | null;
  skinToneFanOpenState: boolean;
  filterRef: Signal<FilterState>;
  disallowClickRef: boolean;
  disallowMouseRef: boolean;
  disallowedEmojisRef: Record<string, boolean>;
}>;

const PickerContext = createContext<ContextType>();

type Props = Readonly<{
  children: JSX.Element;
}>;

export function useFilterRef() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useDisallowClickRef() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useDisallowMouseRef() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useSearchTermState() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useActiveSkinToneState() {
  const [state, setState] = useContext(PickerContext)!;
  return () => state().activeSkinTone;
}

export function useEmojisThatFailedToLoadState() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useIsPastInitialLoad() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useEmojiVariationPickerState() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useSkinToneFanOpenState() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

export function useDisallowedEmojisRef() {
  const [state, setState] = useContext(PickerContext)!;
  return state;
}

// export function useUpdateSuggested(): [number, () => void] {
//   const { suggestedUpdateState } = useContext(PickerContext);

//   const [suggestedUpdated, setsuggestedUpdate] = suggestedUpdateState;
//   return [
//     suggestedUpdated,
//     function updateSuggested() {
//       setsuggestedUpdate(Date.now());
//     }
//   ];
// }

export type FilterState = Record<string, FilterDict>;

type ActiveCategoryState = null | string;
