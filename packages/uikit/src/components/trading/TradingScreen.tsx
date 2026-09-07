import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useGemKeepState, roundAmount, GemKeepTrade } from '../../state/gemkeep';
import { CandleChart } from './CandleChart';
import { Button } from '../fields/Button';
import {
    TrendingUpIcon,
    TrendingDownIcon,
    TradingIcon,
    TonIcon,
    UsdtIcon,
    CloseIcon,
    ChevronDownIcon,
    RefreshIcon
} from '../Icon';
import { WalletEmoji } from '../shared/emoji/WalletEmoji';
import { useTranslation } from '../../hooks/translation';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
    padding-bottom: 90px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
`;

const ScreenTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Subtitle = styled.span`
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const BalanceChip = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.06);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const PairCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    padding: 12px 16px;
`;

const PairLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const PairIcons = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 44px;
    height: 28px;
`;

const PairName = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const PayoutBadge = styled.span`
    font-size: 11px;
    font-weight: 700;
    color: #34c759;
    background: rgba(52, 199, 89, 0.15);
    padding: 2px 6px;
    border-radius: 6px;
`;

const PriceRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const PriceValue = styled.span`
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const PriceChange = styled.span<{ $up: boolean }>`
    font-size: 12px;
    font-weight: 600;
    color: ${props => (props.$up ? '#34c759' : '#ff3b30')};
`;

const ControlsCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 20px;
    padding: 16px;
`;

const SectionLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const DurationRow = styled.div`
    display: flex;
    gap: 8px;
`;

const DurationBtn = styled.button<{ $active: boolean }>`
    flex: 1;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid ${props => (props.$active ? '#0088cc' : 'rgba(255, 255, 255, 0.08)')};
    background: ${props =>
        props.$active ? 'rgba(0, 136, 204, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
    color: ${props => (props.$active ? '#0088cc' : props.theme.textSecondary || '#8a95a5')};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        border-color: #0088cc;
    }
`;

const DirectionGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`;

const DirectionBtn = styled.button<{ $direction: 'up' | 'down'; $selected: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 16px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 2px solid
        ${props =>
            props.$selected ? (props.$direction === 'up' ? '#34c759' : '#ff3b30') : 'transparent'};
    background: ${props =>
        props.$direction === 'up'
            ? props.$selected
                ? 'rgba(52, 199, 89, 0.25)'
                : 'rgba(52, 199, 89, 0.12)'
            : props.$selected
            ? 'rgba(255, 59, 48, 0.25)'
            : 'rgba(255, 59, 48, 0.12)'};
    color: ${props => (props.$direction === 'up' ? '#34c759' : '#ff3b30')};

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const InputRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 14px;
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);

    &:focus-within {
        border-color: #0088cc;
    }
`;

const NumberInput = styled.input`
    background: transparent;
    border: none;
    outline: none;
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    width: 100%;

    &::placeholder {
        color: rgba(255, 255, 255, 0.2);
    }
`;

const InputUnit = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: #26a17b;
    margin-left: 8px;
`;

const PresetRow = styled.div`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
`;

const PresetChip = styled.button`
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
    }
`;

const PotentialCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 136, 204, 0.08);
    border: 1px solid rgba(0, 136, 204, 0.2);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
`;

const PotentialLeft = styled.span`
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const PotentialValue = styled.span`
    font-weight: 700;
    color: #34c759;
`;

const ActivePositionCard = styled.div<{ $direction: 'up' | 'down' }>`
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: ${props =>
        props.$direction === 'up' ? 'rgba(52, 199, 89, 0.08)' : 'rgba(255, 59, 48, 0.08)'};
    border: 1px solid
        ${props =>
            props.$direction === 'up' ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)'};
    border-radius: 16px;
    padding: 14px 16px;
`;

const PositionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const PositionBadge = styled.span<{ $direction: 'up' | 'down' }>`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: ${props => (props.$direction === 'up' ? '#34c759' : '#ff3b30')};
    background: ${props =>
        props.$direction === 'up' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 59, 48, 0.15)'};
    padding: 4px 8px;
    border-radius: 6px;
`;

const TimerText = styled.span`
    font-size: 14px;
    font-weight: 700;
    font-family: monospace;
    color: #ffb300;
`;

const PositionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
`;

const StatBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const StatLabel = styled.span`
    font-size: 11px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const StatValue = styled.span<{ $color?: string }>`
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.$color || props.theme.textPrimary || '#ffffff'};
`;

const StatsCard = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    padding: 14px 12px;
    text-align: center;
`;

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StatNum = styled.div<{ $color?: string }>`
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.$color || props.theme.textPrimary || '#ffffff'};
`;

