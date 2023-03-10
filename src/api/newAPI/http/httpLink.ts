import { FetchOptions, HttpAPI, Method } from "../../http/apiUtils";
import { HTTPRequestError } from "../../httpApi";
import { AbstractLink, Converter } from "../link";
import { JsonDecoder } from "./decoder";
import { JsonQueryEncoder, MultipartQueryEncoder } from "./encoder";

export type ParamExtractor<T> = (t: T) => HttpParams;

const format = (string: string, args: { [k: string]: any }) => {
    for (const key in args) {
        string = string.replace(new RegExp(`{${key}}`, 'g'), args[key]);
    }
    return string;
};

export type HttpParams = {
    query?: { [key: string]: any },
    path?: { [key: string]: string | number },
    body?: any,
    headers?: { [key: string]: string },
    options?: FetchOptions,
}

export abstract class BaseHttpLink<T extends {}, R> extends AbstractLink<T, R> {
    protected readonly api: HttpAPI;
    protected readonly url: string;

    protected abstract encoder: Converter<T, HttpParams>;
    protected abstract decoder: Converter<{ response: Response, query: T }, R>;

    protected readonly paramExtractor: ParamExtractor<T>;
    protected readonly abstract method: Method;

    constructor(api: HttpAPI, url: string, paramExtractor: ParamExtractor<T>) {
        super(false);
        this.api = api;
        this.url = url;
        this.paramExtractor = paramExtractor;
    }
    /**
     * TODO: finish
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

    async query(t: T): Promise<R | undefined> {
        const { body, options, query, path, headers: rawHeaders } = await this.encoder.convert(t);

        const headers = new Headers();
        await this.api.securityProvider.prepareHeaders(headers);
        const preparedPath = this.formatUrl({ path, query });

        // should have a cache handler doing this instead
        if (options?.cache) {
            const cached = await this.api.cache.getItem(preparedPath);
            if (cached) {
                headers.append("If-Modified-Since", cached.fetchedAt);
            }
        }
        // should be handle by a header handler
        if (rawHeaders) {
            Object.keys(rawHeaders).forEach(k => {
                headers.append(k, rawHeaders[k]);
            });
        }
        // TODO: remove httpAPI

        const res = await fetch(this.api.baseUrl + preparedPath, {
            method: this.method,
            headers,
            body: body || undefined,
        });

        const finalReponse = await this.decoder.convert({ response: res, query: t });
        // move to base class ?
        Object.keys(this.handles).forEach(k => {
            this.handles[k](finalReponse);
        });
        return finalReponse;
    }
}

export abstract class JsonResponseHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    protected decoder = new JsonDecoder<R>(); // could be added in constructor too
    protected encoder = new JsonQueryEncoder<T>(this.paramExtractor);
}

export function createConverter<T extends {}, R>(convert: (t: T) => Promise<R>): Converter<T, R> {
    return { convert };
}

export function createHttpConverter<
    Q extends {},
    R,
    T extends { response: Response, query: Q } = { response: Response, query: Q }
>(convert: (t: T) => Promise<R>): Converter<T, R> {
    return createConverter(convert);
}

export abstract class BooleanHttpLink<T extends {}> extends BaseHttpLink<T, { query: T, success: boolean }> {
    protected decoder = createHttpConverter<T, { query: T, success: boolean }>(async ({ query, response }) => {
        if (response.status >= 400) {
            return { query, success: false };
        }
        return { query, success: true };
    });
    protected encoder = new JsonQueryEncoder<T>(this.paramExtractor);
}

export class PostBooleanHttpLink<T extends {}> extends BooleanHttpLink<T> {
    protected method: Method = "POST";
}

export class PutBooleanHttpLink<T extends {}> extends BooleanHttpLink<T> {
    protected method: Method = "PUT";
}

export class DeleteBooleanHttpLink<T extends {}> extends BooleanHttpLink<T> {
    protected method: Method = "DELETE";
}


abstract class JsonResponseMultiPartHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    protected decoder = new JsonDecoder<R>(); // could be added in constructor too
    protected encoder = new MultipartQueryEncoder<T>(this.paramExtractor);
}

// those are json links -> should make it clear
export class GetJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    protected method: Method = "GET";
}

export class PostJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    protected method: Method = "POST";
}
export class PostMultipartHttpLink<T extends {}, R> extends JsonResponseMultiPartHttpLink<T, R> {
    protected method: Method = "POST";
}

export class PutJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    protected method: Method = "PUT";
}
export class PatchJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    protected method: Method = "PATCH";
}
export class DeleteJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    protected method: Method = "DELETE";
}

export const jsonHttpLinks = {
    get: GetJsonHttpLink,
    put: PutJsonHttpLink,
    delete: DeleteJsonHttpLink,
    patch: PatchJsonHttpLink,
    post: PostJsonHttpLink,
}

// TODO: add support for protobuf link