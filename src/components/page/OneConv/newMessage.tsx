import { Button, TextField } from "@suid/material";
import { createSignal } from "solid-js";
import { ID } from "../../../store/common/type";


type Props = {
    chatId: ID;
}


export default function NewSignal(props: Props) {

    const [textContent, setText] = createSignal('');

    return (
        <>
            <TextField
                // TODO: multiline
                value={textContent()}
                onChange={e => setText(e.target.value)}
            />
            <Button>
                Send
            </Button>
        </>
    );
}