import React, { useState } from 'react';
import styled from 'styled-components';
import {
    TonIcon,
    UsdtIcon,
    SendIcon,
    ReceiveIcon,
    SwapIcon,
    BuyIcon,
    ChevronRightIcon
} from '../Icon';
import { WalletEmoji } from '../shared/emoji/WalletEmoji';
import { WalletManagerDrawer } from './WalletManagerDrawer';
import { DeveloperMenuDrawer } from './DeveloperMenuDrawer';
import { useGemKeepState } from '../../state/gemkeep';
import { useTranslation } from '../../hooks/translation';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;
    gap: 20px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
`;

const WalletHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    cursor: pointer;
`;

const WalletInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const WalletName = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const WalletAddress = styled.span`
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const BalanceSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 0;
`;

const TotalBalance = styled.div`
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const BalanceFiat = styled.div<{ $isNegative?: boolean }>`
    font-size: 15px;
    font-weight: 500;
    color: ${props =>
        props.$isNegative
            ? props.theme.accentRed || '#ff3b30'
            : props.theme.accentGreen || '#34c759'};
    display: flex;
    align-items: center;
    gap: 6px;
`;

const ActionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 8px;
`;

const ActionButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const ActionIconCircle = styled.div<{ $bg?: string }>`
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: ${props => props.$bg || 'rgba(0, 136, 204, 0.15)'};
    color: ${props => props.theme.accentBlue || '#0088cc'};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, background-color 0.15s ease;

    &:active {
        transform: scale(0.92);
    }
`;

const ActionLabel = styled.span`
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const TabsHeader = styled.div`
    display: flex;
    gap: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 8px;
    margin-top: 12px;
`;

const Tab = styled.div<{ $active: boolean }>`
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    color: ${props =>
        props.$active
            ? props.theme.textPrimary || '#ffffff'
            : props.theme.textSecondary || '#8a95a5'};
    position: relative;
    padding-bottom: 8px;

    &::after {
        content: '';
        position: absolute;
        bottom: -9px;
        left: 0;
        right: 0;
        height: 2px;
        background: ${props => props.theme.accentBlue || '#0088cc'};
        display: ${props => (props.$active ? 'block' : 'none')};
        border-radius: 2px;
    }
`;

const AssetsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const AssetRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
`;

const AssetLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const AssetMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const AssetName = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const AssetPrice = styled.span`
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const AssetRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
`;

