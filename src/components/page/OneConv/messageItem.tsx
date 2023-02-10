import MoreVertIcon from '@suid/icons-material/MoreVert';
import { Box, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, Typography } from "@suid/material";
import { For, Match, onMount, Show, Switch } from "solid-js";
import { ID } from '../../../store/common/type';
import { removeReaction } from '../../../store/signal/action';
import { mapSignalType, RawSignal } from "../../../store/signal/type";
import { useUsers } from "../../../store/user/context";
import ChatAvatar from "../../common/Avatar/Avatar";
import Button from "../../common/Button/Button";
import DateItem from "../../common/Date/DateItem";
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


function ReactionToggle(props: { reaction: string, signalId: ID, chatId: ID }) {

    const remove = () => {
        removeReaction.query({ chatId: props.chatId, signalId: props.signalId, value: props.reaction });
    }

    return (
        <>
            <Button onClick={remove} >
                {props.reaction}
            </Button>
        </>
    );
}

function ReactionComponent(props: Props & {chatId: ID}) {

    return (
        <Box>
            <For each={props.signal.reactions} >
                {(r) => <ReactionToggle chatId={props.chatId} signalId={props.signal.uuid} reaction={r.value} />}
            </For>
        </Box>
    );
}


export default function OneMessage(props: Props & { isFirst: boolean; chatId: ID }) {
    // if isSelf align on the right else align on the left
    const Renderer = renderers[mapSignalType(props.signal.type)];
    let ref: any;
    onMount(() => {
        if (props.signal.scroll) {
            ref.scrollIntoView();
        }

        removeReaction.onMessage(`${props.signal.uuid}`, () => {
            
        });

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
                            {/* TODO: fix reactive */}
                            {props.signal.userId ? users()[props.signal.userId]?.name : "Concord"}
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
                <ReactionComponent chatId={props.chatId} signal={props.signal} />
            </Box>
        </ListItem>
    )
}