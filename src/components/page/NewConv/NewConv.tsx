import { Avatar, Button, Checkbox, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField } from "@suid/material";
import { createEffect, createResource, createSignal, For } from "solid-js";
import { createChat } from "../../../store/chat/action";
import { searchUsers } from "../../../store/user/action";


type Props = {
    name: string;
    selected: boolean;
}

function OneUser(props: Props) {

    const value = props.name;
    return (
        <ListItem
            secondaryAction={
                <Checkbox
                    edge="end"
                    // onChange={handleToggle(value)}
                    checked={props.selected}
                    // inputProps={{ 'aria-labelledby': labelId }}
                />
            }
            disablePadding
        >
            <ListItemButton>
                <ListItemAvatar>
                    <Avatar
                        alt={`Avatar n°${value + 1}`}
                        src={`/static/images/avatar/${value + 1}.jpg`}
                    />
                </ListItemAvatar>
                <ListItemText primary={`Line item ${value + 1}`} />
            </ListItemButton>
        </ListItem>
    )
}


export default function NewConv() {
    const [value, setValue] = createSignal('');

    const [users, setUsers] = createSignal<string[]>([]);

    const [currentUsers] = createResource(value, searchUsers);

    const createChat_ = () => {
        createChat(users());
    }

    createEffect(()=>{
        if (currentUsers()) {
            setUsers(currentUsers().map(e => e.id));
        }
    })

    return (
        <>
            {/* search bar */}
            {/* selected names */}
            <TextField placeholder="Search user" onChange={e => setValue(e.target.value)} />
            <For each={currentUsers()}>
                {u => <OneUser name={u.name} selected />}
            </For>
            <Button onClick={createChat_}>
                Create
            </Button>
        </>
    );
}