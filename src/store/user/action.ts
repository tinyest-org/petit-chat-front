import { api } from "../../api/api"


export const searchUsers = (q: string) => {
    return api.http.get<any[]>(`/user/find?q=${q}`);
}