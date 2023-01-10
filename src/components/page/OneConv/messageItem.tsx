import { ListItem, ListItemText } from "@suid/material";
import { RawSignal } from "../../../store/signal/type";

type Props = {
    signal: RawSignal;
}

function OneMessageText(props: Props) {

    return (
        <ListItemText>
            {props.signal.content}
        </ListItemText>
    )
}

function OneMessageImage(props: Props) {

    return (
        <img src={props.signal.content} />
    )
}


export default function OneMessage(props: Props) {


    return (
        <ListItem>
            {props.signal.type === 0 && <OneMessageText signal={props.signal} />}
            {props.signal.type === 1 && <OneMessageImage signal={props.signal} />}
        </ListItem>
    )
}