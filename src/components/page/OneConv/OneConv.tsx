import { Button } from "@suid/material";
import { useParams } from "@solidjs/router"
import { createResource } from "solid-js";
import { Chat } from "../../../store/chat/type";

function fetchUser(id: string) {


    return null as unknown as Chat;
} 

export default function OneConv() {

    const params = useParams<{id: string}>();

    const [data] = createResource(() => params.id, fetchUser);

    return (
        <>
            <Button variant="contained">
                Current route is {data().id}
            </Button>;
        </>
    );
}