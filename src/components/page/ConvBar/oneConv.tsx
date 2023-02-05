import { A } from "@solidjs/router";
import { Link, ListItem, ListItemText, Typography } from "@suid/material";
import { createSignal, onMount, Show } from "solid-js";
import { newMessageHandleMulti } from "../../../store/chat/action";
import { Chat } from "../../../store/chat/type";


type Props = {
    chat: Chat;
    lastMessage: string;
    unread: boolean;
}

export default function OneConv(props: Props) {
    const [lastMessage, setLastMessage] = createSignal<string>();

    onMount(() => {
        newMessageHandleMulti.onMessage('sideBar', (signals) => {
            console.log('side');
            signals.forEach(({ content, createdAt, chatId }) => {
                if (chatId == props.chat.id) {
                    setLastMessage(content);
                }
            });
        });
    })

    return ( // todo: add link
        <Link href={`/chat/${props.chat.id}`} component={A} underline="none">
            <ListItem>
                <ListItemText>
                    {props.chat.name}
                </ListItemText>
            </ListItem>
            <Show when={lastMessage()}>
                <Typography variant="subtitle2" >
                    <ListItemText>
                        {lastMessage()}
                    </ListItemText>
                </Typography>
            </Show>
        </Link>
    )
}