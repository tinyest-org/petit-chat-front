import { api, API } from "./api";

type Handler<T> = (t: T) => unknown;

class Handle<T> {

    private handlers: { name: string, handler: Handler<T> }[];
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
        return raw as unknown as T; // TODO: proper handle
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
    }

    public getHandle = (name: keyof T) => {
        return this.handles[name];
    }

    private onMessage = () => {

    }
}


const notificationHolder = new NotificationHolder(api, {
    'newMessage': new Handle<{ content: string }>(),
});

export default notificationHolder;

notificationHolder.getHandle('newMessage').registerHandler('yay', msg => {
    msg.content
})