
import { api } from "./api";
import { EventSourceProducer } from "./utils/eventTargetUtils";
import { WebsocketConnection } from "./ws/wsUtils";

const WS_TOKEN = "__ws__";

export function getWebsocketToken() {
  return api.http.get<{ token: string }>("/ws/token-provider/");
}

const getWsAddr = () => {
  // const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  const isDev = true;
  if (isDev) {
    // handle local dev or remote dev
    const wsAddr = `ws://localhost:8090/ws`;
    return wsAddr;
  } else {
    return "wss://kiwix.gamma.junior-entreprises.com/api/ws";
    const wsAddr = `wss://${window.location.hostname}/api/ws`;
    return wsAddr;
  }
};


class WSUrlProvider implements EventSourceProducer {
  protected url: string;
  constructor(baseUrl: string) {
    this.url = baseUrl;
  }

  getSource = async () => {
    const res = await getWebsocketToken();
    const token = res.token;
    if (!token) {
      throw new Error("Failed to acquire token");
    }
    return new WebSocket(`${this.url}/${token}`);
  }
}


const wsAddr = getWsAddr();
console.debug(`Using ${wsAddr} to connect to ws`);
export const ws = new WebsocketConnection(new WSUrlProvider(wsAddr), () => { });

// @ts-ignore
window[WS_TOKEN] = ws;

export function getWs() {
  // @ts-ignore
  const ws = window[WS_TOKEN];
  return ws as WebsocketConnection;
}

// const wsOpenAtom = atom<boolean>({
//   key: "wsOpen",
//   default: false,
// });

// export const useSetWsOpen = () => useSetRecoilState(wsOpenAtom);

// export const useIsWsOpen = () => useRecoilState(wsOpenAtom);
