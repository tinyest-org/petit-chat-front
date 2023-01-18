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

export abstract class BaseHttpLink<T extends {}, R> implements Link<T, R> {
    protected readonly api: HttpAPI;
    public readonly url: string;

    protected readonly paramExtractor: ParamExtractor<T>;

    constructor(api: HttpAPI, url: string, paramExtractor: ParamExtractor<T>) {
        this.api = api;
        this.url = url;
        this.paramExtractor = paramExtractor;
    }

    protected formatUrl(props: { query?: { [key: string]: any }, path?: { [key: string]: any } }): string {
        return '';
    }

    available() {
        return this.api.securityProvider.isAuthenticated();
    }

    abstract query(t: T): Promise<R | undefined>;
}

export class GetHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    query(t: T): Promise<R> {
        return this.api.get<R>(this.formatUrl(this.paramExtractor(t)));
    }
}

export class PostHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    query(t: T): Promise<R> {
        const { body, path, query } = this.paramExtractor(t);
        return this.api.post<R>(this.formatUrl({ path, query }), body);
    }
}
export class PutHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    query(t: T): Promise<R> {
        const { body, path, query } = this.paramExtractor(t);
        return this.api.put<R>(this.formatUrl({ path, query }), body);
    }
}
export class PatchHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    query(t: T): Promise<R> {
        const { body, path, query } = this.paramExtractor(t);
        return this.api.patch<R>(this.formatUrl({ path, query }), body);
    }
}
export class DeleteHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    query(t: T): Promise<R> {
        const { body, path, query } = this.paramExtractor(t);
        return this.api.del<R>(this.formatUrl({ path, query }));
    }
}

const getChat = new GetHttpLink<{ chatId: ID }, RawSignal[]>(httpApi, '/chat/{chatId}/signals', ({ chatId }) => ({ path: { chatId } }));
