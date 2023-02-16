import clsx from 'clsx';

import { asSelectors, ClassNames } from '../../DomUtils/classNames';
import {
  useAutoFocusSearchConfig,
  useSearchDisabledConfig,
  useSearchPlaceHolderConfig
} from '../../config/useConfig';
import { useCloseAllOpenToggles } from '../../hooks/useCloseAllOpenToggles';
import {
  getNormalizedSearchTerm,
  useClearSearch,
  useFilter
} from '../../hooks/useFilter';
import { useIsSkinToneInSearch } from '../../hooks/useShouldShowSkinTonePicker';
import Flex from '../Layout/Flex';
import Relative from '../Layout/Relative';
import { Button } from '../atoms/Button';
import { useSearchInputRef } from '../context/ElementRefContext';

import './Search.css';
import { SkinTonePicker } from './SkinTonePicker';
import { createSignal } from 'solid-js';

export function SearchContainer() {
  const searchDisabled = useSearchDisabledConfig();

  const isSkinToneInSearch = useIsSkinToneInSearch();

  if (searchDisabled()) {
    return null;
  }

  return (
    <Flex className="epr-header-overlay">
      <Search />

      {isSkinToneInSearch() ? <SkinTonePicker /> : null}
    </Flex>
  );
}

export function Search() {
  const [inc, setInc] = createSignal(0);
  const closeAllOpenToggles = useCloseAllOpenToggles();
  const SearchInputRef = useSearchInputRef();
  const clearSearch = useClearSearch();
  const placeholder = useSearchPlaceHolderConfig();
  const autoFocus = useAutoFocusSearchConfig();
  const { onChange } = useFilter();

  const [input] = SearchInputRef();
  const value = input()?.value;

  return (
    <Relative className="epr-search-container">
      <CssSearch value={value} />
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autofocus={autoFocus()}
        aria-label={'Type to search for an emoji'}
        onFocus={closeAllOpenToggles}
        class="epr-search"
        type="text"
        placeholder={placeholder()}
        onChange={event => {
          setInc(inc() + 1);
          setTimeout(() => {
            // @ts-ignore
            onChange(event?.target?.value ?? value);
          });
        }}
        ref={SearchInputRef}
      />
      <div class="epr-icn-search" />
      <Button
        className={clsx('epr-btn-clear-search', 'epr-visible-on-search-only')}
        onClick={clearSearch}
      >
        <div class="epr-icn-clear-search" />
      </Button>
    </Relative>
  );
}

const CSS_SEARCH_SELECTOR = `${asSelectors(
  ClassNames.emojiPicker
)} ${asSelectors(ClassNames.emojiList)}`;

function CssSearch({ value }: { value: undefined | string }) {
  if (!value) {
    return null;
  }

  const searchQuery = `button[data-full-name*="${getNormalizedSearchTerm(
    value
  )}"]`;

  return (
    <style>{`
        ${CSS_SEARCH_SELECTOR} ${asSelectors(
      ClassNames.category
    )}:not(:has(${searchQuery})) {
        display: none;
      }

        ${CSS_SEARCH_SELECTOR} button${asSelectors(
      ClassNames.emoji
    )}:not(${searchQuery}) {
        display: none;
      }
  `}</style>
  );
}
