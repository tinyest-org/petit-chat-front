import { JSX } from "solid-js"

type Props = {
    children: JSX.Element;
}

export default function MainContent(props: Props) {


    return (
        <div
            style={{
                width: '100%'
            }}
        >
            {props.children}
        </div>
    )
}