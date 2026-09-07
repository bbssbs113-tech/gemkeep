import { mockTelegramEnv, retrieveLaunchParams } from '@tma.js/sdk';

export function ensureTelegramEnv() {
    try {
        retrieveLaunchParams();
    } catch {
        const defaultThemeParams = {
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
        };

        const launchParams = {
            themeParams: defaultThemeParams,
            initData: {
                user: {
                    id: 99288441,
                    firstName: 'GemKeep',
                    lastName: 'User',
                    username: 'gemkeep_user',
                    languageCode: 'en',
                    allowsWriteToPm: true
                },
                authDate: new Date(),
                hash: 'mock_hash'
            },
            initDataRaw: new URLSearchParams([
                [
                    'user',
                    JSON.stringify({
                        id: 99288441,
                        first_name: 'GemKeep',
                        last_name: 'User',
                        username: 'gemkeep_user',
                        language_code: 'en',
                        allows_write_to_pm: true
                    })
                ],
                ['auth_date', `${Math.floor(Date.now() / 1000)}`],
                ['hash', 'mock_hash']
            ]).toString(),
            version: '7.2',
            platform: 'tdesktop' as const
        };

        mockTelegramEnv(launchParams);
        console.warn('Telegram environment mocked for local/web preview.');
    }
}
