// TODO: check how zod implements type inference

type FragmentProducer<T> = <Name extends string>(name: Name) => UrlFragment<Name, T>;


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

abstract class VariableUrlFragment<Name extends string, T> extends UrlFragment<Name, T> {

}


class StringUrlFragment<Name extends string> extends VariableUrlFragment<Name, string> {
    getValue(x: string) {
        return x;
    }
}

class NumberUrlFragment<Name extends string> extends VariableUrlFragment<Name, number> {
    getValue(x: number) {
        return `${x}`;
    }
}



class DateUrlFragment<Name extends string> extends VariableUrlFragment<Name, Date> {
    getValue(x: Date) {
        return x.toISOString();
    }
}

type ExtractName<T> = T extends UrlFragment<infer X, infer U> ? X : never;
type ExtractValue<T> = T extends UrlFragment<infer X, infer U> ? U : never;
// type ExtractBoth<T> = T extends VariableUrlFragment<infer Name extends string, infer U> ? { [Name]: U } : never;
type ExtractBoth<T> = T extends VariableUrlFragment<infer Name extends string, infer U> ? { [key in Name]: U } : never;

type FilterVoid<T> = T extends VariableUrlFragment<infer Name extends string, infer U>
    ? (U extends void ? never : VariableUrlFragment<Name, U>)
    : never;

type UnionToIntersection<T> =
    (T extends any ? (x: T) => any : never) extends
    (x: infer R) => any ? R : never

// type FragmentsParams<Params extends readonly UrlFragment<string, any>[]> = {
//     [k in ExtractBoth<Params[number]>["name"]]: ExtractBoth<Params[number]>
// };

type t<Params extends readonly UrlFragment<string, any>[]> = FilterVoid<Params[number]>;


type FragmentsParams<Params extends readonly UrlFragment<string, any>[]> = UnionToIntersection<ExtractBoth<FilterVoid<Params[number]>>>;


// type e<Params extends readonly UrlFragment<string, any>[]> = ExtractBoth<Params[number]>["name"];

const params = [new ConstUrlFragment("chatId"), new StringUrlFragment("signalId")];

type Test = t<typeof params>;

export class UrlTemplate<Params extends readonly UrlFragment<string, any>[]> {
    // fragments: FragmentsParams<Params> 
    // "/chat/{chatId}/cursor/{signalId}"
    // [Fragment("chat"), Fragment("chatId", param=true), Fragment("cursor"), Fragment("signalId", param=true)]
    constructor(readonly fragments: Params) {
        this.fragments = fragments;
    }

    /**
     * Not implemented for now
     * @param params 
     * @returns 
     */
    render(params: FragmentsParams<Params>): string {
        return "";
    }
}

type ObjectKeys<T> =
    T extends object ? (keyof T)[] :
    T extends number ? [] :
    T extends Array<any> | string ? string[] :
    never;


class Builder<Renderers extends { [key: string]: FragmentProducer<any> }> {

    constructor(readonly renderers: Renderers) {
        this.renderers = renderers;
        // const res = this.makeProducers(renderers);
    }

    root<R extends string>(base: R) {
        const b = [new ConstUrlFragment(base)] as const;
        return this.path(this, b);
    }

    protected path<T extends readonly UrlFragment<string, any>[]>(self: typeof this, fragments: T) {
        // utilise les fragments intermediaires qui ont été créés
        // const build = <T extends UrlFragment<string, any>[]>() => {
        //     return new UrlTemplate<T>(fragments);
        // }
        // il faut créer ça dynamiquement depuis une liste de renderer
        // const self = this;
        const base = {
            // default items
            $$get: () => fragments,
            build: function () {
                return new UrlTemplate(this.$$get());
            },

            // default renderer
            string: function <Name extends string>(name: Name) {
                const frags = this.$$get();
                const newFragments = [...frags, new StringUrlFragment(name)] as const;
                return self.path(self, newFragments);
            },
            // default renderer
            const: function <Name extends string>(name: Name) {
                const frags = this.$$get();
                const newFragments = [...frags, new ConstUrlFragment(name)] as const;
                return self.path(self, newFragments);
            },
        };

        return {
            // il faut les wrappers pour qu'ils renvoient "this", cet objet pour les utiliser en mode "fluid"
            // rest of renderers
            ...base,
            number: function <Name extends string>(name: Name) {
                const frags = this.$$get();
                const newFragments = [...frags, new NumberUrlFragment(name)] as const;
                return self.path(self, newFragments);
            },
        } as const
    }
}

class ExtendedBuilder extends Builder<any> {
    root<R extends string>(base: R) {
        const b = [new ConstUrlFragment(base)] as const;
        return this.path(this, b);
    }
    protected path<T extends readonly UrlFragment<string, any>[]>(self: typeof this, fragments: T) {
        const a = super.path(this, fragments);
        // const self = this;
        return {
            ...a,
            date: function <Name extends string>(name: Name) {
                const frags = this.$$get();
                const newFragments = [...frags, new DateUrlFragment(name)] as const;
                return self.path(self, newFragments);
            },
        } as const
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

const stringRenderer = <Name extends string>(name: Name) => new StringUrlFragment(name);

const b = new ExtendedBuilder({
    string: stringRenderer
});

const template = b.root("/api").date("e")
    .const("/chat")
    .string("chatId")
    .const("cursor")
    .string("signalId")
    .number("test")
    .build();

console.log(template);

const result = template.render({
    signalId: "",
    chatId: "",
    test: 1,
    e: new Date(),
});
