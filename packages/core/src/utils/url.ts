export function removeLastSlash(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function originFromUrl(url: string): string {
    try {
        return new URL(url).origin;
    } catch {
        return url;
    }
}

export function eqOrigins(a: string, b: string): boolean {
    return originFromUrl(a) === originFromUrl(b);
}
