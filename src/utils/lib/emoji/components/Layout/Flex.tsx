import clsx from 'clsx';
import { JSX } from 'solid-js';
import './Flex.css';

export enum FlexDirection {
  ROW = 'FlexRow',
  COLUMN = 'FlexColumn'
}

type Props = Readonly<{
  children: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  direction?: FlexDirection;
}>;

export default function Flex({
  children,
  className,
  style = {},
  direction = FlexDirection.ROW
}: Props) {
  return (
    <div style={{ ...style }} class={clsx('Flex', className, direction)}>
      {children}
    </div>
  );
}
