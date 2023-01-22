import { FetchOptions, HttpAPI, HTTPRequestError, Method } from "../http/apiUtils";
import { httpApi } from "../httpApi";

export interface Link<T extends {}, R> {
    available(): boolean;
    query(t: T): Promise<R | undefined>;
    onMessage(name: string, f: (msg: R) => void): void;
}

export interface Converter<T, R> {
    convert(t: T): Promise<R>;
}

/**
 * @param R input of function 
 * @param R return of function 
 * @param I input of endpoint 
 * @param O output of endpoint 
 */
export abstract class AbstractLink<
    T extends {},
    R,
    I,
    O
> implements Link<T, R> {
    abstract available(): boolean;
    abstract query(t: T): Promise<R | undefined>;
    protected abstract encoder: Converter<T, I>;
    protected abstract decoder: Converter<O, R>;

    protected handles: { [name: string]: (msg: R) => void } = {};

    onMessage(name: string, f: (msg: R) => void) {
        this.handles[name] = f;
    }
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

    onMessage(name: string, f: (response: R) => void): void {
        this.subLinks.forEach(s => {
            // TODO: R
            // @ts-ignore
            s.onMessage(name, f);
        });
    }
}


// bridge link should be able to implement link, while taking as input as link and transforming it's output to implement another interface
export abstract class BridgeLink<T extends {}, R, FR> implements Link<T, FR> {
    private inputLink: Link<T, R>;

    constructor(inputLink: Link<T, R>) {
        this.inputLink = inputLink;
    }

    async query(t: T): Promise<undefined> {
        this.inputLink.query(t);
        return undefined;
    }

    available(): boolean {
        return this.inputLink.available();
    }

    onMessage(name: string, f: (msg: FR) => void): void {
        throw new Error('not implemented');
    }

    abstract bridge(r: R): void;
}