import React, { useMemo } from 'react';
import styled from 'styled-components';
import { SendIcon, ReceiveIcon, SwapIcon, TradingIcon } from '../Icon';
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
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const DateGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const DateLabel = styled.div`
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    margin-top: 8px;
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
    width: 40px;
    height: 40px;
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
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const TxDetail = styled.span`
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const TxRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
`;

const TxAmount = styled.span<{ $type: 'send' | 'receive' | 'swap' | 'trade' }>`
    font-size: 15px;
    font-weight: 700;
    color: ${props =>
        props.$type === 'receive'
            ? props.theme.accentGreen || '#34c759'
            : props.theme.textPrimary || '#ffffff'};
`;

const TxTime = styled.span`
    font-size: 12px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    gap: 8px;
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    margin-top: 8px;
`;

const EmptyTitle = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const EmptySubtitle = styled.span`
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

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
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getUiType(txType: GemKeepTransaction['type']): 'send' | 'receive' | 'swap' | 'trade' {
    if (txType === 'receive' || txType === 'deposit' || txType === 'buy') {
        return 'receive';
    }
    if (txType === 'send' || txType === 'withdraw' || txType === 'sell') {
        return 'send';
    }
    if (txType === 'trade') {
        return 'trade';
    }
    return 'swap';
}

function getTxDetails(tx: GemKeepTransaction) {
    const uiType = getUiType(tx.type);

    let typeText = '';
    let detailText = tx.description || '';
    let amountText = '';

    if (tx.type === 'receive' || tx.type === 'deposit') {
        typeText = tx.description?.startsWith('Developer')
            ? tx.description
            : `Received ${tx.asset}`;
        if (!detailText || tx.description?.startsWith('Developer')) {
            detailText = tx.description?.startsWith('Developer')
                ? 'Dev Tool'
                : tx.sender
                ? `From ${formatShortAddress(tx.sender)}`
                : 'Received';
        }
        amountText = `+ ${tx.amount} ${tx.asset}`;
    } else if (tx.type === 'send' || tx.type === 'withdraw') {
        typeText = tx.description?.startsWith('Developer') ? tx.description : `Sent ${tx.asset}`;
        if (!detailText || tx.description?.startsWith('Developer')) {
            detailText = tx.description?.startsWith('Developer')
                ? 'Dev Tool'
                : tx.recipient
                ? `To ${formatShortAddress(tx.recipient)}`
                : 'Sent';
        }
        amountText = `- ${tx.amount} ${tx.asset}`;
    } else if (tx.type === 'swap') {
        typeText = `Swapped ${tx.asset} for ${tx.secondAsset || ''}`;
        if (!detailText) {
            detailText = 'GemKeep Swap';
        }
        amountText = `${tx.amount} ${tx.asset} → ${tx.secondAmount ?? ''} ${tx.secondAsset ?? ''}`;
    } else if (tx.type === 'trade') {
        typeText = `Trade ${tx.asset}/${tx.secondAsset || 'USDT'}`;
        if (!detailText) {
            detailText = 'Virtual Binary Option';
        }
        amountText = `${tx.amount} ${tx.secondAsset || 'USDT'}`;
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

function renderTxIcon(uiType: 'send' | 'receive' | 'swap' | 'trade') {
    if (uiType === 'receive') return <ReceiveIcon size={20} />;
    if (uiType === 'send') return <SendIcon size={20} />;
    if (uiType === 'trade') return <TradingIcon size={20} color="#0088cc" />;
    return <SwapIcon size={20} />;
}

export const Activity: React.FC = () => {
    const { t } = useTranslation();
    const { activeWalletId, history } = useGemKeepState();

    const walletHistory = useMemo(() => {
        return history.filter(tx =>
            tx.walletId ? tx.walletId === activeWalletId : activeWalletId === 'main-wallet'
        );
    }, [history, activeWalletId]);

    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: GemKeepTransaction[] } = {};
        const labelOrder: string[] = [];

        walletHistory.forEach(tx => {
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
    }, [walletHistory]);

    return (
        <Container>
            <Title>{t('history_title') || 'History'}</Title>

            {walletHistory.length === 0 ? (
                <EmptyContainer>
                    <EmptyTitle>{t('history_empty') || 'No activity yet'}</EmptyTitle>
                    <EmptySubtitle>{t('history_empty_desc') || 'Your transaction history will appear here.'}</EmptySubtitle>
                </EmptyContainer>
            ) : (
                groupedTransactions.map(group => (
                    <DateGroup key={group.label}>
                        <DateLabel>{group.label}</DateLabel>
                        {group.items.map(tx => {
                            const { uiType, typeText, detailText, amountText } = getTxDetails(tx);
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
        </Container>
    );
};
