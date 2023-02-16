import clsx from 'clsx';
import { JSX } from 'solid-js';


type Props = Readonly<{
  className?: string;
  style?: JSX.CSSProperties;
}>;

export default function Space({ className, style = {} }: Props) {
  return <div style={{ flex: 1, ...style }} class={clsx(className)} />;
}
