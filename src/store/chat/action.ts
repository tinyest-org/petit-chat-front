import { api } from "../../api/api";
import { ID } from "../common/type";
import { RawSignal } from "../signal/type";

export const getSignals = (chatId: ID) => {
    // TODO: check if has WS open, if so use ws 
    // else use simple http
    return api.http.get<RawSignal[]>(`/chat/${chatId}`);
}

export const createChat = (userIds: string[]) => {
    return api.http.post(`/chat`, {userIds})
}