import { CircularProgress } from "@suid/material";
import { children, JSX, Show } from "solid-js";


type Props = {
    loading: boolean;
    children: JSX.Element;
}


export default function LoadingComponent(props: Props) {
    const c = children(() => props.children);
    return (
        <Show when={() => props.loading} fallback={<CircularProgress />}>
            {c()}
        </Show>
    );
}