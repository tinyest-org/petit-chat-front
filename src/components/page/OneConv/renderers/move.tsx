import { SignalProps } from "../messageItem";

const parser = (s: string) => {
    const parsed = JSON.parse(s);
    return parsed as string[]; // TODO: check this later
}

export function ArrivalSignal(props: SignalProps) {
    const { signal } = props;
    const parsed = parser(signal.content);

    return (
        <>
            {parsed.join(',')} just arrived
        </>
    );
}

export function LeftSignal(props: SignalProps) {
    const { signal } = props;
    const parsed = parser(signal.content);

    return (
        <>
            {parsed.join(',')} just left
        </>
    );
}