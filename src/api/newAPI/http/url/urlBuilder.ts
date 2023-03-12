// TODO: check how zod implements type inference

abstract class UrlFragment<Name extends string, T> {
    protected _name: Name;

    constructor(name: Name) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    abstract getValue(t: T): string;
}

class ConstUrlFragment<Name extends string> extends UrlFragment<Name, void> {
    getValue(x: void) {
        return this._name;
    }
}

class StringUrlFragment<Name extends string> extends UrlFragment<Name, string> {
    getValue(x: string) {
        return x;
    }
}

class NumberUrlFragment<Name extends string> extends UrlFragment<Name, number> {
    getValue(x: number) {
        return `${x}`;
    }
}


type ExtractName<T> = T extends UrlFragment<infer X, infer U> ? X : never;
type ExtractValue<T> = T extends UrlFragment<infer X, infer U> ? U : never;
type ExtractBoth<T> = T extends UrlFragment<infer X, infer U> ? { name: X, type: U } : never;

type FragmentsParams<Params extends readonly UrlFragment<string, any>[]> = ExtractBoth<Params[number]>; // Todo: fix this

const params = [new ConstUrlFragment("chatId"), new StringUrlFragment("signalId")];

type Test = FragmentsParams<typeof params>;

export class UrlTemplate<Params extends readonly UrlFragment<string, any>[]> {
    // fragments: FragmentsParams<Params> 
    // "/chat/{chatId}/cursor/{signalId}"
    // [Fragment("chat"), Fragment("chatId", param=true), Fragment("cursor"), Fragment("signalId", param=true)]
    constructor(readonly fragments: Params) {
        this.fragments = fragments;
    }

    render(params: FragmentsParams<Params>): string {

    }
}

class Builder<Renderers> {

    // renderers: UrlFragmentRenderer[] = [];

    constructor() {

    }

    root<R extends string>(base: R) {
        const b = [new ConstUrlFragment(base)] as const;
        return this.path(b);
    }

    protected path<T extends readonly UrlFragment<string, any>[]>(fragments: T) {
        // utilise les fragments intermediaires qui ont été créés
        // const build = <T extends UrlFragment<string, any>[]>() => {
        //     return new UrlTemplate<T>(fragments);
        // }
        // il faut créer ça dynamiquement depuis une liste de renderer
        return {
            // il faut les wrappers pour qu'ils renvoient "this", cet objet pour les utiliser en mode "fluid"
            // rest of renderers
            const: <Name extends string>(name: Name) => {
                const newFragments = [...fragments, new ConstUrlFragment(name)] as const;
                return this.path(newFragments);
            },
            string: <Name extends string>(name: Name) => {
                const newFragments = [...fragments, new StringUrlFragment(name)] as const;
                return this.path(newFragments);
            },
            get: () => fragments,
            build: () => {
                return new UrlTemplate(fragments);
            }
        }
    }
}

/**
 * 
 * const builder = new Builder([...]) // contient tous les renderers qui nous interessent
 * 
 * template = builder.root("/").string("chatId").const("cursor").string("signalId") -> UrlTemplate
 * template.render({chatId, signalId})
 * 
 * pour créer le builder custom
 * {
 *  string: StringRenderer,
 *  number: NumberRenderer,
 * ...
 * }
 * 
 * 
 * 
 */

const b = new Builder()
const template = b.root("/")
    .string("chatId")
    .const("cursor")
    .string("signalId")
    .build();

template.render({
    chatId: "test",
});
