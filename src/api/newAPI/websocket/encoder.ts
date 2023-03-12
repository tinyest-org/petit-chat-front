import { Converter } from "../link";

/**
 * Encodes the query in order to send json query using  the 
 * {method},{body} format -> makes it easier on the server side 
 * to properly parse args and route the data
 */
export class WsJsonEncoder<T extends {}> implements Converter<T, string> {
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