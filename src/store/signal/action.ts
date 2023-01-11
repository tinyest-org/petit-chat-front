import { httpApi } from "../../api/httpApi";
import { ID } from "../common/type";
import { RawSignal } from "./type"



export const sendSignal = (chatId: ID, text: string, files: File[]) => {
    const body = {
        content: text
    };
    files.forEach(f => {
        body[f.name] = f;
    });
    return httpApi.post<RawSignal>(`/chat/${chatId}`, body, true, { cache: false, formatOption: "multipart" });
}

