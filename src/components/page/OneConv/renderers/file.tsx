import { A } from "@solidjs/router";
import { IconButton } from "@suid/material";
import { CloudCircleOutlined } from "@suid/icons-material";
import { SignalProps } from "../messageItem";



export default function FileSignal(props: SignalProps) {
    // should have a version field
    const url = props.signal.content; // for now

    const download = () => {

    }

    return (
        <>
            <IconButton onClick={download}>
                <CloudCircleOutlined />
            </IconButton>
        </>
    );
}