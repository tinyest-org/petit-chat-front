import { TextField } from "@suid/material";
import { TextFieldProps } from "@suid/material/TextField";


type Props = TextFieldProps;


export default function MultilineTextField(props: Props) {

    return (
        <TextField {...props} />
    )
}