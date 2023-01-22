import { FetchOptions, HttpAPI, Method } from "../http/apiUtils";
import { HTTPRequestError, httpApi } from "../httpApi";
import { AbstractLink, Converter } from "./link";

type ParamExtractor<T> = (t: T) => HttpParams;

const format = (string: string, args: { [k: string]: any }) => {
    for (const key in args) {
        const string_key = '{' + key + '}';
        string = string.replace(new RegExp(string_key, 'g'), args[key]);
    }
    return string;
};


type HttpParams = {
    query?: { [key: string]: any },
    path?: { [key: string]: any },
    body?: any,
    headers?: { [key: string]: string },
    options?: FetchOptions,
}

export abstract class BaseHttpLink<T extends {}, R> extends AbstractLink<T, R, HttpParams, Response> {
    protected readonly api: HttpAPI;
    public readonly url: string;

    protected readonly paramExtractor: ParamExtractor<T>;
    abstract method: Method;

    constructor(api: HttpAPI, url: string, paramExtractor: ParamExtractor<T>) {
        super();
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

        if (res.status >= 400) {
            try {
                if (res.status === 401) {
                    this.api.securityProvider.login();
                } else {
                    throw new HTTPRequestError(res.status, await res.json()); // todo better handle error
                }
            } catch {
                throw new HTTPRequestError(res.status, "Unknown error");
            }
        }
        const finalReponse = await this.decoder.convert(res);
        // move to base class ?
        Object.keys(this.handles).forEach(k => {
            this.handles[k](finalReponse);
        })
        return finalReponse;
    }
}

class JsonDecoder<R> implements Converter<Response, R> {
    async convert(response: Response): Promise<R> {
        const text = await response.text();
        // handle empty case
        if (response.headers.get("content-length") === "0" || response.status === 204 || text.length == 0) {
            return null as unknown as R;
        }
        return JSON.parse(text);
    }
}

export class BlobDecoder implements Converter<Response, Blob> {
    convert(t: Response): Promise<Blob> {
        return t.blob();
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
            if (typeof v === "string") {
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

function makeGet<T extends {}, R>(url: string, paramExtractor: ParamExtractor<T>) {
    const httpGet = new GetJsonHttpLink<T, R>(httpApi, url, paramExtractor);
    return httpGet;
}

// example
// const httpGetChat = makeGet<{ chatId: ID }, RawSignal[]>('/chat/{chatId}/signals', ({ chatId }) => ({ path: { chatId } }));
// const wsGetChat: Link<{ chatId: ID }, undefined> = null as any;
// // will use ws first and then fallback to http if not available
// export const getChat = new MultiLink([wsGetChat, httpGetChat]);
