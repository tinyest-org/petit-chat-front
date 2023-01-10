import { Typography } from "@suid/material";
import { children, JSX } from "solid-js";
import ConvBar from "../page/ConvBar/ConvBar";

type Props = {
    children: JSX.Element;
}

export default function Layout(props: Props) {
    const c = children(() => props.children);
    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <ConvBar />
            <div>
                {c()}
            </div>
        </div>
    );
}