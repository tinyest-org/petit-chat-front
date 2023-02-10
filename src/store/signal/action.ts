import { api } from "../../api/api";
import { httpApi } from "../../api/httpApi";
import { DeleteJsonHttpLink, PostMultipartHttpLink, PutBooleanHttpLink, PutJsonHttpLink } from "../../api/newAPI/httpLink";
import { ID } from "../common/type";
import { RawSignal } from "./type"

const l = new PostMultipartHttpLink<{ chatId: string, body: any }, RawSignal[]>(httpApi, "/chat/{chatId}", ({ chatId, body }) => ({ path: { chatId }, body }));

export const sendSignal = (chatId: ID, text: string, files: File[]) => {
    const body: any = {
        content: text
    };
    files.forEach(f => {
        body[f.name] = f;
    });
    // return api.http.post<RawSignal[]>(`/chat/${chatId}`, body, true, { cache: false, formatOption: "multipart" });
    return l.query({ chatId, body });
}


export const searchSignal = (chatId: ID, query: string) => {
    return api.http.get<RawSignal[]>(`/chat/${chatId}/search?q=${encodeURIComponent(query)}`);
}

const signalReactionUrl = "/chat/{chatId}/{signalId}/reaction/{value}";

export const addReaction = new PutBooleanHttpLink<{ chatId: ID, signalId: ID, value: string }>(
    httpApi, signalReactionUrl, ({ chatId, signalId, value }) => ({ path: { chatId, signalId, value } })
);
// TODO: make clean http implem
// TODO: finish implem
// addReaction.onMessage('e', ({ query, success }) => {
//     // filter by query id
// });

export const removeReaction = new DeleteJsonHttpLink<{ chatId: ID, signalId: ID, value: string }, void>(
    httpApi, signalReactionUrl, ({ chatId, signalId, value }) => ({ path: { chatId, signalId, value } })
);