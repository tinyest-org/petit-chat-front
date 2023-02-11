import { Avatar } from "@suid/material";
import { ID } from "../../../store/common/type";
import { useUsers } from "../../../store/user/context";
import { User } from "../../../store/user/type";

type Props = {
    userId: ID;
}

class Store {

    data = {
        "43c0db5c-d829-4929-8efc-5e4a13bb202f": "https://documents.junior-entreprises.com/kiwi-public/user/45120/profile/f24b5ac1-4521-4081-86c1-61d690176529.png"
    }

    getUrl(id: ID) {
        // @ts-ignore
        return this.data[id] as string | undefined;
    }
}

const store = new Store();

/**
 * To handle profile picture change later
 * @param user 
 * @returns 
 */
function useProfilePicture(userId: ID) {
    const [users,] = useUsers();
    const url = users()[userId]?.profilePicture;
    return url;
}

export function useUser() {
    return "1d7d2f85-1ef1-4e7b-994b-ebf24cac2b99" as ID;
}


export default function ChatAvatar(props: Props) {
    const url = useProfilePicture(props.userId);
    return (
        <>
            <Avatar
                sizes="small"
                src={url}
            >
            </Avatar>
        </>
    )
}