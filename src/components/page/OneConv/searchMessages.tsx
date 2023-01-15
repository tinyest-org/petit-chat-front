import { A, useParams } from "@solidjs/router";
import { List, ListItem, ListItemText } from "@suid/material";
import { createResource, createSignal, For } from "solid-js";
import { ID } from "../../../store/common/type";
import { searchSignal } from "../../../store/signal/action";
import TextField from "../../common/Form/TextField";
import LoadingComponent from "../../common/LoadingComponent/LoadingComponent";

type Props = {

}

export default function SearchMessages(props: Props) {
  const [searchString, setSearchString] = createSignal('');
  const { id: chatId } = useParams<{ id: string }>();
  const searchSignal_ = async (s: string) => {
    if (chatId && s) {
      return await searchSignal(chatId, s);
    } else {
      return [];
    }

  }

  const [signals] = createResource(searchString, searchSignal_);

  // to generate the url to jump to the correct message
  const makeUrl = (signalId: ID) => {
    return '';
  }

  return (
    <>
      <TextField value={searchString()} onChange={e => {
        console.log(e.target.value);
        setSearchString(e.target.value)
      }} />
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