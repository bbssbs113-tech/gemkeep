import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Language } from '@tonkeeper/core/dist/entries/language';

const LANG_STORAGE_KEY = 'gemkeep_user_language';

export const useUserLanguage = () => {
    return useQuery<Language>(['user-language'], async () => {
        const saved = localStorage.getItem(LANG_STORAGE_KEY);
        if (saved !== null) {
            const parsed = Number(saved);
            if (!isNaN(parsed)) return parsed as Language;
        }
        return Language.EN;
    });
};

export const useMutateUserLanguage = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (newLang: Language) => {
            localStorage.setItem(LANG_STORAGE_KEY, newLang.toString());
            return newLang;
        },
        {
            onSuccess: newLang => {
                queryClient.setQueryData(['user-language'], newLang);
                queryClient.invalidateQueries(['user-language']);
            }
        }
    );
};
