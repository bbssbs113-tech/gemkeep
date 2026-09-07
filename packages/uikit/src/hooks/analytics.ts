import { useCallback } from 'react';

export class Aptabase {
    constructor(options: any) {}

    init(options: any) {}

    track(eventName: string, props?: any) {}
}

export type Analytics = Aptabase;

export const toWalletType = (wallet: any) => wallet?.type || 'standard';

export const useAnalyticsTrack = () => {
    return useCallback((event: any) => {
        // Track event
    }, []);
};
