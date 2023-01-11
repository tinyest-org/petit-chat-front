import { httpApi } from "../../api/httpApi";
import { ID } from "../common/type";
import { RawSignal } from "../signal/type";

export const getChat = (chatId: ID) => {
    return httpApi.get<RawSignal[]>(`/chat/${chatId}`);
}