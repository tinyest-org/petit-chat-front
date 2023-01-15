import { A } from "@solidjs/router";
import { IconButton } from "@suid/material";



export default function NewChat() {

    return (
        <A href="/chat/new">
            <IconButton>
                +
            </IconButton>
        </A>
    );
}