import { ListItem, ListItemText } from "@suid/material";
import { Chat } from "../../../store/chat/type";


type Props = {
    chat: Chat;
}

export default function OneConv(props: Props) {

    return ( // todo: add link
        <ListItem>
            <ListItemText>
                {props.chat.name}
            </ListItemText>
        </ListItem>
    )
}