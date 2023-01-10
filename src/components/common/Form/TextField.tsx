import { TextField as MuiTextField } from "@suid/material";
import { TextFieldProps } from "@suid/material/TextField";


type Props = TextFieldProps;


export default function TextField(props: Props) {

    return (
        <MuiTextField {...props} />
    )
}