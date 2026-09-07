import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { Language, localizationText } from '@tonkeeper/core/dist/entries/language';
import { getApiConfig } from '@tonkeeper/core/dist/entries/network';
import { WalletVersion } from '@tonkeeper/core/dist/entries/wallet';
import { defaultTonendpointConfig } from '@tonkeeper/core/dist/tonkeeperApi/tonendpoint';
import { CopyNotification } from '@tonkeeper/uikit/dist/components/CopyNotification';
import { DarkThemeContext, WalletIcon, HistoryIcon, SettingsIcon, TradingIcon } from '@tonkeeper/uikit/dist/components/Icon';
import { GlobalListStyle } from '@tonkeeper/uikit/dist/components/List';
import { Loading } from '@tonkeeper/uikit/dist/components/Loading';
import { AppContext, IAppContext } from '@tonkeeper/uikit/dist/hooks/appContext';
import { AppSdkContext } from '@tonkeeper/uikit/dist/hooks/appSdk';
import { StorageContext } from '@tonkeeper/uikit/dist/hooks/storage';
import {
    I18nContext,
    TranslationContext,
    useTWithReplaces,
    useTranslation as useUikitTranslation
} from '@tonkeeper/uikit/dist/hooks/translation';
import { useUserFiatQuery } from '@tonkeeper/uikit/dist/state/fiat';
import { useUserLanguage } from '@tonkeeper/uikit/dist/state/language';
import { useTonendpoint, useTonenpointConfig } from '@tonkeeper/uikit/dist/state/tonendpoint';
import { useAccountsStateQuery, useActiveTonNetwork } from '@tonkeeper/uikit/dist/state/wallet';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import { GlobalStyle } from '@tonkeeper/uikit/dist/styles/globalStyle';
import { lightTheme } from '@tonkeeper/uikit/dist/styles/lightTheme';

import {
    Home,
    Activity,
    Settings,
    CoinHeader,
    TradingScreen,
    SendNotification,
    ReceiveNotification,
    SwapView,
    GemKeepProvider
} from '@tonkeeper/uikit';

import { initViewport } from '@tma.js/sdk';
import { SDKProvider } from '@tma.js/sdk-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import StandardErrorBoundary from './components/ErrorBoundary';
import { TwaAppSdk } from './libs/appSdk';
import { useStubAnalytics, useTwaAppViewport, useTwaErrorReporting } from './libs/hooks';
import { useHandleBackButton } from './libs/twaHooks';
import { MiniAppClosed } from './stub/MiniAppClosed';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000,
            refetchOnWindowFocus: false
        }
    }
});

const AppLayout = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${props => props.theme.backgroundPage || '#1c2430'};
    color: ${props => props.theme.textPrimary || '#ffffff'};
    box-sizing: border-box;
    padding-bottom: 70px;
`;

const BottomNav = styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: rgba(28, 36, 48, 0.95);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 900;
    max-width: 600px;
    margin: 0 auto;
`;

