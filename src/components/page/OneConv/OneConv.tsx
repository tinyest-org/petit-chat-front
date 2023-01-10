import { Button, Typography } from "@suid/material";
import { useParams } from "@solidjs/router"
import { createResource, createSignal, For, onMount } from "solid-js";
import { Chat, getChat } from "../../../store/chat/type";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";
import NewMessage from "./newMessage";
import OneMessage from "./messageItem";

const chatId = '43c0db5c-d829-4929-8efc-5e4a13bb202f';

async function fetchMessages(id: string) {
    return getChat(id);
}

export default function OneConv() {

    const params = useParams<{ id: string }>();
    const [isEnd, setIsEnd] = createSignal(false);
    const chatId = params.id;
    const [data, { refetch, mutate }] = createResource(() => chatId, fetchMessages);

    return (
        <div
            style={{
                width: '100%',
            }}
        >
            {/* display paged messages */}
            <Typography>
                {chatId}
            </Typography>
            <LoadingComponent loading={data.loading}>
                {isEnd() && "Vous êtes arrivé au bout du fil"}
                <For each={data()}>
                    {e => <OneMessage signal={e} />}
                </For>
            </LoadingComponent>
            <NewMessage chatId={chatId} />
        </div>
    );
}