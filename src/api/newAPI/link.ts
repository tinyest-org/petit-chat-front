import { ID } from "../../store/common/type";
import { RawSignal } from "../../store/signal/type";
import { HttpAPI } from "../http/apiUtils";
import { httpApi } from "../httpApi";

export interface Link<T extends {}, R> {
    available(): boolean;
    query(t: T): Promise<R | undefined>;
}

export class MultiLink<T extends {}, R> implements Link<T, R> {
    private subLinks: Link<T, R | undefined>[];

    constructor(subLinks: Link<T, R | undefined>[]) {
        this.subLinks = subLinks;
    }

    available() {
        return this.subLinks.some(e => e.available());
    }

    async query(t: T): Promise<R | undefined> {
        const link = this.subLinks.find(e => e.available());
        const res = await link?.query(t);
        if (res) {
            return res;
        }
        return undefined;
    }
}

type ParamExtractor<T> = (t: T) => {
    query?: { [key: string]: any } | undefined,
    path?: { [key: string]: any } | undefined,
    body?: { [key: string]: any } | undefined,
}

const format = (string: string, args: { [k: string]: any }) => {
    for (const key in args) {
        const string_key = '{' + key + '}';
        string = string.replace(new RegExp(string_key, 'g'), args[key]);
    }
    return string;
};


export abstract class BaseHttpLink<T extends {}, R> implements Link<T, R> {
    protected readonly api: HttpAPI;
    public readonly url: string;

    protected readonly paramExtractor: ParamExtractor<T>;

    constructor(api: HttpAPI, url: string, paramExtractor: ParamExtractor<T>) {
        this.api = api;
        this.url = url;
        this.paramExtractor = paramExtractor;
    }
    /**
     * Formats path using {} notation and adds query params
     * @param props 
     * @returns 
     */
    protected formatUrl({ path, query }: { query?: { [key: string]: any }, path?: { [key: string]: any } }): string {
        return format(this.url, { ...path });
    }

    available() {
        return this.api.securityProvider.isAuthenticated();
    }

    abstract query(t: T): Promise<R | undefined>;
    protected abstract resultExtractor(r: Response): Promise<R | undefined>;
}

abstract class JsonHtppLink<T extends {}, R> extends BaseHttpLink<T, R> {
    protected async resultExtractor(r: Response): Promise<R | undefined> {
        return JSON.parse(await r.text());
    }
}

// those are json links -> should make it clear
// TODO: add support for protobuf link
export class GetJsonHttpLink<T extends {}, R> extends JsonHtppLink<T, R> {
    async query(t: T): Promise<R | undefined> {
        const { path, query } = this.paramExtractor(t);
        const res = await this.api.rawHttpQuery<R>(this.formatUrl({ path, query }), "GET", undefined);
        return this.resultExtractor(res);
    }
}

export class PostJsonHttpLink<T extends {}, R> extends JsonHtppLink<T, R> {
    query(t: T): Promise<R> {
        const { body, path, query } = this.paramExtractor(t);
        return this.api.post<R>(this.formatUrl({ path, query }), body);
    }
}
export class PutJsonHttpLink<T extends {}, R> extends JsonHtppLink<T, R> {
    query(t: T): Promise<R> {
        const { body, path, query } = this.paramExtractor(t);
        return this.api.put<R>(this.formatUrl({ path, query }), body);
    }
}
export class PatchJsonHttpLink<T extends {}, R> extends JsonHtppLink<T, R> {
    query(t: T): Promise<R> {
        const { body, path, query } = this.paramExtractor(t);
        return this.api.patch<R>(this.formatUrl({ path, query }), body);
    }
}
export class DeleteJsonHttpLink<T extends {}, R> extends JsonHtppLink<T, R> {
    query(t: T): Promise<R> {
        const { path, query } = this.paramExtractor(t);
        return this.api.del<R>(this.formatUrl({ path, query }));
    }
}

function makeGet<T extends {}, R>(url: string, paramExtractor: ParamExtractor<T>) {
    const httpGet = new GetJsonHttpLink<T, R>(httpApi, url, paramExtractor);
    return httpGet;
}

const httpGetChat = makeGet<{ chatId: ID }, RawSignal[]>('/chat/{chatId}/signals', ({ chatId }) => ({ path: { chatId } }));
const wsGetChat: Link<{ chatId: ID }, undefined> = null as any;
// will use ws first and then fallback to http if not available
export const getChat = new MultiLink([wsGetChat, httpGetChat]);
getChat.query({ chatId: 'dev' }).then(resp => {
    console.log(resp);
})
