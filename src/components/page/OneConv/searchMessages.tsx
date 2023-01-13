import { A } from "@solidjs/router";
import { List, ListItem, ListItemText } from "@suid/material";
import { createResource, createSignal, For } from "solid-js";
import { ID } from "../../../store/common/type";
import { searchSignal } from "../../../store/signal/action";
import TextField from "../../common/Form/TextField";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";

type Props = {
  chatId: ID;
}

export default function SearchMessages(props: Props) {
  const [searchString, setSearchString] = createSignal('');

  const searchSignal_ = (s: string) => {
    return searchSignal(props.chatId, s);
  }

  const [signals] = createResource(searchString, searchSignal_);

  // to generate the url to jump to the correct message
  const makeUrl = (signalId: ID) => {
    return '';
  }

  return (
    <>
    <TextField value={searchString} onChange={e => setSearchString(e.target.value)} />
    <LoadingComponent loading={signals.loading}>
      <List>
        <For each={signals()}>
          {(signal) => (
            <A href={makeUrl(signal.createdAt)}>
              <ListItem>
                <ListItemText>
                  {signal.content}
                </ListItemText>
              </ListItem>
            </A>
          )}
        </For>
      </List>
    </LoadingComponent>
    </>
  );
}