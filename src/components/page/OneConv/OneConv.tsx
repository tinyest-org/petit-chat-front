import { Button, Typography } from "@suid/material";
import { useParams } from "@solidjs/router"
import { createResource, createSignal, For, onMount } from "solid-js";
import { Chat } from "../../../store/chat/type";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";
import NewMessage from "./newMessage";
import OneMessage from "./messageItem";
import { RawSignal } from "../../../store/signal/type";
import { getSignals } from "../../../store/chat/action";

const chatId = '43c0db5c-d829-4929-8efc-5e4a13bb202f';

async function fetchMessages(id: string) {
    const res = await getSignals(id);
    return res.reverse().filter(e => e.content !== null);
}

export default function OneConv() {

    const params = useParams<{ id: string }>();
    const [isEnd, setIsEnd] = createSignal(false);
    const chatId = params.id;
    const [data, { refetch, mutate }] = createResource(() => chatId, fetchMessages);

    const addSignal = (s: RawSignal[]) => {
        // does not work correctly
        mutate(e => {
            return [...e, ...s];
        });
    }
    console.log(data.loading);
    return (
        <div
        style={{
            height: '90vh',
            width: '100%',
        }}>
            <div
                style={{
                    width: '100%',
                    "overflow-y": 'scroll',
                    height: '80vh',
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
            </div>
            <NewMessage chatId={chatId} addSignal={addSignal} />
        </div>
    );
}