const NavItem = styled.div<{ $active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    color: ${props => (props.$active ? props.theme.accentBlue || '#0088cc' : props.theme.textSecondary || '#8a95a5')};
    transition: color 0.15s ease;
`;

export const App = () => {
    return (
        <StandardErrorBoundary>
            <SDKProvider>
                <QueryClientProvider client={queryClient}>
                    <GemKeepProvider>
                        <TwaLoader />
                    </GemKeepProvider>
                </QueryClientProvider>
            </SDKProvider>
        </StandardErrorBoundary>
    );
};

const TwaLoader = () => {
    const { data: sdk, error } = useQuery(['sdk'], async () => {
        const [willViewport] = initViewport();
        return new TwaAppSdk(await willViewport);
    });

    useEffect(() => {
        if (!sdk) return;

        if (!sdk.viewport.isExpanded) {
            sdk.viewport.expand();
        }

        const theme = sdk.miniApp.isDark ? defaultTheme : lightTheme;

        if (sdk.miniApp.supports('setBackgroundColor')) {
            sdk.miniApp.setBgColor(theme.backgroundPage);
        }
        if (sdk.miniApp.supports('setHeaderColor')) {
            sdk.miniApp.setHeaderColor(theme.backgroundPage);
        }

        document.body.style.backgroundColor = theme.backgroundPage;
    }, [sdk]);

    if (error instanceof Error) {
        return <div>{error.message}</div>;
    }

    if (!sdk) {
        return <div />;
    }

    return (
        <AppSdkContext.Provider value={sdk}>
            <ThemeProvider theme={sdk.miniApp.isDark ? defaultTheme : lightTheme}>
                <DarkThemeContext.Provider value={sdk.miniApp.isDark}>
                    <GlobalStyle />
                    <GlobalListStyle />
                    <StubApp sdk={sdk} />
                </DarkThemeContext.Provider>
            </ThemeProvider>
        </AppSdkContext.Provider>
    );
};

const StubApp: FC<{ sdk: TwaAppSdk }> = ({ sdk }) => {
    const { t: tSimple, i18n } = useTranslation();
    const t = useTWithReplaces(tSimple);

    const translation = useMemo<I18nContext>(
        () => ({
            t,
            i18n: {
                enable: false,
                reloadResources: i18n.reloadResources,
                changeLanguage: i18n.changeLanguage as any,
                language: i18n.language,
                languages: []
            }
        }),
        [t, i18n]
    );

    const Router = BrowserRouter as any;

    return (
        <Router>
            <TranslationContext.Provider value={translation}>
                <StorageContext.Provider value={sdk.storage}>
                    <Loader sdk={sdk} />
                </StorageContext.Provider>
            </TranslationContext.Provider>
        </Router>
    );
};

const SUPPORTED_TWA_LOCALES = new Set([
    'en', 'ru', 'it', 'tr', 'bg', 'es', 'id', 'uk', 'uz', 'bn', 'fr', 'pa', 'pt', 'vi', 'hi', 'ar', 'de', 'fa'
]);

const telegramLangToLocale = (code?: string): string | undefined => {
    if (!code) return undefined;
    const normalized = code.toLowerCase();
    if (normalized.startsWith('zh')) {
        return /hant|tw|hk|mo/.test(normalized) ? 'zh_TW' : 'zh_CN';
    }
    const base = normalized.split(/[-_]/)[0];
    return SUPPORTED_TWA_LOCALES.has(base) ? base : undefined;
};

const Loader: FC<{ sdk: TwaAppSdk }> = ({ sdk }) => {
    const { data: lang, isLoading: isLangLoading } = useUserLanguage();
    const { data: fiat } = useUserFiatQuery();
    const { data: accounts } = useAccountsStateQuery();
    const network = useActiveTonNetwork();
    const { i18n } = useTranslation();

    useTwaAppViewport(false, sdk);

    useEffect(() => {
        if (lang === undefined) return;

        const storedLocale = localizationText(lang);
        const telegramLocale = telegramLangToLocale(sdk.launchParams?.initData?.user?.languageCode);
        const targetLocale = storedLocale ?? telegramLocale ?? 'en';

        if (i18n.language !== targetLocale) {
            i18n.changeLanguage(targetLocale);
        }
    }, [lang, i18n, sdk]);

    const tonendpoint = useTonendpoint({
        build: sdk.version,
        network,
        lang,
        platform: 'twa'
    });
    const { data: serverConfig } = useTonenpointConfig(tonendpoint);

    const { data: tracker } = useStubAnalytics(
        accounts,
        network,
        sdk.version,
        serverConfig?.mainnetConfig
    );

    const context = useMemo<IAppContext>(() => {
        const mainnetConfig = serverConfig?.mainnetConfig ?? defaultTonendpointConfig;
        const testnetConfig = serverConfig?.testnetConfig ?? defaultTonendpointConfig;
        return {
            mainnetApi: getApiConfig(mainnetConfig),
            testnetApi: getApiConfig(testnetConfig),
            fiat: fiat ?? FiatCurrencies.USD,
            mainnetConfig,
            testnetConfig,
            tonendpoint,
            standalone: true,
            extension: false,
            ios: true,
            proFeatures: false,
            hideLedger: true,
            hideSigner: true,
            hideKeystone: true,
            hideQrScanner: true,
            hideMam: true,
            hideMultisig: true,
            hideFireblocks: true,
            defaultWalletVersion: WalletVersion.V5R1,
            browserLength: 4,
            tracker: tracker?.track
        };
    }, [serverConfig, fiat, tonendpoint, tracker]);

    if (isLangLoading) {
        return <Loading />;
    }

    return (
        <AppContext.Provider value={context}>
            <ErrorReporting />
            <MainRouter sdk={sdk} />
            <CopyNotification />
        </AppContext.Provider>
    );
};

const MainRouter: FC<{ sdk: TwaAppSdk }> = ({ sdk }) => {
    const { t } = useUikitTranslation();
    const history = useHistory();
    const location = useLocation();

    const [sendOpen, setSendOpen] = useState(false);
    const [sendAssetSymbol, setSendAssetSymbol] = useState<string | undefined>(undefined);
    const [receiveOpen, setReceiveOpen] = useState(false);
    const [receiveAssetSymbol, setReceiveAssetSymbol] = useState<string | undefined>(undefined);
    const [swapOpen, setSwapOpen] = useState(false);
    const [swapAssetSymbol, setSwapAssetSymbol] = useState<string | undefined>(undefined);
    const [showRecovery, setShowRecovery] = useState(false);

    const currentPath = location.pathname;

    const showBackButton = currentPath !== '/' || showRecovery;
    useHandleBackButton(() => {
        if (showRecovery) {
            setShowRecovery(false);
        } else {
            history.push('/');
        }
    }, showBackButton);

    if (showRecovery) {
        return <MiniAppClosed sdk={sdk} />;
    }

    return (
        <AppLayout>
            <Switch>
                <Route exact path="/">
                    <Home
                        onSend={() => {
                            setSendAssetSymbol('TON');
                            setSendOpen(true);
                        }}
                        onReceive={() => {
                            setReceiveAssetSymbol('TON');
                            setReceiveOpen(true);
                        }}
                        onSwap={() => {
                            setSwapAssetSymbol('TON');
                            setSwapOpen(true);
                        }}
                        onBuy={() => {
                            setReceiveAssetSymbol('TON');
                            setReceiveOpen(true);
                        }}
                        onSelectToken={symbol => history.push(`/coin/${symbol}`)}
                    />
                </Route>
                <Route path="/activity">
                    <Activity />
                </Route>

                <Route path="/trading">
                    <TradingScreen />
                </Route>

                <Route path="/coin/:symbol">
                    {({ match }) => (
                        <CoinHeader
                            symbol={match?.params?.symbol || 'TON'}
                            onBack={() => history.push('/')}
                            onSend={() => {
                                setSendAssetSymbol(match?.params?.symbol || 'TON');
                                setSendOpen(true);
                            }}
                            onReceive={() => {
                                setReceiveAssetSymbol(match?.params?.symbol || 'TON');
                                setReceiveOpen(true);
                            }}
                            onSwap={() => {
                                setSwapAssetSymbol(match?.params?.symbol || 'TON');
                                setSwapOpen(true);
                            }}
                            onTrade={() => history.push('/trading')}
                        />
                    )}
                </Route>

                <Route path="/settings">
                    <Settings onOpenRecovery={() => setShowRecovery(true)} />
                </Route>
            </Switch>

            <SendNotification
                isOpen={sendOpen}
                onClose={() => setSendOpen(false)}
                assetSymbol={sendAssetSymbol}
            />
            <ReceiveNotification
                isOpen={receiveOpen}
                onClose={() => setReceiveOpen(false)}
                assetSymbol={receiveAssetSymbol}
            />
            <SwapView
                isOpen={swapOpen}
                onClose={() => setSwapOpen(false)}
                fromAssetSymbol={swapAssetSymbol}
            />

            <BottomNav>
                <NavItem $active={currentPath === '/'} onClick={() => history.push('/')}>
                    <WalletIcon size={22} />
                    {t('nav_wallet') || 'Wallet'}
                </NavItem>
                <NavItem $active={currentPath === '/trading'} onClick={() => history.push('/trading')}>
                    <TradingIcon size={22} />
                    {t('nav_trade') || 'Trade'}
                </NavItem>
                <NavItem $active={currentPath === '/activity'} onClick={() => history.push('/activity')}>
                    <HistoryIcon size={22} />
                    {t('nav_history') || 'History'}
                </NavItem>
                <NavItem $active={currentPath === '/settings'} onClick={() => history.push('/settings')}>
                    <SettingsIcon size={22} />
                    {t('nav_settings') || 'Settings'}
                </NavItem>
            </BottomNav>
        </AppLayout>
    );
};

const ErrorReporting: FC = () => {
    useTwaErrorReporting();
    return null;
};
