import FavoriteIcon from '@suid/icons-material/Favorite';
import { Box, Icon, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, Typography } from "@suid/material";
import { createSignal, For, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { ID } from '../../../store/common/type';
import { addReaction, removeReaction } from '../../../store/signal/action';
import { mapSignalType, RawSignal, Reaction } from "../../../store/signal/type";
import { useUsers } from "../../../store/user/context";
import ChatAvatar, { useUser } from "../../common/Avatar/Avatar";
import Button from "../../common/Button/Button";
import DateItem from "../../common/Date/DateItem";
import { MessageHelper } from './messageHelper';
import { renderers } from "./renderers/renderers";
import * as unicodeEmoji from 'unicode-emoji';
import { EmojiButtonSelector } from '../../../utils/lib/emoji/DomUtils/selectors';
import EmojiPicker from '../../../utils/lib/emoji';

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
    const userId = useUser();

    const remove = () => {
        removeReaction.query({ chatId: props.chatId, signalId: props.signalId, value: props.reaction, userId });
    }

    return (
        <>
            <Button size='small' onClick={remove}>
                {/* {icon.emoji} */}
                like
            </Button>
        </>
    );
}

function ReactionComponent(props: Props & { chatId: ID }) {
    const [reactions, setReactions] = createSignal<Reaction[]>(props.signal.reactions || []);
    const userId = useUser();
    const handlesName = `${props.signal.uuid}`;

    onMount(() => {
        removeReaction.onMessage(handlesName, ({ query, success }) => {
            // has bug
            if (success) {
                if (query.signalId === props.signal.uuid) {
                    setReactions(old => old.filter(e => !(e.userId === query.userId && e.value === query.value)));
                }
            }
        });

        addReaction.onMessage(handlesName, ({ query, success }) => {
            if (success) {
                if (query.signalId === props.signal.uuid) {
                    setReactions(old => [...old, { value: query.value, userId: query.userId }]);
                }
            }
        });
    });

    onCleanup(() => {
        addReaction.removeHandle(handlesName);
        removeReaction.removeHandle(handlesName);
    });

    return (
        <Box>
            <For each={reactions()} >
                {(r) => <ReactionToggle chatId={props.chatId} signalId={props.signal.uuid} reaction={r.value} />}
            </For>
            <Button size='small' onClick={() => {
                addReaction.query({
                    chatId: props.chatId, signalId: props.signal.uuid, value: 'favorite', userId
                });
            }}>
                {/* {icon.emoji} */}
                like
            </Button>
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
    })
    const hasThread = false;
    const [hovered, setHovered] = createSignal(false);

    const [users,] = useUsers();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
        // onMouseLeave={() => setHovered(false)}
        >
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
                    <Show when={hovered()}>
                        <ListItemSecondaryAction>
                            <MessageHelper />
                        </ListItemSecondaryAction>
                        <EmojiPicker />
                    </Show>
                    <Show when={hasThread}>
                        <Button variant="text" >
                            Thread
                        </Button>
                    </Show>
                    <ReactionComponent chatId={props.chatId} signal={props.signal} />
                </Box>
            </ListItem>
        </div>
    )
}