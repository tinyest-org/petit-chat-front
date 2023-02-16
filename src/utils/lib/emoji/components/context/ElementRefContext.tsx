import { focusElement } from "../../DomUtils/focusElement";
import { NullableElement } from "../../DomUtils/selectors";
import { Accessor, createContext, createSignal, JSX, Signal, useContext } from "solid-js";

export function ElementRefContextProvider(props: { children: JSX.Element }) {
  const PickerMainRef = createSignal(null);
  const AnchoredEmojiRef = createSignal(null);
  const BodyRef = createSignal(null);
  const SearchInputRef = createSignal(null);
  const SkinTonePickerRef = createSignal(null);
  const CategoryNavigationRef = createSignal(null);
  const VariationPickerRef = createSignal(null);

  return (
    <ElementRefContext.Provider
      value={{
        AnchoredEmojiRef,
        BodyRef,
        CategoryNavigationRef,
        PickerMainRef,
        SearchInputRef,
        SkinTonePickerRef,
        VariationPickerRef
      }}
    >
      {props.children}
    </ElementRefContext.Provider>
  );
}

export type ElementRef<
  E extends HTMLElement = HTMLElement
> = Signal<E | null>;

type ElementRefs = {
  PickerMainRef: ElementRef;
  AnchoredEmojiRef: ElementRef;
  SkinTonePickerRef: ElementRef<HTMLDivElement>;
  SearchInputRef: ElementRef<HTMLInputElement>;
  BodyRef: ElementRef<HTMLDivElement>;
  CategoryNavigationRef: ElementRef<HTMLDivElement>;
  VariationPickerRef: ElementRef<HTMLDivElement>;
};

export const ElementRefContext = createContext<ElementRefs>({
  PickerMainRef: createSignal(null),
  AnchoredEmojiRef: createSignal(null),
  BodyRef: createSignal(null),
  SearchInputRef: createSignal(null),
  SkinTonePickerRef: createSignal(null),
  CategoryNavigationRef: createSignal(null),
  VariationPickerRef: createSignal(null),
});

export function useElementRef() {
  return useContext(ElementRefContext);
}

export function usePickerMainRef() {
  const ref = useElementRef();
  return () => ref.PickerMainRef;
}

export function useAnchoredEmojiRef() {
  const ref = useElementRef();
  return () => ref.AnchoredEmojiRef;
}

export function useSetAnchoredEmojiRef(): (target: NullableElement) => void {
  const anchoredEmojiRef = useAnchoredEmojiRef()!;
  const [AnchoredEmojiRef, setRef] = anchoredEmojiRef();
  return (target: NullableElement) => {
    if (target === null && AnchoredEmojiRef() !== null) {
      focusElement(AnchoredEmojiRef());
    }

    setRef(target);
  };
}

export function useBodyRef() {
  const ref = useElementRef();
  return () => ref.BodyRef;
}

export function useSearchInputRef() {
  const ref = useElementRef();
  return () => ref.SearchInputRef;
}

export function useSkinTonePickerRef() {
  const ref = useElementRef();
  return () => ref.SkinTonePickerRef;
}

export function useCategoryNavigationRef() {
  const ref = useElementRef();
  return () => ref['CategoryNavigationRef'];
}

export function useVariationPickerRef() {
  const ref = useElementRef();
  return () => ref['VariationPickerRef'];
}
