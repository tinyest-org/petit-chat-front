import { SignalProps } from "../messageItem";



export default function ImageSignal(props: SignalProps) {
    const url = props.signal.content;

    return (
        <>
            <img src={url} />
        </>
    );
}