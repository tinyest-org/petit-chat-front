export function isString(x: unknown): x is string {
    return typeof x === "string";
}

export function isFile(x: unknown): x is File {
    return x instanceof File;
}