const StatTitle = styled.div`
    font-size: 11px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const HistoryList = styled.div`
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    overflow: hidden;
`;

const HistoryItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    &:last-child {
        border-bottom: none;
    }
`;

const HistoryLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const HistoryDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const HistoryTitle = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const HistorySub = styled.span`
    font-size: 11px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const HistoryRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
`;

const ResultBadge = styled.span<{ $result: 'win' | 'loss' | 'draw' }>`
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    color: ${props =>
        props.$result === 'win' ? '#34c759' : props.$result === 'loss' ? '#ff3b30' : '#8a95a5'};
    background: ${props =>
        props.$result === 'win'
            ? 'rgba(52, 199, 89, 0.15)'
            : props.$result === 'loss'
            ? 'rgba(255, 59, 48, 0.15)'
            : 'rgba(255, 255, 255, 0.1)'};
`;

const HistoryPnl = styled.span<{ $pnl: number }>`
    font-size: 13px;
    font-weight: 700;
    color: ${props => (props.$pnl > 0 ? '#34c759' : props.$pnl < 0 ? '#ff3b30' : '#8a95a5')};
`;

const Banner = styled.div<{ $type: 'win' | 'loss' | 'draw' }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    background: ${props =>
        props.$type === 'win'
            ? 'linear-gradient(135deg, #1e7e34, #34c759)'
            : props.$type === 'loss'
            ? 'linear-gradient(135deg, #bd2130, #ff3b30)'
            : '#4a5568'};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    animation: fadeIn 0.3s ease;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const TradingScreen: React.FC = () => {
    const { t } = useTranslation();
    const { activeWallet, activeWalletTrades, tradingStats, openTrade, closeTrade } =
        useGemKeepState();

    const [direction, setDirection] = useState<'up' | 'down'>('up');
    const [amountStr, setAmountStr] = useState('1');
    const [duration, setDuration] = useState<number>(30); // 15s, 30s, 60s
    const [currentPrice, setCurrentPrice] = useState(5.65);
    const [lastRoundResult, setLastRoundResult] = useState<{
        type: 'win' | 'loss' | 'draw';
        amount: number;
        pnl: number;
    } | null>(null);

    // USDT balance in active wallet
    const usdtAsset = activeWallet.assets.find(a => a.symbol.toUpperCase() === 'USDT');
    const usdtBalance = usdtAsset ? usdtAsset.balance : 0;

    // Currently active trade (if any is open for this wallet)
    const activeTrade = useMemo(() => {
        return activeWalletTrades.find(t => t.status === 'open');
    }, [activeWalletTrades]);

    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    // Live micro-tick market price simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPrice(prev => {
                const delta = (Math.random() - 0.495) * 0.015;
                return Number(Math.max(4.0, prev + delta).toFixed(4));
            });
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    const currentPriceRef = useRef(currentPrice);
    currentPriceRef.current = currentPrice;

    // Round countdown & completion logic
    useEffect(() => {
        if (!activeTrade) {
            setSecondsLeft(0);
            return;
        }

        const resolveTrade = () => {
            const exitPrice = currentPriceRef.current;
            const res = closeTrade({
                tradeId: activeTrade.id,
                exitPrice
            });

            if (res.success) {
                let pnl = 0;
                let type: 'win' | 'loss' | 'draw' = 'draw';
                if (exitPrice === activeTrade.entryPrice) {
                    type = 'draw';
                    pnl = 0;
                } else if (activeTrade.direction === 'up') {
                    if (exitPrice > activeTrade.entryPrice) {
                        type = 'win';
                        pnl = roundAmount(activeTrade.amount * 0.8, 2);
                    } else {
                        type = 'loss';
                        pnl = -roundAmount(activeTrade.amount, 2);
                    }
                } else {
                    if (exitPrice < activeTrade.entryPrice) {
                        type = 'win';
                        pnl = roundAmount(activeTrade.amount * 0.8, 2);
                    } else {
                        type = 'loss';
                        pnl = -roundAmount(activeTrade.amount, 2);
                    }
                }

                setLastRoundResult({
                    type,
                    amount: activeTrade.amount,
                    pnl
                });
            }
        };

        const totalDuration = activeTrade.durationSeconds || 30;
        const elapsed = Math.floor((Date.now() - activeTrade.openedAt) / 1000);
        const remaining = Math.max(0, totalDuration - elapsed);
        setSecondsLeft(remaining);

        if (remaining <= 0) {
            resolveTrade();
            return;
        }

        const timer = setInterval(() => {
            const curElapsed = Math.floor((Date.now() - activeTrade.openedAt) / 1000);
            const curRemaining = Math.max(0, totalDuration - curElapsed);
            setSecondsLeft(curRemaining);

            if (curRemaining <= 0) {
                clearInterval(timer);
                resolveTrade();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [activeTrade, closeTrade]);

    const amountNum = parseFloat(amountStr) || 0;
    const isAmountValid = amountNum > 0 && amountNum <= usdtBalance;
    const potentialProfit = roundAmount(amountNum * 0.8, 2);
    const potentialPayout = roundAmount(amountNum * 1.8, 2);

    const handleOpenTrade = () => {
        if (!isAmountValid || activeTrade) return;

        setLastRoundResult(null);
        openTrade({
            pair: 'TON/USDT',
            asset: 'TON',
            quoteAsset: 'USDT',
            direction,
            amount: amountNum,
            entryPrice: currentPrice,
            durationSeconds: duration
        });
    };

    const handleCloseEarly = () => {
        if (!activeTrade) return;
        const exitPrice = currentPrice;
        const res = closeTrade({
            tradeId: activeTrade.id,
            exitPrice
        });

        if (res.success) {
            let pnl = 0;
            let type: 'win' | 'loss' | 'draw' = 'draw';
            if (exitPrice === activeTrade.entryPrice) {
                type = 'draw';
                pnl = 0;
            } else if (activeTrade.direction === 'up') {
                if (exitPrice > activeTrade.entryPrice) {
                    type = 'win';
                    pnl = roundAmount(activeTrade.amount * 0.8, 2);
                } else {
                    type = 'loss';
                    pnl = -roundAmount(activeTrade.amount, 2);
                }
            } else {
                if (exitPrice < activeTrade.entryPrice) {
                    type = 'win';
                    pnl = roundAmount(activeTrade.amount * 0.8, 2);
                } else {
                    type = 'loss';
                    pnl = -roundAmount(activeTrade.amount, 2);
                }
            }

            setLastRoundResult({
                type,
                amount: activeTrade.amount,
                pnl
            });
        }
    };

    // Live PnL calculation for active position
    const livePositionPnL = useMemo(() => {
        if (!activeTrade) return 0;
        const diff = currentPrice - activeTrade.entryPrice;
        if (diff === 0) return 0;
        const isFavorable = activeTrade.direction === 'up' ? diff > 0 : diff < 0;
        return isFavorable
            ? roundAmount(activeTrade.amount * 0.8, 2)
            : -roundAmount(activeTrade.amount, 2);
    }, [activeTrade, currentPrice]);

    return (
        <Container>
            <Header>
                <TitleSection>
                    <ScreenTitle>
                        <TradingIcon size={24} color="#0088cc" />
                        {t('trade_title') || 'Trading'}
                    </ScreenTitle>
                    <Subtitle>{t('trade_subtitle') || 'Virtual Binary Up/Down Simulator'}</Subtitle>
                </TitleSection>
                <BalanceChip>
                    <UsdtIcon size={16} />
                    {usdtBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}{' '}
                    USDT
                </BalanceChip>
            </Header>

            {/* Notification Banner on Round Result */}
            {lastRoundResult && (
                <Banner $type={lastRoundResult.type}>
                    <span>
                        {lastRoundResult.type === 'win' &&
                            `🎉 ${t('trade_round_won') || 'Round Won!'} +$${lastRoundResult.pnl.toFixed(2)} USDT`}
                        {lastRoundResult.type === 'loss' &&
                            `📉 ${t('trade_round_lost') || 'Round Lost'} (-$${Math.abs(lastRoundResult.pnl).toFixed(2)} USDT)`}
                        {lastRoundResult.type === 'draw' &&
                            `🤝 ${t('trade_round_draw') || 'Round Draw'} (${t('trade_refunded') || 'Refunded'} $${lastRoundResult.amount.toFixed(2)} USDT)`}
                    </span>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                        onClick={() => setLastRoundResult(null)}
                    >
                        <CloseIcon size={16} />
                    </button>
                </Banner>
            )}

            {/* Trading Pair Header */}
            <PairCard>
                <PairLeft>
                    <PairIcons>
                        <div style={{ position: 'absolute', left: 0, zIndex: 2 }}>
                            <TonIcon size={28} />
                        </div>
                        <div style={{ position: 'absolute', left: 16, zIndex: 1 }}>
                            <UsdtIcon size={28} />
                        </div>
                    </PairIcons>
                    <div>
                        <PairName>TON / USDT</PairName>
                        <PayoutBadge>+80% {t('trade_payout') || 'Payout'}</PayoutBadge>
                    </div>
                </PairLeft>
                <PriceRight>
                    <PriceValue>${currentPrice.toFixed(4)}</PriceValue>
                    <PriceChange $up={currentPrice >= 5.65}>+3.14% (24h)</PriceChange>
                </PriceRight>
            </PairCard>

            {/* Candlestick & Price Chart */}
            <CandleChart basePrice={5.65} currentPrice={currentPrice} />

            {/* Active Position / Ongoing Round */}
            {activeTrade && (
                <ActivePositionCard $direction={activeTrade.direction}>
                    <PositionHeader>
                        <PositionBadge $direction={activeTrade.direction}>
                            {activeTrade.direction === 'up' ? (
                                <TrendingUpIcon size={14} color="#34c759" />
                            ) : (
                                <TrendingDownIcon size={14} color="#ff3b30" />
                            )}
                            {activeTrade.direction.toUpperCase()} {t('trade_round_active') || 'Round Active'}
                        </PositionBadge>
                        <TimerText>
                            ⏱ 00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                        </TimerText>
                    </PositionHeader>

                    <PositionGrid>
                        <StatBlock>
                            <StatLabel>{t('trade_entry_price') || 'Entry Price'}</StatLabel>
                            <StatValue>${activeTrade.entryPrice.toFixed(4)}</StatValue>
                        </StatBlock>
                        <StatBlock>
                            <StatLabel>{t('trade_current_price') || 'Current Price'}</StatLabel>
                            <StatValue
                                $color={
                                    (activeTrade.direction === 'up' &&
                                        currentPrice >= activeTrade.entryPrice) ||
                                    (activeTrade.direction === 'down' &&
                                        currentPrice <= activeTrade.entryPrice)
                                        ? '#34c759'
                                        : '#ff3b30'
                                }
                            >
                                ${currentPrice.toFixed(4)}
                            </StatValue>
                        </StatBlock>
                        <StatBlock>
                            <StatLabel>{t('trade_live_pnl') || 'Live PnL'}</StatLabel>
                            <StatValue $color={livePositionPnL >= 0 ? '#34c759' : '#ff3b30'}>
                                {livePositionPnL >= 0 ? '+' : ''}${livePositionPnL.toFixed(2)}
                            </StatValue>
                        </StatBlock>
                    </PositionGrid>

                    <Button
                        fullWidth
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#ffffff',
                            padding: '8px 14px',
                            fontSize: '13px'
                        }}
                        onClick={handleCloseEarly}
                    >
                        {t('trade_close_early') || 'Close Trade Early'} (${currentPrice.toFixed(4)})
                    </Button>
                </ActivePositionCard>
            )}

            {/* Trade Controls */}
            {!activeTrade && (
                <ControlsCard>
                    <SectionLabel>{t('trade_round_duration') || 'Round Duration'}</SectionLabel>
                    <DurationRow>
                        {[15, 30, 60].map(sec => (
                            <DurationBtn
                                key={sec}
                                $active={duration === sec}
                                onClick={() => setDuration(sec)}
                            >
                                {sec}s {t('trade_round') || 'Round'}
                            </DurationBtn>
                        ))}
                    </DurationRow>

                    <SectionLabel>{t('trade_predict_direction') || 'Predict Direction'}</SectionLabel>
                    <DirectionGrid>
                        <DirectionBtn
                            $direction="up"
                            $selected={direction === 'up'}
                            onClick={() => setDirection('up')}
                        >
                            <TrendingUpIcon size={20} color="#34c759" />
                            {t('trade_up') || 'UP'}
                        </DirectionBtn>
                        <DirectionBtn
                            $direction="down"
                            $selected={direction === 'down'}
                            onClick={() => setDirection('down')}
                        >
                            <TrendingDownIcon size={20} color="#ff3b30" />
                            {t('trade_down') || 'DOWN'}
                        </DirectionBtn>
                    </DirectionGrid>

                    <InputWrapper>
                        <SectionLabel>{t('trade_amount') || 'Trade Amount'}</SectionLabel>
                        <InputRow>
                            <NumberInput
                                type="number"
                                step="any"
                                value={amountStr}
                                onChange={e => setAmountStr(e.target.value)}
                                placeholder="0.00"
                                min="0.01"
                                max={usdtBalance}
                            />
                            <InputUnit>USDT</InputUnit>
                        </InputRow>
                        <PresetRow>
                            {['0.5', '1', '5', '10'].map(val => (
                                <PresetChip key={val} onClick={() => setAmountStr(val)}>
                                    {val}
                                </PresetChip>
                            ))}
                            <PresetChip
                                onClick={() =>
                                    setAmountStr(
                                        usdtBalance > 0
                                            ? (Math.floor(usdtBalance * 100) / 100).toString()
                                            : '0'
                                    )
                                }
                            >
                                {t('trade_max') || 'MAX'}
                            </PresetChip>
                        </PresetRow>
                    </InputWrapper>

                    <PotentialCard>
                        <PotentialLeft>{t('trade_potential_payout') || 'Potential Payout (+80%):'}</PotentialLeft>
                        <PotentialValue>
                            ${potentialPayout.toFixed(2)} (+${potentialProfit.toFixed(2)} USDT)
                        </PotentialValue>
                    </PotentialCard>

                    <Button
                        primary
                        fullWidth
                        disabled={!isAmountValid}
                        onClick={handleOpenTrade}
                        style={{
                            background:
                                direction === 'up'
                                    ? 'linear-gradient(135deg, #28a745, #34c759)'
                                    : 'linear-gradient(135deg, #dc3545, #ff3b30)',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '700'
                        }}
                    >
                        {direction === 'up' ? `📈 ${t('trade_predict_up') || 'Predict UP'}` : `📉 ${t('trade_predict_down') || 'Predict DOWN'}`} ({amountNum}{' '}
                        USDT)
                    </Button>
                </ControlsCard>
            )}

            {/* Trading Stats */}
            <SectionLabel>{t('trade_stats_title') || 'Performance Statistics'}</SectionLabel>
            <StatsCard>
                <StatItem>
                    <StatNum>{tradingStats.totalTrades}</StatNum>
                    <StatTitle>{t('trade_stats_trades') || 'Trades'}</StatTitle>
                </StatItem>
                <StatItem>
                    <StatNum $color="#34c759">{tradingStats.wins}</StatNum>
                    <StatTitle>{t('trade_stats_wins') || 'Wins'}</StatTitle>
                </StatItem>
                <StatItem>
                    <StatNum $color={tradingStats.winRate >= 50 ? '#34c759' : '#ffb300'}>
                        {tradingStats.winRate}%
                    </StatNum>
                    <StatTitle>{t('trade_stats_winrate') || 'Win Rate'}</StatTitle>
                </StatItem>
                <StatItem>
                    <StatNum $color={tradingStats.totalPnl >= 0 ? '#34c759' : '#ff3b30'}>
                        {tradingStats.totalPnl >= 0 ? '+' : ''}${tradingStats.totalPnl.toFixed(2)}
                    </StatNum>
                    <StatTitle>{t('trade_stats_net_pnl') || 'Net PnL'}</StatTitle>
                </StatItem>
            </StatsCard>

            {/* Trade History */}
            <SectionLabel>{t('trade_history_title') || 'Recent Virtual Trades'}</SectionLabel>
            {activeWalletTrades.length === 0 ? (
                <div
                    style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: '#8a95a5',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '16px',
                        fontSize: '14px'
                    }}
                >
                    {t('trade_no_history') || 'No trading history for this wallet yet. Place a trade above!'}
                </div>
            ) : (
                <HistoryList>
                    {activeWalletTrades.slice(0, 10).map(t => (
                        <HistoryItem key={t.id}>
                            <HistoryLeft>
                                {t.direction === 'up' ? (
                                    <TrendingUpIcon size={18} color="#34c759" />
                                ) : (
                                    <TrendingDownIcon size={18} color="#ff3b30" />
                                )}
                                <HistoryDetails>
                                    <HistoryTitle>
                                        {t.pair || 'TON/USDT'} • {t.direction.toUpperCase()}
                                    </HistoryTitle>
                                    <HistorySub>
                                        Entry: ${t.entryPrice.toFixed(4)}
                                        {t.exitPrice ? ` → Exit: $${t.exitPrice.toFixed(4)}` : ''}
                                    </HistorySub>
                                </HistoryDetails>
                            </HistoryLeft>
                            <HistoryRight>
                                <ResultBadge
                                    $result={t.result || (t.status === 'open' ? 'draw' : 'draw')}
                                >
                                    {t.status === 'open'
                                        ? 'OPEN'
                                        : (t.result || 'CLOSED').toUpperCase()}
                                </ResultBadge>
                                {t.pnl !== undefined && (
                                    <HistoryPnl $pnl={t.pnl}>
                                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                                    </HistoryPnl>
                                )}
                            </HistoryRight>
                        </HistoryItem>
                    ))}
                </HistoryList>
            )}
        </Container>
    );
};
