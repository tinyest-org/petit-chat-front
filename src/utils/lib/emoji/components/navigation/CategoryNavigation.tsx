import clsx from 'clsx';
import './CategoryNavigation.css';

import { ClassNames } from '../../DomUtils/classNames';
import {
  categoryFromCategoryConfig,
  categoryNameFromCategoryConfig
} from '../../config/categoryConfig';
import { useCategoriesConfig } from '../../config/useConfig';
import { useActiveCategoryScrollDetection } from '../../hooks/useActiveCategoryScrollDetection';
import useIsSearchMode from '../../hooks/useIsSearchMode';
import { useScrollCategoryIntoView } from '../../hooks/useScrollCategoryIntoView';
import { Button } from '../atoms/Button';
import { ElementRefContext, useCategoryNavigationRef } from '../context/ElementRefContext';
import { createSignal, useContext } from 'solid-js';

export function CategoryNavigation() {
  const [activeCategory, setActiveCategory] = createSignal<string | null>(null);
  const scrollCategoryIntoView = useScrollCategoryIntoView();
  useActiveCategoryScrollDetection(setActiveCategory);
  const isSearchMode = useIsSearchMode();

  const categoriesConfig = useCategoriesConfig();
  const state = useContext(ElementRefContext)!;
  // const [, setRef] = useCategoryNavigationRef();
  const setRef = (r: any) => {
    state.CategoryNavigationRef[1](r);
  }
  return (
    <div class="epr-category-nav" ref={setRef}>
      {categoriesConfig().map(categoryConfig => {
        const category = categoryFromCategoryConfig(categoryConfig);
        return (
          <Button
            tabIndex={isSearchMode() ? -1 : 0}
            className={clsx('epr-cat-btn', `epr-icn-${category}`, {
              [ClassNames.active]: category === activeCategory()
            })}
            key={category}
            onClick={() => {
              setActiveCategory(category);
              scrollCategoryIntoView(category);
            }}
            aria-label={categoryNameFromCategoryConfig(categoryConfig)}
          />
        );
      })}
    </div>
  );
}
