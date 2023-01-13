import { List, Typography } from "@suid/material";
import { createResource, createSignal, For, onCleanup, onMount } from "solid-js";
import { api } from "../../../api/api";
import { Chat } from "../../../store/chat/type";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";
import SearchBar from "../../common/SearchBar/SearchBar";
import OneConv from "./oneConv";


export default function ConvBar() {
    // should have paged list of conv here
    const [page, setPage] = createSignal(0); // increment on scroll
    const userId = '';

    const getChats = (offset: number) => {
        return api.http.get<Chat[]>('/user/me/chats');
    }

    const [chats, { }] = createResource(page, getChats);

    return (
        <div style={{
            display: 'flex',
            "flex-direction": "column",
            width: '15em',
        }}>
            <SearchBar />
            <LoadingComponent loading={chats.loading}>
                <List>
                    <For each={chats()}>
                        {(chat) => <OneConv unread={false} lastMessage="" chat={chat} />}
                    </For>
                    {/* detect end of item and ask for next items */}
                </List>
            </LoadingComponent>
        </div>
        // TODO: detect scroll for pagination
    );
}