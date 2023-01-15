import { EventSourceHandler } from "../utils/eventTargetUtils";

type EventHandler<T> = (msg: { ok: boolean; body: T; error: string }) => void;

export class WebsocketConnection extends EventSourceHandler {
  protected eventSource: WebSocket | undefined;
  protected eventHandlers: { [method: string]: EventHandler<any> } = {};

  public on<T>(method: string, func: EventHandler<T>) {
    this.eventHandlers[method] = func;
  }

  public unMount(name: string) {
    delete this.eventHandlers[name];
  }

  protected onMessage = (msg: MessageEvent<any>) => {
    const { data } = msg;
    const { type, body, ok, error }: { type: string; body: any; ok: boolean; error: string } = JSON.parse(data);
    console.log("[WS]:", msg);
    if (type) {
      this.eventHandlers[type]({ body, ok, error });
    }
  };

  public send = async (message: object | string) => {
    await this.ensureOpen();
    if (typeof message === "string") {
      this.eventSource?.send(message);
    } else {
      this.eventSource?.send(JSON.stringify(message));
    }
  };

  public query = async (method: string, body?: object) => {
    let msg = "";
    if (body) {
      msg = `${method},${JSON.stringify(body)}`;
    } else {
      msg = `${method},`;
    }
    console.debug(`sent ${msg}`);
    return this.send(msg);
  };

}