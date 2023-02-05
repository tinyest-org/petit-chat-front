import { AppBar, Typography } from "@suid/material";
import { children, JSX, onMount } from "solid-js";
import { api } from "../../../api/api";
import { getWs } from "../../../api/wsApi";
import SearchBar from "../SearchBar/SearchBar";
import ConvBar from "../../page/ConvBar/ConvBar";
import LeftBar from "./LeftBar";
import MainContent from "./mainContent";
import RightBar from "./RightBar";

type Props = {
    children: JSX.Element;
}

export default function Layout(props: Props) {

    onMount(() => {
        api.mountNotifications().then(() => console.log('ws open'));
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
                <LeftBar />
                <MainContent>
                    {props.children}
                </MainContent>
                <RightBar />
            </div>
        </div>
    );
}