import { get } from "../../api/api";
import { ID } from "../common/type"
import { RawSignal } from "../signal/type";



export type Chat = {
    id: ID;
    name: string;
}


export const getChat = (chatId: ID) => {
    return get<RawSignal[]>(`/chat/${chatId}`);
}