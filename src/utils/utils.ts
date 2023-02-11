import { ID } from "../store/common/type";

export function distinct<T, U>(a: T[], getter: (item: T) => U) {
    const set = new Set<U>();
    return a.filter(item => {
        const t = getter(item);
        if (set.has(t)) {
            return false;
        } else {
            set.add(t);
            return true;
        }
    });
}


export function parseId(s: string) {
    return s as ID;
}

// // https://github.com/sindresorhus/type-fest/pull/262/files

// type IsParameter<Part> = Part extends `{${infer ParamName}}` ? ParamName : never;
// type FilteredParts<Path> = Path extends `${infer PartA}/${infer PartB}`
//   ? IsParameter<PartA> | FilteredParts<PartB>
//   : IsParameter<Path>;
// type ParamValue<Key> = Key extends `...${infer Anything}` ? string[] : number;
// type RemovePrefixDots<Key> = Key extends `...${infer Name}` ? Name : Key;
// type Params<Path> = {
//   [Key in FilteredParts<Path> as RemovePrefixDots<Key>]: ParamValue<Key>;
// };
// type CallbackFn<Path> = (req: { params: Params<Path> }) => void;

// function get<Path extends string>(path: Path, callback: CallbackFn<Path>) {
// 	// TODO: implement
// }
// get("/chat/{chatId}/{signalId}/reaction/{value}", (e)=>{
//     e.params.chatId
// });
