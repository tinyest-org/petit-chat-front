import { AppBar, Typography } from "@suid/material";
import { children, JSX, onMount } from "solid-js";
import { getWs } from "../../api/wsApi";
import SearchBar from "../common/SearchBar/SearchBar";
import ConvBar from "../page/ConvBar/ConvBar";

type Props = {
    children: JSX.Element;
}

export default function Layout(props: Props) {
    const c = children(() => props.children);

    onMount(()=>{
        const ws = getWs();
        ws.ensureOpen();
    })

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <AppBar>
                <SearchBar />
            </AppBar>
            <div
                style={{
                    display: 'flex',
                    "margin-top": "56px",
                    width: '100%',
                }}
            >
                <ConvBar />
                <div
                    style={{
                        width: '100%'
                    }}
                >
                    {c()}
                </div>
            </div>
        </div>
    );
}