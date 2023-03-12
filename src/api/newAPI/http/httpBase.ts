import { HttpAPI, Method } from "../../http/apiUtils";
import { httpApi } from "../../httpApi";
import { BaseHttpLink, DeleteJsonHttpLink, GetJsonHttpLink, JsonResponseHttpLink, ParamExtractor, PatchJsonHttpLink, PostJsonHttpLink, PutJsonHttpLink } from "./httpLink";

/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
@category Class
*/
export type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

export abstract class HandleHttpRegistrar<S extends RegistrarProps<any> = RegistrarProps<any>> {
    protected abstract register<T extends {}, R extends {}>(props: S): BaseHttpLink<T, R>;
}

// should add support for more settings
export abstract class AbstractHttpHandleRegistrar<S extends RegistrarProps<any>> extends HandleHttpRegistrar<S> {
    protected httpLinker: HttpLinker<any>;

    constructor(httpLinker: HttpLinker<any>) {
        super();
        this.httpLinker = httpLinker;
    }

    public readonly get = <T extends {}, R extends {}>(props: Omit<S, "method">): BaseHttpLink<T, R> => {
        // TODO: fix me
        // @ts-ignore
        const handle = this.register<T, R>({ ...props, method: "GET" });
        return handle;
    }

    protected abstract register<T extends {}, R extends {}>(props: S): BaseHttpLink<T, R>;
}


type RegistrarProps<T> = {
    method: Method,
    url: string,
    paramExtractor: ParamExtractor<T>;
};

const jsonHttpLinks: Record<Method, Constructor<JsonResponseHttpLink<any, any>>> = {
    "GET": GetJsonHttpLink,
    "DELETE": DeleteJsonHttpLink,
    "PATCH": PatchJsonHttpLink,
    "POST": PostJsonHttpLink,
    "PUT": PutJsonHttpLink,
}

class JsonHandleRegistrar extends AbstractHttpHandleRegistrar<RegistrarProps<any>> {
    protected register<T extends {}, R extends {}>({ method, url, paramExtractor }: RegistrarProps<T>): BaseHttpLink<T, R> {
        const c = jsonHttpLinks[method];
        return new c(this.httpLinker.api, url, paramExtractor);
    }
}


const registrars = {
    json: (linker: HttpLinker<{}>) => new JsonHandleRegistrar(linker),
};
// export class WsLinker<
//     H extends { [k: string]: HandleWsRegistrar },
// > {
//     protected readonly wsAPI: WebsocketConnection;
//     protected handles: { [name: string]: WsLink<any, any> } = {};

//     protected readonly registrars: H;

export class HttpLinker<H extends { [k: string]: HandleHttpRegistrar },> {
    public readonly api: HttpAPI;
    protected readonly registrars: H;

    constructor(
        api: HttpAPI,
        registrars: { [key in keyof H]: (linker: HttpLinker<any>) => HandleHttpRegistrar }
    ) {
        this.api = api;
        this.registrars = this.buildRegistrars(registrars) as any;
    }

    private buildRegistrars(
        registrars: { [key in keyof H]: (linker: HttpLinker<any>) => HandleHttpRegistrar<any> }
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
}

export const httpLinker = new HttpLinker<{ json: JsonHandleRegistrar }>(httpApi, registrars);