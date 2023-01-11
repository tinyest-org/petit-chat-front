import { api } from "../../api/api";
import { ID } from "../common/type";
import { RawSignal } from "./type"



export const sendSignal = (chatId: ID, text: string, files: File[]) => {
    const body = {
        content: text
    };
    files.forEach(f => {
        body[f.name] = f;
    });
    // if has ws use ws else use http
    return api.http.post<RawSignal>(`/chat/${chatId}`, body, true, { cache: false, formatOption: "multipart" });
}

