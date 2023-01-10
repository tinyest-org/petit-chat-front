import { ListItem, ListItemText } from "@suid/material";
import { RawSignal } from "../../../store/signal/type";
import Button from "../../common/Button/Button";

type Props = {
    signal: RawSignal;
}

type SignalProps = Props & {
    isSelf: boolean;
}

function OneMessageText(props: SignalProps) {

    return (
        <ListItemText>
            {props.signal.content}
        </ListItemText>
    )
}

function OneMessageMessage(props: SignalProps) {

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
    return (
        <ListItem>
            {props.signal.type === 0 && <OneMessageText isSelf={isSelf()} signal={props.signal} />}
            {props.signal.type === 1 && <OneMessageFile isSelf={isSelf()} signal={props.signal} />}
        </ListItem>
    )
}