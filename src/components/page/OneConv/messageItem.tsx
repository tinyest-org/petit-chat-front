import { Card, CardContent, ListItem, ListItemText } from "@suid/material";
import { Match, onMount, Switch } from "solid-js";
import { mapSignalType, RawSignal } from "../../../store/signal/type";
import Button from "../../common/Button/Button";
import { renderers } from "./renderers/renderers";

export type ExtendedSignal =
    RawSignal & {
        scroll?: boolean;
        pending: boolean;
    };


type Props = {
    signal: ExtendedSignal;
}

export type SignalProps = Props & {
    
}

export default function OneMessage(props: Props) {
    // if isSelf align on the right else align on the left
    const Renderer = renderers[mapSignalType(props.signal.type)];
    let ref: any;
    onMount(() => {
        if (props.signal.scroll) {
            ref.scrollIntoView();
        }
    })

    return (
        <Card
            sx={{
                width: '100%',
            }}
        >
            <CardContent ref={ref}>
                <Renderer signal={props.signal} />
            </CardContent>
        </Card>
    )
}