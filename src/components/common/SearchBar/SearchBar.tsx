import { TextFieldProps } from "@suid/material/TextField";
import TextField from "../Form/TextField";


type Props = TextFieldProps;

export default function SearchBar(props: Props) {
    
    return (
        <TextField {...props} />
    )
}