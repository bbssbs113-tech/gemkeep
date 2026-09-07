import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronRightIcon, LockIcon, WalletIcon, RefreshIcon, InfoIcon, CloseIcon, CheckIcon } from '../Icon';
import { WalletEmoji } from '../shared/emoji/WalletEmoji';
import { WalletManagerDrawer } from '../home/WalletManagerDrawer';
import { Button } from '../fields/Button';
import { useGemKeepState } from '../../state/gemkeep';
import { useTranslation } from '../../hooks/translation';
import { useUserLanguage, useMutateUserLanguage } from '../../state/language';
import { Language } from '@tonkeeper/core/dist/entries/language';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const SectionHeader = styled.div`
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    margin: 4px 0 -8px 8px;
`;

const SectionGroup = styled.div`
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    overflow: hidden;
`;

const SettingItem = styled.div<{ $danger?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${props =>
            props.$danger ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 255, 255, 0.08)'};
    }
`;

const ItemLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const ItemTitle = styled.span<{ $danger?: boolean }>`
    font-size: 15px;
    font-weight: 600;
    color: ${props =>
        props.$danger ? props.theme.accentRed || '#ff3b30' : props.theme.textPrimary || '#ffffff'};
`;

const ItemValue = styled.span`
    font-size: 14px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    display: flex;
    align-items: center;
    gap: 6px;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 1100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
`;

const ModalCard = styled.div`
    width: 100%;
    max-width: 440px;
    background: ${props => props.theme.backgroundPage || '#1c2430'};
    border-radius: 20px;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    max-height: 85vh;
    overflow-y: auto;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ModalTitle = styled.h3<{ $danger?: boolean }>`
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: ${props =>
        props.$danger ? props.theme.accentRed || '#ff3b30' : props.theme.textPrimary || '#ffffff'};
`;

const ModalText = styled.p`
    margin: 0;
    font-size: 14px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    line-height: 1.5;
`;

const WarningBox = styled.div`
    background: rgba(255, 179, 0, 0.12);
    border: 1px solid rgba(255, 179, 0, 0.3);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 13px;
    color: #ffb300;
    line-height: 1.4;
`;

const WordsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin: 8px 0;
`;

const WordItem = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    font-size: 13px;
    color: ${props => props.theme.textPrimary || '#ffffff'};

    &::before {
        content: attr(data-number);
        color: ${props => props.theme.textSecondary || '#8a95a5'};
        margin-right: 8px;
        font-size: 12px;
        min-width: 18px;
    }
`;

const ModalActions = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

const DEMO_RECOVERY_WORDS = [
    'virtual',
    'gemkeep',
    'simulator',
    'toncoin',
    'engine',
    'balance',
    'wallet',
    'shield',
    'crystal',
    'crypto',
    'emerald',
    'sapphire',
    'digital',
    'secure',
    'offline',
    'preview',
    'sandbox',
    'diamond',
    'future',
    'network',
    'smart',
    'contract',
    'beacon',
    'galaxy'
];

