import { A } from "@solidjs/router";
import { ListItem, ListItemText } from "@suid/material";
import { Chat } from "../../../store/chat/type";


type Props = {
    chat: Chat;
    lastMessage: string;
    unread: boolean;
}

export default function OneConv(props: Props) {

    return ( // todo: add link
        <A href={`/chat/${props.chat.id}`}>
            <ListItem>
                <ListItemText>
                    {props.chat.name}
                </ListItemText>
            </ListItem>
        </A>
    )
}