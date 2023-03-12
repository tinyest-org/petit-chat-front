import { RawSignal } from "../../../store/signal/type";
import { httpApi } from "../../httpApi";
import { WebsocketConnection } from "../../ws/wsUtils";
import { getWs } from "../../wsApi";
import { PostMultipartHttpLink } from "../http/httpLink";
import { AbstractLink, bridge, BridgeLink, Converter, Link, MultiLink } from "../link";
import { WsJsonDecoder } from "./decoder";
import { WsJsonEncoder } from "./encoder";

type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

interface BaseRegistrar {
    name: string;
}

type WsRegistrarHolder<T extends { [k: string]: HandleWsRegistrar }> = {
    [key in keyof T]: T[key] extends HandleWsRegistrar<infer U> ? HandleWsRegistrar<U> : never;
};

export type SchemaType = {
    [repoName: string]: any;
};

export class WsLinker<
    H extends { [k: string]: HandleWsRegistrar },
> {
    protected readonly wsAPI: WebsocketConnection;
    protected handles: { [name: string]: WsLink<any, any> } = {};

    protected readonly registrars: H;

    constructor(
        wsAPI: WebsocketConnection,
        registrars: { [key in keyof H]: (linker: WsLinker<any>) => HandleWsRegistrar }
    ) {
        this.wsAPI = wsAPI;
        this.registrars = this.buildRegistrars(registrars) as any;

        // ------------------------------
        // TODO: hijack thats not pretty
        // should re implement everything here
        this.wsAPI.onMessage = this.internalOnMessage;
    }


    private buildRegistrars(
        registrars: { [key in keyof H]: (linker: WsLinker<any>) => HandleWsRegistrar<any> }
    ): H {
        const res = {} as H;
        for (const key in registrars) {
            const f = registrars[key](this);
            // @ts-ignore
            res[key] = f;
        }
        return res;
    }

    // false, extract params
    get register(): { [key in keyof H]: H[key] } {
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
        console.log(subject, this.handles);
        if (subject) {
            this.handles[subject].doOnMessage(content);
        }
    }
}

interface WsLink<T extends {}, R> extends Link<T, R> {
    query(t: T): Promise<undefined>;
    doOnMessage(r: R): Promise<void>;
}


// TODO: extract base functions to abstract class
// like http handling
export abstract class BaseWsLink<T extends {}, R extends {}> extends AbstractLink<T, R> implements WsLink<T, R> {
    public readonly method: string;
    protected wsApi: WsLinker<any>;
    
    protected abstract encoder: Converter<T, any>;
    protected abstract decoder: Converter<any, R>;

    constructor(wsApi: WsLinker<any>, method: string, receiveOnly: boolean = false) {
        super(receiveOnly);
        this.method = method;
        this.wsApi = wsApi;
    }

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

export class JsonWsLink<T extends {}, R extends {}> extends BaseWsLink<T, R> {
    protected decoder: Converter<any, R> = new WsJsonDecoder();
    protected encoder = new WsJsonEncoder(this.method);
}



export abstract class HandleWsRegistrar<S extends { name: string } = { name: string }> {
    protected abstract register<T extends {}, R extends {}>(props: S): WsLink<T, R>;
}

// should add support for more settings
export abstract class AbstractWsHandleRegistrar<S extends { name: string }> extends HandleWsRegistrar<S> {
    protected wsLinker: WsLinker<any>;

    constructor(wsLinker: WsLinker<any>) {
        super();
        this.wsLinker = wsLinker;
    }

    public readonly bind = <T extends {}, R extends {}>(props: S): WsLink<T, R> => {
        const handle = this.register<T, R>(props);
        this.wsLinker.addHandle(props.name, handle);
        return handle;
    }


    protected abstract register<T extends {}, R extends {}>(props: S): WsLink<T, R>;
}


/**
 * deb only present for tests
 */
class JsonHandleRegistrar extends AbstractWsHandleRegistrar<{
    name: string,
    /**
     * Only for tests with overide api
     */
    receiveOnly: boolean
}> {
    protected register<T extends {}, R extends {}>(props: { name: string, receiveOnly: boolean }): WsLink<T, R> {
        return new JsonWsLink<T, R>(this.wsLinker, props.name, props.receiveOnly);
    }
}


const registrars = {
    json: (linker: WsLinker<{}>) => new JsonHandleRegistrar(linker),
};

const wsCon = getWs();

export const wsLinker = new WsLinker<{ json: JsonHandleRegistrar, }>(wsCon, registrars);


/**                     R        FR
 * Multi -> bridge -> link -> handle
 */
