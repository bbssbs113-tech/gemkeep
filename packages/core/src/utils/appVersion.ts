export function getAppVersionHeaders(version?: string): Record<string, string> {
    return { 'X-App-Version': version || '0.0.0' };
}

export function trimBuildVersion(version?: string): string {
    return (version || '0.0.0').split('-')[0];
}
