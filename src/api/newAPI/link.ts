
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
> implements Link<T, R> {
    abstract available(): boolean;
    abstract query(t: T): Promise<R | undefined>;
    protected handles: { [name: string]: (msg: R) => void } = {};
    protected receiveOnly: boolean;

    constructor(receiveOnly: boolean) {
        this.receiveOnly = receiveOnly;
    }

    onMessage(name: string, f: (msg: R) => void) {
        this.handles[name] = f;
    }
}

export class MultiLink<T extends {}, R> implements Link<T, R> {
    private subLinks: Link<T, R | undefined>[];

    protected constructor(subLinks: Link<T, R | undefined>[]) {
        this.subLinks = subLinks;
    }

    static of<T extends {}, R>(subLinks: Link<T, R | undefined>[]) {
        return new MultiLink(subLinks);
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


// TODO: create syntax to do:
// brige.from(link).using(converter)
// bridge link should be able to implement link, while taking as input as link and transforming it's output to implement another interface
export class BridgeLink<T extends {}, R, FR> implements Link<T, FR> {
    private inputLink: Link<T, R>;
    private converter: Converter<R ,FR>;

    constructor(inputLink: Link<T, R>, converter: Converter<R ,FR>) {
        this.inputLink = inputLink;
        this.converter = converter;
    }

    async query(t: T): Promise<undefined> {
        this.inputLink.query(t);
        return undefined;
    }

    available(): boolean {
        return this.inputLink.available();
    }

    onMessage(name: string, f: (msg: FR) => void): void {
        const w = async(r: R)  => {
            const c = await this.converter.convert(r);
            f(c);
        }
        this.inputLink.onMessage(name, w);
    }
}

/**
 * Makes usage of BridgeLink cleaner
 */
class Bridger {
    from<T extends {}, R, FR>(inputLink: Link<T, R>) {
        const b = (converter: Converter<R ,FR>) => {
            return new BridgeLink(inputLink, converter);
        }
        return {using: b};
    }
}   


export const bridge = new Bridger();