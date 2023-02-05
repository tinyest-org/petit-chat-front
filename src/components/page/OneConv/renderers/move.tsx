import { ID } from "../../../../store/common/type";
import { useUsers } from "../../../../store/user/context";
import { SignalProps } from "../messageItem";

const parser = (s: string) => {
    const parsed = JSON.parse(s);
    return parsed as ID[]; // TODO: check this later
}

export function ArrivalSignal(props: SignalProps) {
    const { signal } = props;
    const parsed = parser(signal.content);
    const [users] = useUsers();
    const localUsers = parsed.map(e => users()[e]);
    return (
        <>
            {localUsers.map(e => e?.name).join(', ')} just arrived !
        </>
    );
}

export function LeftSignal(props: SignalProps) {
    const { signal } = props;
    const parsed = parser(signal.content);
    const [users] = useUsers();
    const localUsers = parsed.map(e => users()[e]);
    return (
        <>
            {localUsers.map(e => e?.name).join(', ')} just left !
        </>
    );
}