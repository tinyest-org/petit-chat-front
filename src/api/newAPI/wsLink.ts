import { RawSignal } from "../../store/signal/type";
import { httpApi } from "../httpApi";
import { WebsocketConnection } from "../ws/wsUtils";
import { getWs } from "../wsApi";
import { PostMultipartHttpLink } from "./httpLink";
import { AbstractLink, BridgeLink, Converter, Link, MultiLink } from "./link";

type WsRegistrarHolder<T> = { [key in keyof T]: <E extends {}, R extends {}>(name: string) => WsLink<E, R> };

export class WsLinker<
    U,
    H extends WsRegistrarHolder<U>,
    T extends {} = {},
    R = {},
> {
    protected readonly wsAPI: WebsocketConnection;
    protected handles: { [name: string]: WsLink<any, any> } = {};

    protected readonly registrars: H;

    constructor(
        wsAPI: WebsocketConnection,
        registrars: { [key in keyof H]: (linker: WsLinker<any, any>) => HandleWsRegistrar }
    ) {
        this.wsAPI = wsAPI;
        this.registrars = this.buildRegistrars(registrars);
        // ------------------------------
        // Todo: hijack thats not pretty
        // should re implement everything here
        this.wsAPI.onMessage = this.internalOnMessage;
    }


    private buildRegistrars(
        registrars: { [key in keyof H]: (linker: WsLinker<any, any>) => HandleWsRegistrar }
    ): H {
        const res = {} as H;
        for (const key in registrars) {
            const f = registrars[key](this).register;
            // @ts-ignore
            res[key] = f;
        }
        return res;
    }

    get register(): { [key in keyof H]: <E extends {}, R extends {}>(name: string) => WsLink<E, R> } {
        return this.registrars;
    }

    available(): boolean {
        return this.wsAPI.isOpen();
    }

    async query(t: string): Promise<undefined> {
        this.wsAPI.send(t);
        return undefined;
    }

    addHandle<T extends {}, R>(name: string, handle: WsLink<T, R>) {
        this.handles[name] = handle;
        return handle;
    }

    private internalOnMessage = (evt: MessageEvent<string>) => {
        const { data } = evt;
        // TODO: should be first decoder here for the router -> extract the logic
        const { subject, content }: { content: string, subject: string } = JSON.parse(data);
        if (subject) {
            this.handles[subject].doOnMessage(content);
        }
    }
}

/**
 * Encodes the query in order to send json query using  the 
 * {method},{body} format -> makes it easier on the server side 
 * to properly parse args and route the data
 */
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

interface WsLink<T extends {}, R> extends Link<T, R> {
    query(t: T): Promise<undefined>;
    doOnMessage(r: R): Promise<void>;
}


// TODO: extract base functions to abstract class
// like http handling
export class JsonWsLink<T extends {}, R extends {}> extends AbstractLink<T, R, any, any> implements WsLink<T, R> {
    public readonly method: string;
    protected encoder: Converter<T, any>;
    protected wsApi: WsLinker<any, any>;

    constructor(wsApi: WsLinker<any, any>, method: string, receiveOnly: boolean = false) {
        super(receiveOnly);
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

export class SimpleToArray<T> implements Converter<T, T[]> {
    async convert(t: T): Promise<T[]> {
        return [t];
    }
}

export interface HandleWsRegistrar {
    register<T extends {}, R extends {}>(name: string): WsLink<T, R>;
}

export abstract class AbstractHandleWsRegistrar implements HandleWsRegistrar {
    protected wsLinker: WsLinker<any, any>;

    constructor(wsLinker: WsLinker<any, any>) {
        this.wsLinker = wsLinker;
    }

    protected bind<T extends {}, R extends {}>(name: string): WsLink<T, R> {
        const handle = this.register<T, R>(name);
        this.wsLinker.addHandle(name, handle);
        return handle;
    }


    abstract register<T extends {}, R extends {}>(name: string): WsLink<T, R>;
}

class JsonHandleRegistrar extends AbstractHandleWsRegistrar {
    register<T extends {}, R extends {}>(name: string): WsLink<T, R> {
        return new JsonWsLink<T, R>(this.wsLinker, name);
    }
}


// TODO: rename
const wsLinker = new WsLinker(getWs(), {
    json: (linker: WsLinker<{}, {}>) => new JsonHandleRegistrar(linker),
});

// TODO: add support for schema link
export const newMessageHandle = wsLinker.register.json<{ chatId: string, body: any }, RawSignal & { chatId: string }>('newMessage');


const l = new PostMultipartHttpLink<{ chatId: string, body: any }, (RawSignal & { chatId?: string })[]>(httpApi, "/chat/{chatId}", ({ chatId, body }) => ({ path: { chatId }, body }));

const bridged = new BridgeLink(newMessageHandle, new SimpleToArray());

export const newMessageHandleMulti = new MultiLink([bridged, l]);


/**                     R        FR
 * Multi -> bridge -> link -> handle
 */