export interface SettingsProps {
    onOpenRecovery?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onOpenRecovery }) => {
    const { t } = useTranslation();
    const { data: currentLang } = useUserLanguage();
    const mutateLang = useMutateUserLanguage();

    const { activeWallet, resetGemKeepState } = useGemKeepState();
    const [isWalletManagerOpen, setIsWalletManagerOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);

    const handleOpenSeed = () => {
        if (onOpenRecovery) {
            onOpenRecovery();
        } else {
            setIsSeedModalOpen(true);
        }
    };

    const handleConfirmReset = () => {
        resetGemKeepState();
        setIsResetConfirmOpen(false);
    };

    const isRussian = currentLang === Language.RU;

    return (
        <Container>
            <Title>{t('settings_title') || 'Settings'}</Title>

            <SectionHeader>{t('settings_security') || 'Wallet & Security'}</SectionHeader>
            <SectionGroup>
                <SettingItem onClick={() => setIsWalletManagerOpen(true)}>
                    <ItemLeft>
                        <WalletEmoji emoji="💎" containerSize={28} />
                        <ItemTitle>{t('wallet_manager_title') || 'Active Wallet'}</ItemTitle>
                    </ItemLeft>
                    <ItemValue>
                        {activeWallet.name}
                        <ChevronRightIcon size={16} />
                    </ItemValue>
                </SettingItem>

                <SettingItem onClick={handleOpenSeed}>
                    <ItemLeft>
                        <LockIcon size={20} color="#0088cc" />
                        <ItemTitle>{t('settings_backup_seed') || 'Show Recovery Phrase'}</ItemTitle>
                    </ItemLeft>
                    <ItemValue>
                        24 Words
                        <ChevronRightIcon size={16} />
                    </ItemValue>
                </SettingItem>
            </SectionGroup>

            <SectionHeader>{t('settings_customization') || 'Preferences'}</SectionHeader>
            <SectionGroup>
                <SettingItem>
                    <ItemLeft>
                        <ItemTitle>{t('settings_primary_currency') || 'Primary Currency'}</ItemTitle>
                    </ItemLeft>
                    <ItemValue>
                        USD ($)
                        <ChevronRightIcon size={16} />
                    </ItemValue>
                </SettingItem>

                <SettingItem onClick={() => setIsLangModalOpen(true)}>
                    <ItemLeft>
                        <ItemTitle>{t('settings_language') || 'Language'}</ItemTitle>
                    </ItemLeft>
                    <ItemValue>
                        {isRussian ? 'Русский' : 'English'}
                        <ChevronRightIcon size={16} />
                    </ItemValue>
                </SettingItem>

                <SettingItem>
                    <ItemLeft>
                        <ItemTitle>{t('settings_theme') || 'Theme'}</ItemTitle>
                    </ItemLeft>
                    <ItemValue>
                        {t('settings_dark_mode') || 'Dark'}
                        <ChevronRightIcon size={16} />
                    </ItemValue>
                </SettingItem>
            </SectionGroup>

            <SectionHeader>{t('settings_virtual_env') || 'Simulator Controls'}</SectionHeader>
            <SectionGroup>
                <SettingItem $danger onClick={() => setIsResetConfirmOpen(true)}>
                    <ItemLeft>
                        <RefreshIcon size={18} color="#ff3b30" />
                        <ItemTitle $danger>{t('settings_reset_state') || 'Reset Demo Data'}</ItemTitle>
                    </ItemLeft>
                    <ItemValue>
                        <ChevronRightIcon size={16} />
                    </ItemValue>
                </SettingItem>
            </SectionGroup>

            <SectionHeader>{t('settings_about') || 'About'}</SectionHeader>
            <SectionGroup>
                <SettingItem onClick={() => setIsAboutModalOpen(true)}>
                    <ItemLeft>
                        <InfoIcon size={20} color="#0088cc" />
                        <ItemTitle>{t('settings_about') || 'About GemKeep'}</ItemTitle>
                    </ItemLeft>
                    <ItemValue>
                        v3.30.2 Simulator
                        <ChevronRightIcon size={16} />
                    </ItemValue>
                </SettingItem>
            </SectionGroup>

            {/* Language Modal */}
            {isLangModalOpen && (
                <ModalOverlay onClick={() => setIsLangModalOpen(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{t('settings_language') || 'Language'}</ModalTitle>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8a95a5',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setIsLangModalOpen(false)}
                            >
                                <CloseIcon size={18} />
                            </button>
                        </ModalHeader>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div
                                onClick={() => {
                                    mutateLang.mutate(Language.EN);
                                    setIsLangModalOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: !isRussian ? 'rgba(0, 136, 204, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ color: '#ffffff', fontWeight: 600 }}>English</span>
                                {!isRussian && <CheckIcon size={18} color="#0088cc" />}
                            </div>
                            <div
                                onClick={() => {
                                    mutateLang.mutate(Language.RU);
                                    setIsLangModalOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: isRussian ? 'rgba(0, 136, 204, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ color: '#ffffff', fontWeight: 600 }}>Русский</span>
                                {isRussian && <CheckIcon size={18} color="#0088cc" />}
                            </div>
                        </div>
                    </ModalCard>
                </ModalOverlay>
            )}

            {/* Wallet Manager Drawer */}
            <WalletManagerDrawer
                isOpen={isWalletManagerOpen}
                onClose={() => setIsWalletManagerOpen(false)}
            />

            {/* Reset Confirmation Modal */}
            {isResetConfirmOpen && (
                <ModalOverlay onClick={() => setIsResetConfirmOpen(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle $danger>{t('settings_reset_state') || 'Reset Simulator Data'}</ModalTitle>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8a95a5',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setIsResetConfirmOpen(false)}
                            >
                                <CloseIcon size={18} />
                            </button>
                        </ModalHeader>
                        <ModalText>
                            {t('settings_reset_state_desc') || 'This will reset all virtual wallets, demo balances (0 TON & 1.5 USDT), and transaction history back to default demo state.'}
                        </ModalText>
                        <WarningBox>
                            {t('settings_virtual_env_desc') || 'All local demo changes will be restored to default. All operations remain 100% virtual and offline.'}
                        </WarningBox>
                        <ModalActions>
                            <Button fullWidth onClick={() => setIsResetConfirmOpen(false)}>
                                {t('action_cancel') || 'Cancel'}
                            </Button>
                            <Button
                                fullWidth
                                style={{
                                    background: '#ff3b30',
                                    color: '#ffffff',
                                    borderColor: '#ff3b30'
                                }}
                                onClick={handleConfirmReset}
                            >
                                {t('settings_reset_state') || 'Reset Demo Data'}
                            </Button>
                        </ModalActions>
                    </ModalCard>
                </ModalOverlay>
            )}

            {/* Recovery Phrase Modal (Virtual Simulator Only) */}
            {isSeedModalOpen && (
                <ModalOverlay onClick={() => setIsSeedModalOpen(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{t('settings_backup_seed') || 'Virtual Recovery Phrase'}</ModalTitle>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8a95a5',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setIsSeedModalOpen(false)}
                            >
                                <CloseIcon size={18} />
                            </button>
                        </ModalHeader>
                        <WarningBox>
                            <strong>Simulator Notice:</strong> {t('settings_virtual_env_desc') || 'This is a virtual simulation seed phrase for testing only. No real blockchain keys or assets exist.'}
                        </WarningBox>
                        <WordsGrid>
                            {DEMO_RECOVERY_WORDS.map((word, idx) => (
                                <WordItem key={idx} data-number={`${idx + 1}.`}>
                                    {word}
                                </WordItem>
                            ))}
                        </WordsGrid>
                        <Button primary fullWidth onClick={() => setIsSeedModalOpen(false)}>
                            {t('action_close') || 'Done'}
                        </Button>
                    </ModalCard>
                </ModalOverlay>
            )}

            {/* About Modal */}
            {isAboutModalOpen && (
                <ModalOverlay onClick={() => setIsAboutModalOpen(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{t('settings_about') || 'About GemKeep'}</ModalTitle>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8a95a5',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setIsAboutModalOpen(false)}
                            >
                                <CloseIcon size={18} />
                            </button>
                        </ModalHeader>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <WalletEmoji emoji="💎" containerSize={44} />
                            <div>
                                <h4 style={{ margin: 0, fontSize: 18, color: '#ffffff' }}>
                                    GemKeep
                                </h4>
                                <span style={{ fontSize: 13, color: '#0088cc', fontWeight: 600 }}>
                                    Virtual TON Wallet Simulator
                                </span>
                            </div>
                        </div>
                        <ModalText>
                            GemKeep is a local-only virtual wallet simulator crafted for
                            educational, testing, and interface prototyping.
                        </ModalText>
                        <ModalText>
                            • {t('settings_version') || 'Version'}: 3.30.2 (GemKeep Build)
                            <br />
                            • Architecture: Virtual State Engine
                            <br />• Network: 100% Local Sandbox Simulation (No Real Funds)
                        </ModalText>
                        <Button primary fullWidth onClick={() => setIsAboutModalOpen(false)}>
                            {t('action_close') || 'Close'}
                        </Button>
                    </ModalCard>
                </ModalOverlay>
            )}
        </Container>
    );
};
