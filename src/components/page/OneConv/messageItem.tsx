import { Card, CardContent, ListItem, ListItemText } from "@suid/material";
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

export default function OneMessage(props: Props) {
    const selfUserId = "43c0db5c-d829-4929-8efc-5e4a13bb202f"; // for Debug
    const isSelf = () => props.signal.userId === selfUserId;
    // if isSelf align on the right else align on the left
    const Renderer = renderers[mapSignalType(props.signal.type)];
    console.log(props, Renderer);
    return (
        <Card
            sx={{
                maxWidth: '80%',
            }}
        >
            <CardContent>
                <Renderer isSelf={isSelf()} signal={props.signal} />
            </CardContent>
        </Card>
    )
}