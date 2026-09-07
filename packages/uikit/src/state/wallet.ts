import { useQuery } from '@tanstack/react-query';

export const useAccountsStateQuery = () => {
    return useQuery(['accounts-state'], async () => []);
};

export const useActiveTonNetwork = () => {
    return -239; // Mainnet
};