const AssetBalance = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const AssetFiat = styled.span`
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

export interface HomeProps {
    onSend: () => void;
    onReceive: () => void;
    onSwap: () => void;
    onBuy: () => void;
    onSelectToken?: (symbol: string) => void;
    onOpenWallets?: () => void;
}

function formatAddress(addr: string): string {
    if (!addr) return '';
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function renderTokenIcon(symbol: string) {
    const s = symbol.toUpperCase();
    if (s === 'USDT') return <UsdtIcon size={38} />;
    return <TonIcon size={38} />;
}

export const Home: React.FC<HomeProps> = ({
    onSend,
    onReceive,
    onSwap,
    onBuy,
    onSelectToken,
    onOpenWallets
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');
    const [isWalletManagerOpen, setIsWalletManagerOpen] = useState(false);
    const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);

    const devTapCountRef = React.useRef(0);
    const devTapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const {
        activeWallet,
        assets,
        portfolioValueUsd,
        portfolioChange24hUsd,
        portfolioChange24hPercent
    } = useGemKeepState();

    const handleHeaderClick = () => {
        if (onOpenWallets) {
            onOpenWallets();
        } else {
            setIsWalletManagerOpen(true);
        }
    };

    const handleWalletNameTap = (e: React.MouseEvent) => {
        e.stopPropagation();
        devTapCountRef.current += 1;

        if (devTapTimeoutRef.current) {
            clearTimeout(devTapTimeoutRef.current);
        }

        if (devTapCountRef.current >= 15) {
            devTapCountRef.current = 0;
            setIsDevMenuOpen(true);
            return;
        }

        devTapTimeoutRef.current = setTimeout(() => {
            if (devTapCountRef.current === 1) {
                handleHeaderClick();
            }
            devTapCountRef.current = 0;
        }, 350);
    };

    const formattedPortfolioValue = `$${portfolioValueUsd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

    const isNegativeChange = portfolioChange24hUsd < 0;
    const absChangeUsd = Math.abs(portfolioChange24hUsd).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const absChangePercent = Math.abs(portfolioChange24hPercent).toFixed(2);
    const changeText = `${
        isNegativeChange ? '-' : '+'
    } $${absChangeUsd} (${absChangePercent}%) today`;

    return (
        <Container>
            <WalletHeader onClick={handleHeaderClick}>
                <WalletInfo onClick={handleWalletNameTap}>
                    <WalletEmoji emoji="💎" containerSize={36} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <WalletName>{activeWallet.name}</WalletName>
                        <WalletAddress>{formatAddress(activeWallet.address)}</WalletAddress>
                    </div>
                </WalletInfo>
                <ChevronRightIcon size={20} />
            </WalletHeader>

            <BalanceSection>
                <TotalBalance>{formattedPortfolioValue}</TotalBalance>
                <BalanceFiat $isNegative={isNegativeChange}>{changeText}</BalanceFiat>
            </BalanceSection>

            <ActionsGrid>
                <ActionButton onClick={onSend}>
                    <ActionIconCircle>
                        <SendIcon size={22} />
                    </ActionIconCircle>
                    <ActionLabel>{t('action_send') || 'Send'}</ActionLabel>
                </ActionButton>
                <ActionButton onClick={onReceive}>
                    <ActionIconCircle>
                        <ReceiveIcon size={22} />
                    </ActionIconCircle>
                    <ActionLabel>{t('action_receive') || 'Receive'}</ActionLabel>
                </ActionButton>
                <ActionButton onClick={onBuy}>
                    <ActionIconCircle>
                        <BuyIcon size={22} />
                    </ActionIconCircle>
                    <ActionLabel>{t('action_buy') || 'Buy'}</ActionLabel>
                </ActionButton>
                <ActionButton onClick={onSwap}>
                    <ActionIconCircle>
                        <SwapIcon size={22} />
                    </ActionIconCircle>
                    <ActionLabel>{t('action_swap') || 'Swap'}</ActionLabel>
                </ActionButton>
            </ActionsGrid>

            <TabsHeader>
                <Tab $active={activeTab === 'tokens'} onClick={() => setActiveTab('tokens')}>
                    Tokens
                </Tab>
                <Tab $active={activeTab === 'nfts'} onClick={() => setActiveTab('nfts')}>
                    NFTs (2)
                </Tab>
            </TabsHeader>

            {activeTab === 'tokens' ? (
                <AssetsList>
                    {assets.map(asset => {
                        const fiatValue = (asset.balance * asset.priceUsd).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                        const formattedBalance = `${asset.balance.toLocaleString('en-US', {
                            maximumFractionDigits: asset.decimals > 4 ? 4 : asset.decimals
                        })} ${asset.symbol}`;
                        const formattedPrice = `$${asset.priceUsd.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`;

                        return (
                            <AssetRow
                                key={asset.id || asset.symbol}
                                onClick={() => onSelectToken?.(asset.symbol)}
                            >
                                <AssetLeft>
                                    {renderTokenIcon(asset.symbol)}
                                    <AssetMeta>
                                        <AssetName>{asset.name}</AssetName>
                                        <AssetPrice>{formattedPrice}</AssetPrice>
                                    </AssetMeta>
                                </AssetLeft>
                                <AssetRight>
                                    <AssetBalance>{formattedBalance}</AssetBalance>
                                    <AssetFiat>${fiatValue}</AssetFiat>
                                </AssetRight>
                            </AssetRow>
                        );
                    })}
                </AssetsList>
            ) : (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#8a95a5' }}>
                    2 Collectibles in wallet
                </div>
            )}

            <WalletManagerDrawer
                isOpen={isWalletManagerOpen}
                onClose={() => setIsWalletManagerOpen(false)}
            />
            <DeveloperMenuDrawer isOpen={isDevMenuOpen} onClose={() => setIsDevMenuOpen(false)} />
        </Container>
    );
};
