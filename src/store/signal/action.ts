import { post } from "../../api/api"
import { ID } from "../common/type";
import { RawSignal } from "./type"



export const sendSignal = (chatId: ID, text: string, files: File[]) => {
    // r = requests.post(f'{url}/chat/{chat_id}', files={"file":open('test.py', 'r')}, data={"content": payload})
    // TODO: multipart form data
    const body = {
        content: text
    }; // TODO
    files.forEach(f => {
        body[f.name] = f;
    });
    return post<RawSignal>(`/chat/${chatId}`, body, true, { cache: false, formatOption: "multipart" });
}

