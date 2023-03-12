import { Converter } from "../link";

export class WsJsonDecoder<T extends {}> implements Converter<string, T> {
    // decode once
    // then decode content
    async convert(t: string): Promise<T> {
        return JSON.parse(t);
    }
}