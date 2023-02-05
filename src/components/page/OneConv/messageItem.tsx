import { Box, Card, CardContent, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from "@suid/material";
import { Match, onMount, Show, Switch } from "solid-js";
import { mapSignalType, RawSignal } from "../../../store/signal/type";
import { useUsers } from "../../../store/user/context";
import ChatAvatar from "../../common/Avatar/Avatar";
import Button from "../../common/Button/Button";
import DateItem from "../../common/Date/DateItem";
import { renderers } from "./renderers/renderers";
import MoreVertIcon from '@suid/icons-material/MoreVert';

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

export default function OneMessage(props: Props & { isFirst: boolean; }) {
    // if isSelf align on the right else align on the left
    const Renderer = renderers[mapSignalType(props.signal.type)];
    let ref: any;
    onMount(() => {
        if (props.signal.scroll) {
            ref.scrollIntoView();
        }
    })
    const hasThread = false;

    const [users,] = useUsers();

    return (
        <ListItem

            sx={{
                width: '100%',
                alignItems: 'flex-start',
            }}

        >
            <ListItemAvatar>
                <Switch>
                    <Match when={props.isFirst}>
                        <ChatAvatar userId={props.signal.userId} />
                    </Match>
                    <Match when={!props.isFirst}>
                        <DateItem hourOnly date={props.signal.createdAt} />
                    </Match>
                </Switch>
            </ListItemAvatar>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
                ref={ref}
            >
                <Show when={props.isFirst}>
                    <Box
                        sx={{
                            display: 'flex',
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 900,
                            }}
                        >
                            {props.signal.userId ? users()[props.signal.userId].name : "Concord"}
                        </Typography>
                        &nbsp;&nbsp;
                        <DateItem date={props.signal.createdAt} />
                    </Box>
                </Show>
                <Renderer signal={props.signal} />
                <ListItemSecondaryAction>
                    {/* TODO: only display when this message is hovered */}
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </ListItemSecondaryAction>

                {hasThread && (
                    <Button variant="text" >
                        Thread
                    </Button>)}
            </Box>
        </ListItem>
    )
}