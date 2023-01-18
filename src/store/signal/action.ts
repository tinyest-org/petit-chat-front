import { api } from "../../api/api";
import { ID } from "../common/type";
import { RawSignal } from "./type"


export const sendSignal = (chatId: ID, text: string, files: File[]) => {
    const body: any = {
        content: text
    };
    files.forEach(f => {
        body[f.name] = f;
    });
    // if has ws use ws else use http
    return api.http.post<RawSignal[]>(`/chat/${chatId}`, body, true, { cache: false, formatOption: "multipart" });
}


export const searchSignal = (chatId: ID, query: string) => {
    return api.http.get<RawSignal[]>(`/chat/${chatId}/search?q=${encodeURIComponent(query)}`);
}