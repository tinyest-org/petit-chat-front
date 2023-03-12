import { Converter } from "../link";
import { HttpParams, ParamExtractor } from "./httpLink";
import { isFile, isString } from "./utils";

export class MultipartQueryEncoder<T> implements Converter<T, HttpParams> {
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

export class JsonQueryEncoder<T> implements Converter<T, HttpParams> {
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
