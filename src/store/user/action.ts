import { api } from "../../api/api"
import { User } from "./type";


export const searchUsers = (q: string) => {
    return api.http.get<User[]>(`/user/find?q=${q}`);
}