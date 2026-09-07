import { useQuery } from '@tanstack/react-query';

export const useUserFiatQuery = () => {
    return useQuery(['user-fiat'], async () => 'USD');
};
