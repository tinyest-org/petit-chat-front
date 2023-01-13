import { Typography } from "@suid/material";
import { SignalProps } from "../messageItem";



export default function TextSignal(props: SignalProps) {

    return (
        <Typography>
            {props.signal.content}
        </Typography>
    );
}