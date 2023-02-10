import { useParams } from "@solidjs/router";
import { Box } from "@suid/material";
import { createEffect, createResource, createSignal, For, onCleanup, onMount } from "solid-js";
import { getSignals, getUsersLink, newMessageHandleMulti } from "../../../store/chat/action";
import { ID } from "../../../store/common/type";
import { RawSignal } from "../../../store/signal/type";
import { useUsers } from "../../../store/user/context";
import { User } from "../../../store/user/type";
import { distinct } from "../../../utils/utils";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";
import OneMessage, { ExtendedSignal } from "./messageItem";
import NewMessage from "./newMessage";

async function fetchMessages(id: string): Promise<(ExtendedSignal & { isFirst: boolean })[]> {
    const res = await getSignals(id);
    return mapResult(res.reverse()
        .filter(e => e.content !== null));

}

function mapResult(signals: RawSignal[]) {
    let currentId: ID;
    return signals.map(e => {
        if (e.userId === currentId) {
            return { ...e, pending: false, isFirst: false }
        } else {
            currentId = e.userId;
            return { ...e, pending: false, isFirst: true }
        }
    });
}

export default function OneConv() {

    const params = useParams<{ id: string }>();
    const [isEnd, setIsEnd] = createSignal(false);
    const chatId = () => params.id;
    const [data, { refetch, mutate }] = createResource(chatId, fetchMessages);
    const [users, { add }] = useUsers();


    const scroll = () => {
        mutate(e => {
            e = e || [];
            const b = [...e];
            const last = { ...e[e.length - 1], scroll: true };
            b[e.length - 1] = last;
            return [...b];
        });
    }

    createEffect(() => {
        getUsersLink.query({ chatId: chatId() });
    });

    onMount(() => {
        newMessageHandleMulti.onMessage('oneConv', s => {
            addSignal(s);
        });
        getUsersLink.onMessage('oneConv', users => {
            users.forEach(add);
        });
    });

    onCleanup(() => {
        // TODO: remove handle case
        // notificationHolder.getHandle('newMessage').unregisterHandler('oneConv');
    })


    const addSignal = (s: RawSignal[]) => {
        mutate(e => {
            e = e || [];
            const b = [...s].map(e => ({ ...e, pending: false }));
            const last = { ...b[b.length - 1], scroll: true };
            b[s.length - 1] = last;
            return mapResult(distinct([...e, ...b], a => a.uuid)); // prevent having the same twice
        });
    }

    createEffect(() => {
        if (data.state === "ready") {
            scroll();
        }
    });

    return (
        <Box
            sx={{
                height: '90vh',
                width: '100%',
            }}>
            <Box
                sx={{
                    width: '100%',
                    overflowY: 'scroll',
                    height: '80vh',
                }}
            >
                <LoadingComponent loading={data.loading}>
                    {isEnd() && "Vous êtes arrivé au bout du fil"}
                    <For each={data()}>
                        {e => <OneMessage chatId={chatId()} signal={e} isFirst={e.isFirst} />}
                    </For>
                </LoadingComponent>
            </Box>
            <NewMessage chatId={chatId()} addSignal={addSignal} />
        </Box>
    );
}