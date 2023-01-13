import { ListItem, ListItemText } from "@suid/material";
import { Match, Switch } from "solid-js";
import { mapSignalType, RawSignal } from "../../../store/signal/type";
import Button from "../../common/Button/Button";
import { renderers } from "./renderers/renderers";

type Props = {
    signal: RawSignal;
}

export type SignalProps = Props & {
    isSelf: boolean;
}

function OneMessageText(props: SignalProps) {

    return (
        <ListItemText>
            {props.signal.content}
        </ListItemText>
    )
}

function OneMessageImage(props: SignalProps) {

    return (
        <img src={props.signal.content} />
    )
}

function OneMessageFile(props: SignalProps) {

    return (
        <div>
            <a href={props.signal.content}>
                <Button>
                    Download
                </Button>
            </a>
        </div>
    )
}

export default function OneMessage(props: Props) {
    const selfUserId = "43c0db5c-d829-4929-8efc-5e4a13bb202f"; // for Debug
    const isSelf = () => props.signal.userId === selfUserId;
    // if isSelf align on the right else align on the left
    const Renderer = renderers[mapSignalType(props.signal.type)];
    return (
        <ListItem>
            <Renderer isSelf={isSelf()} signal={props.signal} />
        </ListItem>
    )
}