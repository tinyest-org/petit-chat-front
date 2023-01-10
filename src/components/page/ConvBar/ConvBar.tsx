import { List, Typography } from "@suid/material";
import { createResource, createSignal, For, onCleanup, onMount } from "solid-js";
import { get } from "../../../api/api";
import { Chat } from "../../../store/chat/type";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";
import OneConv from "./oneConv";


export default function ConvBar() {
    // should have paged list of conv here
    const [page, setPage] = createSignal(0); // increment on scroll
    const userId = '';

    const getChats = (userId: string) => {
        return get<Chat[]>('/user/me/chats');
    }

    const [chats, { }] = createResource(() => userId, getChats);

    onCleanup(() => {

    });

    return (
        <>
            <LoadingComponent loading={chats.loading}>
                <List sx={{
                    width: '20em',
                }}>
                    <For each={chats()}>
                        {(chat) => <OneConv chat={chat} />}
                    </For>
                </List>
            </LoadingComponent>
        </>
        // TODO: detect scroll for pagination
    );
}