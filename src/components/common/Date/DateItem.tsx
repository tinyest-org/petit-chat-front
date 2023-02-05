import { Typography } from "@suid/material";
import { Match, Switch } from "solid-js";
import { date } from "../../../store/common/type";


type Props = {
    date: date | number;
    hourOnly?: boolean;
}

export default function DateItem(props: Props) {
    const d = new Date(typeof props.date === "number" ? props.date * 1000 : props.date);

    return (
        <Typography>
            <Switch fallback={d.toLocaleString()}>
                <Match when={props.hourOnly}>
                    {d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
                </Match>
            </Switch>
        </Typography>
    )
}