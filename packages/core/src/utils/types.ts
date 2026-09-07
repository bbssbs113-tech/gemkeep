export function assertUnreachable(x: never): never {
    throw new Error('Unreachable code reached');
}

export function notNullish<T>(val: T | null | undefined): val is T {
    return val !== null && val !== undefined;
}

export function assertTypesEqual<A, B>(): void {}
