import { AppBar, Typography } from "@suid/material";
import { children, JSX } from "solid-js";
import SearchBar from "../common/SearchBar/SearchBar";
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