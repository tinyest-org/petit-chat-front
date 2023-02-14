import clsx from 'clsx';
import { JSX } from 'solid-js';

interface Props
  extends JSX.DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
  tabIndex: number;
}

export function Button(props: Props) {
  return (
    <button
      type="button"
      {...props}
      tabIndex={props.tabIndex}
      class={clsx('epr-btn', props.className)}
    >
      {props.children}
    </button>
  );
}
