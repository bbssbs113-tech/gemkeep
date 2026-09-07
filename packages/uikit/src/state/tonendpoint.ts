import { useQuery } from '@tanstack/react-query';

export const useTonendpoint = (params: any) => {
    return params;
};

export const useTonenpointConfig = (tonendpoint: any) => {
    return useQuery(['tonendpoint-config'], async () => ({
        mainnetConfig: null,
        testnetConfig: null
    }));
};
