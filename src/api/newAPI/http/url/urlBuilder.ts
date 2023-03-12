// TODO: check if zod implements type inference

interface UrlFragmentRenderer<T> {
    render(t: T): string;
}

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

// type TypeWithGeneric<T> = T[]
// type extractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never

// type extracted = extractGeneric<TypeWithGeneric<number>>

type ExtractName<T> = T extends UrlFragment<infer X, infer U> ? X : never;
type ExtractValue<T> = T extends UrlFragment<infer X, infer U> ? U : never;
type ExtractBoth<T> = T extends UrlFragment<infer X, infer U> ? { name: X, type: U } : never;

type FragmentsParams<Params extends UrlFragment<string, any>[]> = ExtractBoth<Params[number]>;

const params = [new ConstUrlFragment("chatId"), new StringUrlFragment("signalId")];

type Test = FragmentsParams<typeof params>;

export class UrlTemplate<Params extends UrlFragment<string, any>[]> {
    fragments: FragmentsParams<Params>
    // "/chat/{chatId}/cursor/{signalId}"
    // [Fragment("chat"), Fragment("chatId", param=true), Fragment("cursor"), Fragment("signalId", param=true)]
    constructor(fragments: Params) {
        // this.fragments = fragments;
    }

    render(params: Params) {

    }
}

class Builder<Renderers> {

    // renderers: UrlFragmentRenderer[] = [];

    constructor() {

    }


    root<R extends string>(base: R) {
        let fragments = [new ConstUrlFragment(base)];
        // utilise les fragments intermediaires qui ont été créés
        // const build = <T extends UrlFragment<string, any>[]>() => {
        //     return new UrlTemplate<T>(fragments);
        // }
        const keys = {};

        return {
            // il faut les wrappers pour qu'ils renvoient "this", cet objet pour les utiliser en mode "fluid"
            // rest of renderers
            const: function (name: string) {
                // fragments.push(new ConstUrlFragment(name));
                fragments = [...fragments, new ConstUrlFragment(name)]
                // keys[name] = 
                return this;
            },
            string: function (name: string) {
                fragments.push(new StringUrlFragment(name));
                return this;
            },
            get: () => {
                const f = [...fragments] as const;
                return { fragments: f, keys };
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
    .get();