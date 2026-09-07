import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
    ChevronLeftIcon,
    TonIcon,
    UsdtIcon,
    SendIcon,
    ReceiveIcon,
    SwapIcon,
    TradingIcon
} from '../Icon';
import { useGemKeepState, GemKeepTransaction } from '../../state/gemkeep';
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
`;

const HeaderNav = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    user-select: none;
`;

const CoinCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 20px;
    box-sizing: border-box;
`;

const GenericTokenBadge = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #0088cc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
`;

const CoinAmount = styled.div`
    font-size: 32px;
    font-weight: 800;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    text-align: center;
    word-break: break-all;
`;

const CoinFiat = styled.div`
    font-size: 15px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const PriceRateRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
`;

const PriceTag = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const ChangePill = styled.span<{ $isNegative?: boolean }>`
    font-size: 13px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    background: ${props =>
        props.$isNegative ? 'rgba(255, 59, 48, 0.15)' : 'rgba(52, 199, 89, 0.15)'};
    color: ${props =>
        props.$isNegative
            ? props.theme.accentRed || '#ff3b30'
            : props.theme.accentGreen || '#34c759'};
`;

const ActionsRow = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
    margin-top: 12px;
`;

const ActionBtn = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease, transform 0.1s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.16);
    }

    &:active {
        transform: scale(0.97);
    }
`;

const ChartCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px 16px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 20px;
    box-sizing: border-box;
`;

const ChartHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ChartPriceDisplay = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const ChartCurrentPrice = styled.span`
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const ChartSubLabel = styled.span`
    font-size: 12px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const TimeframeSelector = styled.div`
    display: flex;
    gap: 6px;
    background: rgba(255, 255, 255, 0.04);
    padding: 3px;
    border-radius: 10px;
`;

const TimeframeButton = styled.button<{ $active?: boolean }>`
    padding: 4px 10px;
    border-radius: 8px;
    border: none;
    background: ${props =>
        props.$active ? props.theme.buttonPrimaryBackground || '#0088cc' : 'transparent'};
    color: ${props => (props.$active ? '#ffffff' : props.theme.textSecondary || '#8a95a5')};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover {
        color: #ffffff;
    }
`;

const ChartSvgWrapper = styled.div`
    width: 100%;
    height: 150px;
    position: relative;
    cursor: crosshair;
`;

const ActivitySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 4px;
`;

const SectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const DateGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const DateLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    margin-top: 4px;
`;

const TransactionItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
`;

const TxLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const IconCircle = styled.div<{ $type: 'send' | 'receive' | 'swap' }>`
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props =>
        props.$type === 'receive'
            ? 'rgba(52, 199, 89, 0.15)'
            : props.$type === 'send'
            ? 'rgba(255, 59, 48, 0.15)'
            : 'rgba(0, 136, 204, 0.15)'};
    color: ${props =>
        props.$type === 'receive' ? '#34c759' : props.$type === 'send' ? '#ff3b30' : '#0088cc'};
`;

const TxMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const TxType = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const TxDetail = styled.span`
    font-size: 12px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const TxRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
`;

const TxAmount = styled.span<{ $type: 'send' | 'receive' | 'swap' }>`
    font-size: 14px;
    font-weight: 700;
    color: ${props =>
        props.$type === 'receive'
            ? props.theme.accentGreen || '#34c759'
            : props.theme.textPrimary || '#ffffff'};
`;

const TxTime = styled.span`
    font-size: 11px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 36px 16px;
    gap: 6px;
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
`;

