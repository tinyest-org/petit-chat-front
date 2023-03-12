import { api } from "../../api/api";
import { httpApi } from "../../api/httpApi";
import { GetJsonHttpLink, PostMultipartHttpLink, PutJsonHttpLink } from "../../api/newAPI/http/httpLink";
import { MultiLink, bridge, SimpleToArrayConverter } from "../../api/newAPI/link";
import { wsLinker } from "../../api/newAPI/websocket/wsLink";
import { ID } from "../common/type";
import { RawSignal } from "../signal/type";
import { User } from "../user/type";

export const getSignals = (chatId: ID) => {
    // TODO: check if has WS open, if so use ws 
    // else use simple http
    return api.http.get<RawSignal[]>(`/chat/${chatId}`);
}

export const createChat = (userIds: string[]) => {
    return api.http.post(`/chat`, { userIds })
}


export const createThread = (chatId: ID, signalId: ID, text: string) => {
    return api.http.post(`/chat/${chatId}/${signalId}`, { content: text });
}

type DetailedSignal = RawSignal & { chatId: string };

// TODO: add support for schema link
const wsNewMessageHandle = wsLinker.register.json.bind<{ chatId: string, body: any }, DetailedSignal>({ name: 'message', receiveOnly: true });

const wsReactionHandle = wsLinker.register.json.bind<{ chatId: string, body: any }, DetailedSignal>({ name: 'reaction', receiveOnly: true });

// TODO: add HttpLinker like wsLinker
const newMessagehttpLink = new PostMultipartHttpLink<{ chatId: string, body: any }, DetailedSignal[]>(httpApi, "/chat/{chatId}", ({ chatId, body }) => ({ path: { chatId }, body }));

export const newMessageHandleMulti = MultiLink.of([
    bridge
        .from(wsNewMessageHandle)
        .using(new SimpleToArrayConverter()),
    newMessagehttpLink
]);



export const getUsersLink = new GetJsonHttpLink<{ chatId: ID }, User[]>(httpApi, "/chat/{chatId}/users", ({ chatId }) => ({ path: { chatId } }));

export const updateCursor = new PutJsonHttpLink<{ chatId: ID, signalId: ID }, void>(httpApi, "/chat/{chatId}/cursor/{signalId}", ({ chatId, signalId }) => ({ path: { chatId, signalId } }))