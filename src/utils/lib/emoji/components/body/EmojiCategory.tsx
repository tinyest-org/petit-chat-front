import clsx from 'clsx';

import { ClassNames } from '../../DomUtils/classNames';
import {
  CategoryConfig,
  categoryFromCategoryConfig,
  categoryNameFromCategoryConfig
} from '../../config/categoryConfig';
import './EmojiCategory.css';
import { JSX } from 'solid-js';

type Props = Readonly<{
  categoryConfig: CategoryConfig;
  children?: JSX.Element;
  hidden?: boolean;
  hiddenOnSearch?: boolean;
}>;

export function EmojiCategory({
  categoryConfig,
  children,
  hidden,
  hiddenOnSearch
}: Props) {
  const category = categoryFromCategoryConfig(categoryConfig);
  const categoryName = categoryNameFromCategoryConfig(categoryConfig);

  return (
    <li
      class={clsx(ClassNames.category, {
        [ClassNames.hidden]: hidden,
        [ClassNames.hiddenOnSearch]: hiddenOnSearch
      })}
      data-name={category}
      aria-label={categoryName}
    >
      <div class={ClassNames.label}>{categoryName}</div>
      <div class={ClassNames.categoryContent}>{children}</div>
    </li>
  );
}
