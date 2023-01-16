import { A } from "@solidjs/router";
import { ListItem, ListItemText } from "@suid/material";
import { createSignal, onMount, Show } from "solid-js";
import { api } from "../../../api/api";
import notificationHolder from "../../../api/notification";
import { Chat } from "../../../store/chat/type";


type Props = {
    chat: Chat;
    lastMessage: string;
    unread: boolean;
}

export default function OneConv(props: Props) {
    const [lastMessage, setLastMessage] = createSignal<string>();
    
    onMount(() => {
        notificationHolder.getHandle('newMessage').registerHandler('msg', ({chatId, content, userId}) => {
            if (chatId == props.chat.id) {
                setLastMessage(content);
                console.log('e', props.chat.id === chatId)
            }
        });
    })

    return ( // todo: add link
        <A href={`/chat/${props.chat.id}`}>
            <ListItem>
                <ListItemText>
                    {props.chat.name}
                </ListItemText>
            </ListItem>
            <Show when={lastMessage()}>
                <ListItem>
                    <ListItemText>
                        {lastMessage()}
                    </ListItemText>
                </ListItem>
            </Show>
        </A>
    )
}