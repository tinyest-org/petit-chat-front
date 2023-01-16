import { RawSignal } from "../store/signal/type";
import { api, API } from "./api";
import { Message } from "./ws/wsUtils";

type Handler<T> = (t: T) => unknown;

class Handle<T> {

    private handlers: { name: string, handler: Handler<T> }[] = [];
    // private readonly holder: NotificationHolder<unknown>;

    constructor() {

    }

    public registerHandler = (name: string, handler: Handler<T>) => {
        this.handlers.push({ name, handler });
    }

    public unregisterHandler = (name: string) => {
        this.handlers = this.handlers.filter(e => e.name !== name);
    }

    private preparePayload(raw: any): T {
        if (typeof raw === "string") {
            return JSON.parse(raw) as unknown as T; // TODO: proper handle
        }
        throw new Error('data type not supported')
    }

    onMessage = (raw: any) => {
        const prepared = this.preparePayload(raw);
        this.handlers.forEach(h => {
            h.handler(prepared);
        });
    }
}

export class NotificationHolder<T extends { [name: string]: Handle<any> }> {

    private readonly api: API;
    private readonly handles: T;

    constructor(api: API, handles: T) {
        this.api = api;
        this.handles = handles;
        this.api.ws.onMessage = this.onMessage
    }

    public getHandle = (name: keyof T) => {
        return this.handles[name];
    }

    private onMessage = (msg: MessageEvent<any>) => {
        const { data } = msg;
        const { subject, content }: { content: string, subject: string } = JSON.parse(data);
        console.log("[WS]:", msg);
        if (subject) {
            this.handles[subject].onMessage(content);
        }
    };
}


const notificationHolder = new NotificationHolder(api, {
    'newMessage': new Handle<RawSignal & { chatId: string }>(),
});

export default notificationHolder;
