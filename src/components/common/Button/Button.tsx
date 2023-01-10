import MuiButton, { ButtonProps } from "@suid/material/Button";

type Props = ButtonProps;

export default function Button(props: Props) {

    return (
        <>
            <MuiButton {...props} />
        </>
    );
}