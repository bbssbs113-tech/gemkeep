import React, { useContext } from 'react';

export interface I18nContext {
    t: (key: string, options?: any) => string;
    i18n: any;
}

export const TranslationContext = React.createContext<I18nContext>({
    t: (key: string) => key,
    i18n: {}
});

export const useTranslation = () => useContext(TranslationContext);

export const useTWithReplaces = (tFunc: any) => {
    return (key: string, replacements?: Record<string, string>) => {
        let res = tFunc ? tFunc(key) : key;
        if (replacements && typeof res === 'string') {
            Object.entries(replacements).forEach(([k, v]) => {
                res = res.replace(new RegExp(`%{${k}}`, 'g'), v);
            });
        }
        return res;
    };
};
