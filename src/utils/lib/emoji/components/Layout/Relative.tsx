import { JSX } from "solid-js";

type Props = Readonly<{
  children: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
}>;

export default function Relative({ children, className, style }: Props) {
  return (
    <div style={{ ...style, position: 'relative' }} class={className}>
      {children}
    </div>
  );
}
