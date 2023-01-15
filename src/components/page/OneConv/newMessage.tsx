import { createSignal } from "solid-js";
import { ID } from "../../../store/common/type";
import { sendSignal } from "../../../store/signal/action";
import { RawSignal } from "../../../store/signal/type";
import Button from "../../common/Button/Button";
import TextField from "../../common/Form/MultilineTextField";


type Props = {
    chatId: ID;
    addSignal: (s: RawSignal[]) => void;
}


export default function NewSignal(props: Props) {

    const [textContent, setText] = createSignal('');

    const newMessage = () => {
        sendSignal(props.chatId, textContent(), []).then(props.addSignal);
        setText('');
    }

    // TODO: catch enter press to send the message

    return (
        <div
            style={{
                display: 'flex',
                "flex-direction": 'column',
            }}
        >
            <TextField
                // TODO: multiline
                value={textContent()}
                onChange={e => setText(e.target.value)}
            />
            <Button onClick={newMessage} >
                Send
            </Button>
        </div>
    );
}