const EmptyTitle = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const EmptySubtitle = styled.span`
    font-size: 12px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

type Timeframe = '1H' | '1D' | '1W' | '1M';

interface ChartPoint {
    x: number;
    y: number;
    price: number;
}

function generateChartData(
    symbol: string,
    timeframe: Timeframe,
    currentPrice: number,
    change24h: number = 0
): { points: ChartPoint[]; minPrice: number; maxPrice: number } {
    const count = 28;
    let seed = 0;
    const key = `${symbol.toUpperCase()}_${timeframe}`;
    for (let i = 0; i < key.length; i++) {
        seed = (seed * 31 + key.charCodeAt(i)) % 1000000;
    }

    function pseudoRandom(offset: number) {
        const x = Math.sin(seed + offset * 9.17) * 10000;
        return x - Math.floor(x);
    }

    let trendFactor = (change24h || 1) / 100;
    if (timeframe === '1H') trendFactor *= 0.18;
    if (timeframe === '1W') trendFactor *= 2.4;
    if (timeframe === '1M') trendFactor *= 4.8;

    const startPrice = Math.max(0.0001, currentPrice / (1 + trendFactor));
    const rawPrices: number[] = [];

    for (let i = 0; i < count; i++) {
        const progress = i / (count - 1);
        const base = startPrice + (currentPrice - startPrice) * progress;
        const noise = (pseudoRandom(i) - 0.48) * (currentPrice * 0.032);
        const wave = Math.sin(progress * Math.PI * 3 + seed) * (currentPrice * 0.02);
        const p = i === count - 1 ? currentPrice : Math.max(0.0001, base + noise + wave);
        rawPrices.push(p);
    }

    const minPrice = Math.min(...rawPrices);
    const maxPrice = Math.max(...rawPrices);
    const priceRange = maxPrice - minPrice || 1;

    const width = 500;
    const height = 140;
    const padding = 10;

    const points: ChartPoint[] = rawPrices.map((p, idx) => {
        const x = padding + (idx / (count - 1)) * (width - 2 * padding);
        const y = height - padding - ((p - minPrice) / priceRange) * (height - 2 * padding);
        return {
            x,
            y,
            price: p
        };
    });

    return { points, minPrice, maxPrice };
}

function createSvgPath(points: ChartPoint[]): { linePath: string; areaPath: string } {
    if (points.length === 0) return { linePath: '', areaPath: '' };

    let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(
            1
        )}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} 150 L ${firstPoint.x.toFixed(
        1
    )} 150 Z`;

    return { linePath, areaPath };
}

function formatShortAddress(addr?: string): string {
    if (!addr) return '';
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function getDateLabel(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) return 'Today';

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'Yesterday';

    return date
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        .toUpperCase();
}

function formatTxTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function getUiType(txType: GemKeepTransaction['type']): 'send' | 'receive' | 'swap' {
    if (txType === 'receive' || txType === 'deposit' || txType === 'buy') {
        return 'receive';
    }
    if (txType === 'send' || txType === 'withdraw' || txType === 'sell') {
        return 'send';
    }
    return 'swap';
}

function getTxDetails(tx: GemKeepTransaction) {
    const uiType = getUiType(tx.type);

    let typeText = '';
    let detailText = tx.description || '';
    let amountText = '';

    if (tx.type === 'receive' || tx.type === 'deposit') {
        typeText = `Received ${tx.asset}`;
        if (!detailText) {
            detailText = tx.sender ? `From ${formatShortAddress(tx.sender)}` : 'Received';
        }
        amountText = `+ ${tx.amount} ${tx.asset}`;
    } else if (tx.type === 'send' || tx.type === 'withdraw') {
        typeText = `Sent ${tx.asset}`;
        if (!detailText) {
            detailText = tx.recipient ? `To ${formatShortAddress(tx.recipient)}` : 'Sent';
        }
        amountText = `- ${tx.amount} ${tx.asset}`;
    } else if (tx.type === 'swap') {
        typeText = `Swapped ${tx.asset} for ${tx.secondAsset || ''}`;
        if (!detailText) {
            detailText = 'GemKeep Swap';
        }
        amountText = `${tx.amount} ${tx.asset} → ${tx.secondAmount ?? ''} ${tx.secondAsset ?? ''}`;
    } else if (tx.type === 'buy') {
        typeText = `Bought ${tx.asset}`;
        amountText = `+ ${tx.amount} ${tx.asset}`;
    } else if (tx.type === 'sell') {
        typeText = `Sold ${tx.asset}`;
        amountText = `- ${tx.amount} ${tx.asset}`;
    } else {
        typeText = `${tx.type.toUpperCase()} ${tx.asset}`;
        amountText = `${tx.amount} ${tx.asset}`;
    }

    return { uiType, typeText, detailText, amountText };
}

function renderTxIcon(uiType: 'send' | 'receive' | 'swap') {
    if (uiType === 'receive') return <ReceiveIcon size={18} />;
    if (uiType === 'send') return <SendIcon size={18} />;
    return <SwapIcon size={18} />;
}

export interface CoinHeaderProps {
    symbol: string;
    onBack: () => void;
    onSend: () => void;
    onReceive: () => void;
    onSwap: () => void;
    onTrade?: () => void;
}

