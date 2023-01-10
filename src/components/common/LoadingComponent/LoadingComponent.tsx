import { CircularProgress } from "@suid/material";
import { JSX } from "solid-js";


type Props = {
    loading: boolean;
    children: JSX.Element;
}


export default function LoadingComponent(props: Props) {
    
    return (
        props.loading ? <CircularProgress /> : props.children
    );

}