type BaseRecord<Name extends string> = { name: Name } & Record<
    string,
    string | number
>;

type RecordName<Rec extends BaseRecord<string>> = Rec extends BaseRecord<
    infer Name
>
    ? Name
    : never;

type ToMapItem<Rec extends BaseRecord<string>> = {
    [key in RecordName<Rec>]: Rec;
};

export class RecordMapBuilder<
    ResultMap extends Record<string, BaseRecord<string>>
    > {
    private map: ResultMap;

    constructor(map: ResultMap) {
        this.map = map;
    }

    addRecord<Name extends string, Rec extends BaseRecord<Name>>(
        record: Rec
    ): RecordMapBuilder<ResultMap & ToMapItem<Rec>> {
        (this.map as any)[record.name] = record;

        return this as RecordMapBuilder<{}> as RecordMapBuilder<
            ResultMap & ToMapItem<Rec>
        >;
    }

    build() {
        return this.map;
    }
}

function makeRecord<Name extends string, Rec extends BaseRecord<Name>>(
    rec: Rec
) {
    return rec;
}

const r1 = makeRecord({
    name: "d",
    foo: 1,
    bar: 2,
    baz: "3",
});

const r2 = {
    name: "e",
    x: 0,
    y: 0,
} as const;

const map = new RecordMapBuilder({})
    .addRecord({
        name: "a",
        numValue: 123,
    })
    .addRecord({
        name: "b",
        stringValue: "abc",
    })
    .addRecord({
        name: "c",
        numValue: 123,
        stringValue: "abc",
    })
    .addRecord(r1)
    .addRecord(r2)
    .build();

console.log(map.a.numValue);

// console.log(map.a.stringValue);

// console.log(map.b.numValue);
console.log(map.b.stringValue);

console.log(map.c.numValue);
console.log(map.c.stringValue);

function createRecordMap<RecordMap extends Record<string, BaseRecord<string>>>(
    builderCallBack: (
        builder: RecordMapBuilder<{}>
    ) => RecordMapBuilder<RecordMap>
) {
    return builderCallBack(new RecordMapBuilder({})).build();
}

const otherMap = createRecordMap((builder) => builder.addRecord(r1).addRecord(r2));


type VariableUrlFragment<Name extends string, U> = {
    name: Name;
    value: U;
  }
  
  // Filtrer les entrées où U est de type void
  type FilterVoid<T> = Pick<
    T,
    { [K in keyof T]: T[K] extends VariableUrlFragment<infer Name extends string, infer U> ? (U extends void ? K : never) : never } [keyof T]
  >;
  
  // Exemple d'utilisation
  type InputType = VariableUrlFragment<"foo", number> | VariableUrlFragment<"bar", string | undefined> | VariableUrlFragment<"baz", void>;
  type OutputType = FilterVoid<InputType>;
  