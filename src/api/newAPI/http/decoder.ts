import { HTTPRequestError } from "../../httpApi";
import { Converter } from "../link";

export class JsonDecoder<R, Q = any> implements Converter<{ response: Response, query: any }, R> {
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

export class BlobDecoder implements Converter<{ response: Response, query: any }, Blob> {
    async convert({ response }: { response: Response, query: any }): Promise<Blob> {
        if (response.status >= 400) {
            throw new HTTPRequestError(response.status, await response.text()); // todo better handle error
        }
        return response.blob();
    }
}
