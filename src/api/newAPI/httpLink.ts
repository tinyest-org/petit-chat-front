import { FetchOptions, HttpAPI, Method } from "../http/apiUtils";
import { HTTPRequestError } from "../httpApi";
import { AbstractLink, Converter } from "./link";

type ParamExtractor<T> = (t: T) => HttpParams;

const format = (string: string, args: { [k: string]: any }) => {
    for (const key in args) {
        string = string.replace(new RegExp(`{${key}}`, 'g'), args[key]);
    }
    return string;
};


function isString(x: unknown): x is string {
    return typeof x === "string";
}

function isFile(x: unknown): x is File {
    return x instanceof File;
}

type HttpParams = {
    query?: { [key: string]: any },
    path?: { [key: string]: string | number },
    body?: any,
    headers?: { [key: string]: string },
    options?: FetchOptions,
}

export abstract class BaseHttpLink<T extends {}, R> extends AbstractLink<T, R> {
    protected readonly api: HttpAPI;
    public readonly url: string;

    protected abstract encoder: Converter<T, HttpParams>;
    protected abstract decoder: Converter<{ response: Response, query: T }, R>;

    protected readonly paramExtractor: ParamExtractor<T>;
    readonly abstract method: Method;

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

class JsonDecoder<R, Q = any> implements Converter<{ response: Response, query: any }, R> {
    async convert({ response }: { response: Response, query: Q }): Promise<R> {
        const text = await response.text();

        if (response.status >= 400) {
            throw new HTTPRequestError(response.status, text); // todo better handle error
        }

        // handle empty case
        if (response.headers.get("content-length") === "0"
            || response.status === 204
            || text.length == 0
        ) {
            return null as unknown as R;
        }
        return JSON.parse(text);
    }
}

class BlobDecoder implements Converter<{ response: Response, query: any }, Blob> {
    async convert({ response }: { response: Response, query: any }): Promise<Blob> {
        if (response.status >= 400) {
            throw new HTTPRequestError(response.status, await response.text()); // todo better handle error
        }
        return response.blob();
    }
}

class JsonQueryEncoder<T> implements Converter<T, HttpParams> {
    protected readonly paramExtractor: ParamExtractor<T>;
    constructor(paramExtractor: ParamExtractor<T>) {
        this.paramExtractor = paramExtractor;
    }

    async convert(t: T): Promise<HttpParams> {
        const { query, path, body } = this.paramExtractor(t);
        const headers = {
            "Content-Type": "application/json",
            "Accept": "text/plain, application/json",
        }
        return { query, path, body: JSON.stringify(body), headers };
    }
}

class MultipartQueryEncoder<T> implements Converter<T, HttpParams> {
    protected readonly paramExtractor: ParamExtractor<T>;
    constructor(paramExtractor: ParamExtractor<T>) {
        this.paramExtractor = paramExtractor;
    }

    async convert(t: T): Promise<HttpParams> {
        const { query, path, body } = this.paramExtractor(t);
        const form = new FormData();
        // TODO: finish handle files
        Object.keys(body).forEach(k => {
            const v = body[k];
            if (isFile(v) || isString(v)) {
                form.append(k, v);
            }
        });
        return { query, path, body: form };
    }
}

abstract class JsonResponseHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
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
    method: Method = "POST";
}

export class PutBooleanHttpLink<T extends {}> extends BooleanHttpLink<T> {
    method: Method = "PUT";
}


abstract class JsonResponseMultiPartHttpLink<T extends {}, R> extends BaseHttpLink<T, R> {
    protected decoder = new JsonDecoder<R>(); // could be added in constructor too
    protected encoder = new MultipartQueryEncoder<T>(this.paramExtractor);
}

// those are json links -> should make it clear
// TODO: add support for protobuf link
export class GetJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    method: Method = "GET";
}

export class PostJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    method: Method = "POST";
}
export class PostMultipartHttpLink<T extends {}, R> extends JsonResponseMultiPartHttpLink<T, R> {
    method: Method = "POST";
}

export class PutJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    method: Method = "PUT";
}
export class PatchJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    method: Method = "PATCH";
}
export class DeleteJsonHttpLink<T extends {}, R> extends JsonResponseHttpLink<T, R> {
    method: Method = "DELETE";
}

