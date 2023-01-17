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