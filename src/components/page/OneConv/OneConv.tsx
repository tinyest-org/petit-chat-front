import { Button } from "@suid/material";
import { useParams } from "@solidjs/router"
import { createResource } from "solid-js";
import { Chat } from "../../../store/chat/type";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";
import NewMessage from "./newMessage";

async function fetchUser(id: string) {


    return null as unknown as Chat;
}

export default function OneConv() {

    const params = useParams<{ id: string }>();
    const chatId = params.id;
    const [data, { refetch, mutate }] = createResource(() => chatId, fetchUser);

    return (
        <>
            <Button variant="contained">
                Current route is {data().id}
            </Button>
            <LoadingComponent loading={data.loading}>
                Messages here
            </LoadingComponent>
            {/* display paged messages */}
            <NewMessage chatId={chatId} />

        </>
    );
}