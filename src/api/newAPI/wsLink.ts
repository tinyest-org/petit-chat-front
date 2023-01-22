import { RawSignal } from "../../store/signal/type";
import { httpApi } from "../httpApi";
import { WebsocketConnection } from "../ws/wsUtils";
import { getWs, ws } from "../wsApi";
import { PostMultipartHttpLink } from "./httpLink";
import { AbstractLink, Converter, Link, MultiLink } from "./link";

export class WsLinker<T extends {}, R> {
    protected readonly wsAPI: WebsocketConnection;
    protected handles: { [name: string]: WsLink<any> } = {};

    constructor(wsAPI: WebsocketConnection) {
        this.wsAPI = wsAPI;
        // Todo: hijack thats not pretty
        // should re implement everything here
        this.wsAPI.onMessage = this.internalOnMessage;
    }

    available(): boolean {
        return this.wsAPI.isOpen();
    }

    async query(t: string): Promise<undefined> {
        this.wsAPI.send(t);
        return undefined;
    }

    registerHandle(name: string, handle: WsLink<any>) {
        this.handles[name] = handle;

    }

    private internalOnMessage = (evt: MessageEvent<string>) => {
        const { data } = evt;
        // TODO: should be first decoder here for the router -> extract the logic
        const { subject, content }: { content: string, subject: string } = JSON.parse(data);
        if (subject) {
            this.handles[subject].doOnMessage(content);
        }
    }

    // implementer le "on" -> listen
    // ajouter un router pour router les réponses
    // récuperer le onMessagde de la co ws
    // utiliser le decoder pour decoder la méthode et utiliser un router pour router les réponses
}

class WsJsonEncoder<T extends {}> implements Converter<T, string> {
    method: string;
    constructor(method: string) {
        this.method = method;
    }
    async convert(t: T): Promise<string> {
        if (t) {
            return `${this.method},${JSON.stringify(t)}`;
        }
        return `${this.method},`;
    }
}

class WsJsonDecoder<T extends {}> implements Converter<string, T> {
    // decode once
    // then decode content
    async convert(t: string): Promise<T> {
        return JSON.parse(t);
    }
}

interface WsLink<R> {
    doOnMessage(r: R): Promise<void>;
}

// TODO: extract base functions to abstract class
// like http handling
export class JsonWsLink<T extends {}, R extends {}> extends AbstractLink<T, R, any, any> implements WsLink<R> {
    public readonly method: string;
    protected encoder: Converter<T, any>;
    protected wsApi: WsLinker<any, any>;

    constructor(wsApi: WsLinker<any, any>, method: string) {
        super();
        this.method = method;
        this.wsApi = wsApi;
        this.encoder = new WsJsonEncoder(this.method);
    }

    // todo, should add real now
    protected decoder: Converter<any, R> = new WsJsonDecoder();

    async doOnMessage(r: R) {
        const b = await this.decoder.convert(r);
        Object.keys(this.handles).forEach(k => {
            this.handles[k](b);
        });
    }

    available(): boolean {
        return this.wsApi.available();
    }

    async query(t: T): Promise<undefined> {
        this.wsApi.query(await this.encoder.convert(t));
        return undefined;
    }
}

// TODO: rename
const wsLinker = new WsLinker(getWs());

// should change the way it's registered
export const newMessageHandle = new JsonWsLink<{ chatId: string, body: any }, RawSignal & { chatId?: string }>(wsLinker, "newMessage");
// should change the way it's registered
wsLinker.registerHandle("newMessage", newMessageHandle);

// const notificationHolder = new NotificationHolder(api, {
//     'newMessage': new JsonHandle<RawSignal & { chatId: string }>(),
// });

// export default notificationHolder;
const l = new PostMultipartHttpLink<{ chatId: string, body: any }, RawSignal[]>(httpApi, "/chat/{chatId}", ({ chatId, body }) => ({ path: { chatId }, body }));
export const newMessageHandleMulti = new MultiLink([newMessageHandle]);


/**
 * Multi -> bridge -> link -> handle
 */