export const CoinHeader: React.FC<CoinHeaderProps> = ({
    symbol,
    onBack,
    onSend,
    onReceive,
    onSwap,
    onTrade
}) => {
    const { t } = useTranslation();
    const { activeWalletId, assets, history } = useGemKeepState();
    const [timeframe, setTimeframe] = useState<Timeframe>('1D');
    const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

    const isTon = symbol.toUpperCase() === 'TON';
    const isUsdt = symbol.toUpperCase() === 'USDT';

    const asset = assets.find(a => a.symbol.toUpperCase() === symbol.toUpperCase()) ||
        assets[0] || {
            symbol,
            name: isTon ? 'Toncoin' : isUsdt ? 'Tether USD' : symbol,
            balance: isTon ? 1000 : isUsdt ? 4350 : 0,
            priceUsd: isTon ? 5.65 : isUsdt ? 1.0 : 1.0,
            decimals: 9,
            change24h: 0.0
        };

    const formattedBalance = `${asset.balance.toLocaleString('en-US', {
        maximumFractionDigits: asset.decimals > 4 ? 4 : asset.decimals
    })} ${asset.symbol}`;

    const formattedFiat = `$${(asset.balance * asset.priceUsd).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} USD`;

    const change24h = asset.change24h ?? 0;
    const isNegativeChange = change24h < 0;
    const changeFormatted = `${isNegativeChange ? '' : '+'}${change24h.toFixed(2)}%`;

    const chartData = useMemo(() => {
        return generateChartData(asset.symbol, timeframe, asset.priceUsd, change24h);
    }, [asset.symbol, timeframe, asset.priceUsd, change24h]);

    const { linePath, areaPath } = useMemo(() => {
        return createSvgPath(chartData.points);
    }, [chartData.points]);

    // Filter transactions for this asset in active wallet
    const assetHistory = useMemo(() => {
        const symbolNorm = symbol.toUpperCase();
        return history.filter(tx => {
            const isMatchingWallet = tx.walletId
                ? tx.walletId === activeWalletId
                : activeWalletId === 'main-wallet';
            if (!isMatchingWallet) return false;
            const txAssetNorm = (tx.asset || '').toUpperCase();
            const txSecondAssetNorm = (tx.secondAsset || '').toUpperCase();

            if (tx.type === 'swap') {
                return txAssetNorm === symbolNorm || txSecondAssetNorm === symbolNorm;
            }
            return txAssetNorm === symbolNorm;
        });
    }, [history, activeWalletId, symbol]);

    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: GemKeepTransaction[] } = {};
        const labelOrder: string[] = [];

        assetHistory.forEach(tx => {
            const label = getDateLabel(tx.timestamp);
            if (!groups[label]) {
                groups[label] = [];
                labelOrder.push(label);
            }
            groups[label].push(tx);
        });

        return labelOrder.map(label => ({
            label,
            items: groups[label]
        }));
    }, [assetHistory]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const relativeX = (mouseX / rect.width) * 500;

        let closest = chartData.points[0];
        let minDist = Math.abs(closest.x - relativeX);
        for (const pt of chartData.points) {
            const dist = Math.abs(pt.x - relativeX);
            if (dist < minDist) {
                minDist = dist;
                closest = pt;
            }
        }
        setHoveredPoint(closest);
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };

    const displayChartPrice = hoveredPoint
        ? `$${hoveredPoint.price.toFixed(hoveredPoint.price < 1 ? 4 : 2)}`
        : `$${asset.priceUsd.toFixed(asset.priceUsd < 1 ? 4 : 2)}`;

    const chartAccentColor = isNegativeChange ? '#ff3b30' : '#0088cc';

    return (
        <Container>
            <HeaderNav onClick={onBack}>
                <ChevronLeftIcon size={24} />
                <span>
                    {asset.name} ({asset.symbol})
                </span>
            </HeaderNav>

            <CoinCard>
                {isTon ? (
                    <TonIcon size={56} />
                ) : isUsdt ? (
                    <UsdtIcon size={56} />
                ) : (
                    <GenericTokenBadge>{asset.symbol.slice(0, 3)}</GenericTokenBadge>
                )}
                <CoinAmount>{formattedBalance}</CoinAmount>
                <CoinFiat>{formattedFiat}</CoinFiat>

                <PriceRateRow>
                    <PriceTag>
                        1 {asset.symbol} = ${asset.priceUsd.toFixed(asset.priceUsd < 1 ? 4 : 2)}
                    </PriceTag>
                    <ChangePill $isNegative={isNegativeChange}>{changeFormatted}</ChangePill>
                </PriceRateRow>

                <ActionsRow>
                    <ActionBtn onClick={onSend}>
                        <SendIcon size={18} />
                        {t('action_send') || 'Send'}
                    </ActionBtn>
                    <ActionBtn onClick={onReceive}>
                        <ReceiveIcon size={18} />
                        {t('action_receive') || 'Receive'}
                    </ActionBtn>
                    <ActionBtn onClick={onSwap}>
                        <SwapIcon size={18} />
                        {t('action_swap') || 'Swap'}
                    </ActionBtn>
                    {onTrade && (
                        <ActionBtn onClick={onTrade}>
                            <TradingIcon size={18} />
                            {t('action_trade') || 'Trade'}
                        </ActionBtn>
                    )}
                </ActionsRow>
            </CoinCard>

            <ChartCard>
                <ChartHeader>
                    <ChartPriceDisplay>
                        <ChartCurrentPrice>{displayChartPrice}</ChartCurrentPrice>
                        <ChartSubLabel>
                            {hoveredPoint ? 'Selected' : `${timeframe} Trend`}
                        </ChartSubLabel>
                    </ChartPriceDisplay>

                    <TimeframeSelector>
                        {(['1H', '1D', '1W', '1M'] as Timeframe[]).map(tf => (
                            <TimeframeButton
                                key={tf}
                                type="button"
                                $active={timeframe === tf}
                                onClick={() => {
                                    setTimeframe(tf);
                                    setHoveredPoint(null);
                                }}
                            >
                                {tf}
                            </TimeframeButton>
                        ))}
                    </TimeframeSelector>
                </ChartHeader>

                <ChartSvgWrapper onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 500 150"
                        preserveAspectRatio="none"
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            <linearGradient
                                id={`gradient_${asset.symbol}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor={chartAccentColor} stopOpacity="0.35" />
                                <stop
                                    offset="100%"
                                    stopColor={chartAccentColor}
                                    stopOpacity="0.0"
                                />
                            </linearGradient>
                        </defs>

                        {/* Area fill */}
                        <path d={areaPath} fill={`url(#gradient_${asset.symbol})`} />

                        {/* Line curve */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke={chartAccentColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Hover indicator dot */}
                        {hoveredPoint && (
                            <>
                                <line
                                    x1={hoveredPoint.x}
                                    y1={0}
                                    x2={hoveredPoint.x}
                                    y2={150}
                                    stroke="rgba(255, 255, 255, 0.2)"
                                    strokeDasharray="3 3"
                                    strokeWidth="1"
                                />
                                <circle
                                    cx={hoveredPoint.x}
                                    cy={hoveredPoint.y}
                                    r="5"
                                    fill={chartAccentColor}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                />
                            </>
                        )}
                    </svg>
                </ChartSvgWrapper>
            </ChartCard>

            <ActivitySection>
                <SectionTitle>{t('history_title') || 'Activity'}</SectionTitle>

                {assetHistory.length === 0 ? (
                    <EmptyContainer>
                        <EmptyTitle>{t('history_empty') || `No activity for ${asset.symbol} yet`}</EmptyTitle>
                        <EmptySubtitle>
                            {t('history_empty_desc') || 'Transactions with this token will appear here.'}
                        </EmptySubtitle>
                    </EmptyContainer>
                ) : (
                    groupedTransactions.map(group => (
                        <DateGroup key={group.label}>
                            <DateLabel>{group.label}</DateLabel>
                            {group.items.map(tx => {
                                const { uiType, typeText, detailText, amountText } =
                                    getTxDetails(tx);
                                return (
                                    <TransactionItem key={tx.id}>
                                        <TxLeft>
                                            <IconCircle $type={uiType}>
                                                {renderTxIcon(uiType)}
                                            </IconCircle>
                                            <TxMeta>
                                                <TxType>{typeText}</TxType>
                                                <TxDetail>{detailText}</TxDetail>
                                            </TxMeta>
                                        </TxLeft>
                                        <TxRight>
                                            <TxAmount $type={uiType}>{amountText}</TxAmount>
                                            <TxTime>{formatTxTime(tx.timestamp)}</TxTime>
                                        </TxRight>
                                    </TransactionItem>
                                );
                            })}
                        </DateGroup>
                    ))
                )}
            </ActivitySection>
        </Container>
    );
};
