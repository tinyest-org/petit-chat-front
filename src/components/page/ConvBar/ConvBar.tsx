import { List } from "@suid/material";
import { createSignal, For, onCleanup, onMount } from "solid-js";
import { Chat } from "../../../store/chat/type";
import OneConv from "./oneConv";


export default function ConvBar() {
    // should have paged list of conv here
    const [page, setPage] = createSignal(0); // increment on scroll
    
    onMount(() => {
        // TODO: fetch initial ?
    });

    onCleanup(() => {

    });

    return (
        <List>
            <For each={[] as Chat[]}>
                {(chat) => <OneConv chat={chat} />}
            </For>
        </List>
        // TODO: detect scroll for pagination
    );
}