import {
    HapticFeedback,
    LaunchParams,
    MainButton,
    MiniApp,
    Utils,
    Viewport,
    initBackButton,
    initHapticFeedback,
    initMainButton,
    initMiniApp,
    initUtils,
    retrieveLaunchParams
} from '@tma.js/sdk';
import { BaseApp, NativeBackButton } from '@tonkeeper/core/dist/AppSdk';
import copyToClipboard from 'copy-to-clipboard';
import packageJson from '../../package.json';
import { disableScroll, enableScroll, getScrollbarWidth } from './scroll';
import { TwaStorage } from './storage';

export class TwaAppSdk extends BaseApp {
    nativeBackButton: NativeBackButton;
    hapticFeedback: HapticFeedback;
    public miniApp: MiniApp;
    public launchParams: LaunchParams;
    public mainButton: MainButton;
    utils: Utils;

    constructor(public viewport: Viewport) {
        super(new TwaStorage());
        try {
            const [miniApp] = initMiniApp();
            this.miniApp = miniApp;
        } catch {
            this.miniApp = {
                isDark: true,
                supports: () => false,
                setBgColor: () => {},
                setHeaderColor: () => {}
            } as any;
        }

        try {
            this.hapticFeedback = initHapticFeedback();
        } catch {
            this.hapticFeedback = {
                notificationOccurred: () => {},
                impactOccurred: () => {},
                selectionChanged: () => {}
            } as any;
        }

        try {
            this.launchParams = retrieveLaunchParams();
        } catch {
            this.launchParams = {
                platform: 'tdesktop',
                version: '7.2',
                themeParams: {
                    accentTextColor: '#0088cc',
                    bgColor: '#10161f',
                    buttonColor: '#0088cc',
                    buttonTextColor: '#ffffff',
                    destructiveTextColor: '#ff3b30',
                    headerBgColor: '#10161f',
                    hintColor: '#8a95a5',
                    linkColor: '#0088cc',
                    secondaryBgColor: '#1c2430',
                    sectionBgColor: '#1c2430',
                    sectionHeaderTextColor: '#8a95a5',
                    subtitleTextColor: '#8a95a5',
                    textColor: '#ffffff'
                }
            };
        }

        try {
            const [backButton] = initBackButton();
            this.nativeBackButton = backButton;
        } catch {
            this.nativeBackButton = {
                show: () => {},
                hide: () => {},
                on: () => () => {},
                off: () => {}
            } as any;
        }

        try {
            const [mainButton] = initMainButton();
            this.mainButton = mainButton;
        } catch {
            this.mainButton = {
                isVisible: false,
                show: () => {},
                hide: () => {},
                setText: () => {},
                enable: () => {},
                disable: () => {},
                showProgress: () => {},
                hideProgress: () => {},
                on: () => () => {},
                off: () => {}
            } as any;
        }

        try {
            this.utils = initUtils();
        } catch {
            this.utils = {
                openLink: (url: string) => window.open(url, '_blank'),
                openTelegramLink: (url: string) => window.open(url, '_blank')
            } as any;
        }
    }

    copyToClipboard = (value: string, notification?: string) => {
        copyToClipboard(value);

        this.topMessage(notification);
        this.hapticFeedback.notificationOccurred('success');
    };

    openPage = async (url: string) => {
        if (!url.startsWith('http')) {
            throw new Error('Invalid url');
        }
        if (url.includes('t.me')) {
            this.utils.openTelegramLink(url);
        } else {
            this.utils.openLink(url);
        }
    };

    hapticNotification = (type: 'success' | 'error' | 'impact_medium' | 'impact_light') => {
        if (type === 'success' || type === 'error') {
            this.hapticFeedback.notificationOccurred(type);
        }
    };

    disableScroll = disableScroll;
    enableScroll = enableScroll;
    getScrollbarWidth = getScrollbarWidth;
    getKeyboardHeight = () => 0;

    isIOs = () => true;
    isStandalone = () => true;

    version = packageJson.version ?? 'Unknown';

    targetEnv = 'twa' as const;
}
