// TODO: check if zod implements type inference

interface UrlFragmentRenderer<T> {
    render(t: T): string;
}

abstract class UrlFragment {
    private _value: string;
    private renderer: UrlFragmentRenderer;

    constructor(_value: string) {
        this._value = _value;
    }
    get value() {
        return this._value;
    }
}

class ConstUrlFragment {
    constructor(value: string) {

    }
}

export class UrlTemplate<Params> {
    // "/chat/{chatId}/cursor/{signalId}"
    // [Fragment("chat"), Fragment("chatId", param=true), Fragment("cursor"), Fragment("signalId", param=true)]
    constructor() {

    }

    render(params: Params) {

    }
}

class Builder<Renderers> {

    renderers: UrlFragmentRenderer[] = [];

    constructor() {

    }


    root(base: string) {
        const fragments: UrlFragment[] = [];
        // utilise les fragments intermediaires qui ont été créés
        const build = (): UrlTemplate<unknown> => {
            return new UrlTemplate();
        }

        return {
            // il faut les wrappers pour qu'ils renvoient "this", cet objet pour les utiliser en mode "fluid"
            // rest of renderers
            build,
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