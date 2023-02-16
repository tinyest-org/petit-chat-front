import { scrollTo } from '../DomUtils/scrollTo';
import {
  usePickerMainRef,
  useSearchInputRef,
} from '../components/context/ElementRefContext';
import {
  FilterState,
  PickerContext,
  useFilterRef,
  useSearchTermState,
} from '../components/context/PickerContext';
import { DataEmoji } from '../dataUtils/DataTypes';
import { emojiNames } from '../dataUtils/emojiSelectors';

import { useFocusSearchInput } from './useFocus';
import { useContext } from 'solid-js';

function useSetFilterRef() {
  const filterRef = useFilterRef();
  const [_, setState] = useContext(PickerContext)!;
  return function setFilter(
    setter: FilterState | ((current: FilterState) => FilterState)
  ): void {
    if (typeof setter === 'function') {
      return setFilter(setter(filterRef()));
    }

    setState(old => ({ ...old, filterRef: setter }));
  };
}

export function useClearSearch() {
  const applySearch = useApplySearch();
  const focusSearchInput = useFocusSearchInput();
  const SearchInputRef = useSearchInputRef();
  const [searchInputRef] = SearchInputRef();

  return function clearSearch() {
    if (SearchInputRef()) {
      searchInputRef()!.value = '';
    }

    applySearch('');
    focusSearchInput();
  };
}

export function useAppendSearch() {
  const SearchInputRef = useSearchInputRef();
  const searchInputRef = SearchInputRef();
  const applySearch = useApplySearch();

  return function appendSearch(str: string) {
    if (SearchInputRef()) {
      searchInputRef[0]()!.value = `${searchInputRef[0]()!.value}${str}`;
      applySearch(getNormalizedSearchTerm(searchInputRef[0]()!.value));
    } else {
      applySearch(getNormalizedSearchTerm(str));
    }
  };
}

export function useFilter() {
  const SearchInputRef = useSearchInputRef();
  const filterRef = useFilterRef();
  const setFilterRef = useSetFilterRef();
  const applySearch = useApplySearch();

  const SearchTerm = useSearchTermState();

  return {
    onChange,
    searchTerm: SearchTerm(),
    SearchInputRef,
  };

  function onChange(inputValue: string) {
    const filter = filterRef();

    const nextValue = inputValue.toLowerCase();

    if (filter?.[nextValue] || nextValue.length <= 1) {
      return applySearch(nextValue);
    }

    const longestMatch = findLongestMatch(nextValue, filter);

    if (!longestMatch) {
      // Can we even get here?
      // If so, we need to search among all emojis
      return applySearch(nextValue);
    }

    setFilterRef((current) =>
      Object.assign(current, {
        [nextValue]: filterEmojiObjectByKeyword(longestMatch, nextValue),
      })
    );
    applySearch(nextValue);
  }
}

function useApplySearch() {
  const state = useSearchTermState();
  const [, setSearchTerm] = state();
  const PickerMainRef = usePickerMainRef();
  const [ref, setRef] = PickerMainRef();
  return function applySearch(searchTerm: string) {
    requestAnimationFrame(() => {
      setSearchTerm(searchTerm ? searchTerm?.toLowerCase() : searchTerm);
      (
        () => {
          scrollTo(ref(), 0);
        }
      );
    });
  };
}

function filterEmojiObjectByKeyword(
  emojis: FilterDict,
  keyword: string
): FilterDict {
  const filtered: FilterDict = {};

  for (const unified in emojis) {
    const emoji = emojis[unified];

    if (hasMatch(emoji, keyword)) {
      filtered[unified] = emoji;
    }
  }

  return filtered;
}

function hasMatch(emoji: DataEmoji, keyword: string): boolean {
  return emojiNames(emoji).some((name) => name.includes(keyword));
}

export function useIsEmojiFiltered(): (unified: string) => boolean {
  const filterRef = useFilterRef();
  const SearchTerm = useSearchTermState();
  const [searchTerm] = SearchTerm();
  return (unified) => isEmojiFilteredBySearchTerm(unified, filterRef(), searchTerm());
}

function isEmojiFilteredBySearchTerm(
  unified: string,
  filter: FilterState,
  searchTerm: string
): boolean {
  if (!filter || !searchTerm) {
    return false;
  }

  return !filter[searchTerm]?.[unified];
}

export type FilterDict = Record<string, DataEmoji>;

function findLongestMatch(
  keyword: string,
  dict: Record<string, FilterDict> | null
): FilterDict | null {
  if (!dict) {
    return null;
  }

  if (dict[keyword]) {
    return dict[keyword];
  }

  const longestMatchingKey = Object.keys(dict)
    .sort((a, b) => b.length - a.length)
    .find((key) => keyword.includes(key));

  if (longestMatchingKey) {
    return dict[longestMatchingKey];
  }

  return null;
}

export function getNormalizedSearchTerm(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str.trim().toLowerCase();
}
