





import { Accessor, createContext, createSignal, JSX, useContext } from "solid-js";
import { ID } from "../common/type";
import { User } from "./type";

type UserContext = [Accessor<{ [id: ID]: User }>, {
    add(user: User): void;
    remove(id: ID): void;
}];

const UserContext = createContext<UserContext>();

export function UserProvider(props: { children: JSX.Element; }) {
    const [users, setUsers] = createSignal<{ [id: ID]: User }>({});
    const store: UserContext = [
        users,
        {
            add(user: User) {
                setUsers(u => ({ ...u, [user.id]: user }))
            },
            remove(id: ID) {
                setUsers(u => {
                    delete u[id];
                    return { ...u };
                })
            }
        }
    ];

    return (
        <UserContext.Provider value={store}>
            {props.children}
        </UserContext.Provider>
    );
}

export function useUsers() {
    return useContext(UserContext)!;
}