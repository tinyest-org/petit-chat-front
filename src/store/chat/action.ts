import { httpApi } from "../../api/api";
import { ID } from "../common/type";
import { RawSignal } from "../signal/type";

export const getChat = (chatId: ID) => {
    return httpApi.get<RawSignal[]>(`/chat/${chatId}`);
}