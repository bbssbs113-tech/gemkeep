import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BottomDrawer } from '../shared/BottomDrawer';
import { Button } from '../fields/Button';
import { Input } from '../fields/Input';
import { SwapIcon, TonIcon, UsdtIcon } from '../Icon';
import { useGemKeepState, DEFAULT_SWAP_FEE_PERCENT, roundAmount } from '../../state/gemkeep';
import { useTranslation } from '../../hooks/translation';

const SwapContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 8px;
`;

const TokenCard = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const BalanceAction = styled.span`
    cursor: pointer;
    font-size: 12px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    transition: color 0.15s ease;

    &:hover {
        color: ${props => props.theme.textPrimary || '#ffffff'};
    }
`;

const CardRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

const TokenSelector = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.14);
    }
`;

const SwapDivider = styled.div`
    display: flex;
    justify-content: center;
    margin: -6px 0;
    position: relative;
    z-index: 2;
`;

const SwapCircle = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${props => props.theme.buttonPrimaryBackground || '#0088cc'};
    border: 3px solid ${props => props.theme.backgroundPage || '#1c2430'};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.15s ease;

    &:hover {
        opacity: 0.9;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;

const RateRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    padding: 2px 0;
`;

const ErrorMessage = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.accentRed || '#ff3b30'};
    padding: 10px 12px;
    background: rgba(255, 59, 48, 0.1);
    border-radius: 10px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
`;

const SuccessMessage = styled.div`
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.accentGreen || '#34c759'};
    padding: 10px 12px;
    background: rgba(52, 199, 89, 0.12);
    border-radius: 10px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
`;

export interface SwapViewProps {
    isOpen: boolean;
    onClose: () => void;
    fromAssetSymbol?: string;
}

function renderAssetIcon(symbol: string, size = 22) {
    const s = symbol.toUpperCase();
    if (s === 'USDT') return <UsdtIcon size={size} />;
    return <TonIcon size={size} />;
}

export const SwapView: React.FC<SwapViewProps> = ({ isOpen, onClose, fromAssetSymbol }) => {
    const { t } = useTranslation();
    const { assets, swapAssets } = useGemKeepState();

    const [fromSymbol, setFromSymbol] = useState(fromAssetSymbol || 'TON');
    const [toSymbol, setToSymbol] = useState(
        (fromAssetSymbol || 'TON').toUpperCase() === 'TON' ? 'USDT' : 'TON'
    );
    const [payAmount, setPayAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        if (fromAssetSymbol) {
            const norm = fromAssetSymbol.toUpperCase();
            setFromSymbol(norm);
            setToSymbol(norm === 'TON' ? 'USDT' : 'TON');
        }
    }, [fromAssetSymbol]);

    useEffect(() => {
        if (!isOpen) {
            setError(null);
            setSuccessMsg(null);
            setPayAmount('');
        }
    }, [isOpen]);

    const fromAsset = assets.find(a => a.symbol.toUpperCase() === fromSymbol.toUpperCase()) ||
        assets[0] || {
            symbol: 'TON',
            name: 'Toncoin',
            balance: 1000,
            decimals: 9,
            priceUsd: 5.65
        };

    const toAsset = assets.find(a => a.symbol.toUpperCase() === toSymbol.toUpperCase()) ||
        assets.find(a => a.symbol.toUpperCase() !== fromAsset.symbol.toUpperCase()) ||
        assets[1] ||
        assets[0] || {
            symbol: 'USDT',
            name: 'Tether USD',
            balance: 4350,
            decimals: 6,
            priceUsd: 1.0
        };

    const handleFlip = () => {
        setError(null);
        setSuccessMsg(null);
        const prevFrom = fromSymbol;
        const prevTo = toSymbol;
        setFromSymbol(prevTo);
        setToSymbol(prevFrom);
    };

    const handleSelectNextFrom = () => {
        if (assets.length <= 1) return;
        const currentIndex = assets.findIndex(
            a => a.symbol.toUpperCase() === fromSymbol.toUpperCase()
        );
        const nextIndex = (currentIndex + 1) % assets.length;
        const nextAsset = assets[nextIndex];
        setFromSymbol(nextAsset.symbol);
        if (nextAsset.symbol.toUpperCase() === toSymbol.toUpperCase()) {
            const alternate = assets.find(
                a => a.symbol.toUpperCase() !== nextAsset.symbol.toUpperCase()
            );
            if (alternate) setToSymbol(alternate.symbol);
        }
        setError(null);
    };

    const handleSelectNextTo = () => {
        if (assets.length <= 1) return;
        const currentIndex = assets.findIndex(
            a => a.symbol.toUpperCase() === toSymbol.toUpperCase()
        );
        const nextIndex = (currentIndex + 1) % assets.length;
        const nextAsset = assets[nextIndex];
        setToSymbol(nextAsset.symbol);
        if (nextAsset.symbol.toUpperCase() === fromSymbol.toUpperCase()) {
            const alternate = assets.find(
                a => a.symbol.toUpperCase() !== nextAsset.symbol.toUpperCase()
            );
            if (alternate) setFromSymbol(alternate.symbol);
        }
        setError(null);
    };

    const handleMaxClick = () => {
        setError(null);
        setPayAmount(fromAsset.balance.toString());
    };

    // Value and Fee Calculations
    const feePercent = DEFAULT_SWAP_FEE_PERCENT; // 0.5%
    const parsedPayAmount = parseFloat(payAmount.trim());
    const isValidPayAmount =
        !isNaN(parsedPayAmount) && isFinite(parsedPayAmount) && parsedPayAmount > 0;

    let calculatedReceive = '';
    if (
        isValidPayAmount &&
        fromAsset &&
        toAsset &&
        fromAsset.symbol.toUpperCase() !== toAsset.symbol.toUpperCase() &&
        toAsset.priceUsd > 0
    ) {
        const grossUsd = parsedPayAmount * fromAsset.priceUsd;
        const feeUsd = grossUsd * (feePercent / 100);
        const netUsd = grossUsd - feeUsd;
        const rawToAmount = netUsd / toAsset.priceUsd;
        const finalToAmount = roundAmount(rawToAmount, toAsset.decimals);
        calculatedReceive = finalToAmount.toString();
    }

    const exchangeRate =
        fromAsset && toAsset && toAsset.priceUsd > 0
            ? (fromAsset.priceUsd / toAsset.priceUsd).toFixed(4)
            : '0';

    const handleSwap = () => {
        setError(null);
        setSuccessMsg(null);

        const trimmed = payAmount.trim();
        if (!trimmed) {
            setError('Please enter an amount to swap.');
            return;
        }

        if (!isValidPayAmount) {
            setError('Invalid amount. Must be a positive number.');
            return;
        }

        if (fromAsset.symbol.toUpperCase() === toAsset.symbol.toUpperCase()) {
            setError('Cannot swap between the same asset.');
            return;
        }

        if (parsedPayAmount > fromAsset.balance) {
            setError(`Insufficient ${fromAsset.symbol} balance for swap.`);
            return;
        }

        const parts = trimmed.split('.');
        if (parts.length === 2 && parts[1].length > fromAsset.decimals) {
            setError(`Amount cannot have more than ${fromAsset.decimals} decimal places.`);
            return;
        }

        const result = swapAssets({
            fromAsset: fromAsset.symbol,
            fromAmount: parsedPayAmount,
            toAsset: toAsset.symbol,
            feePercent
        });

        if (result.success) {
            setError(null);
            setSuccessMsg(
                `Swapped ${parsedPayAmount} ${fromAsset.symbol} for ${calculatedReceive} ${toAsset.symbol}!`
            );
            setPayAmount('');
            setTimeout(() => {
                setSuccessMsg(null);
                onClose();
            }, 900);
        } else {
            setError(result.error);
        }
    };

    const isConfirmDisabled =
        !isValidPayAmount ||
        parsedPayAmount > fromAsset.balance ||
        fromAsset.symbol.toUpperCase() === toAsset.symbol.toUpperCase();

    const formattedFromBalance = `${fromAsset.balance.toLocaleString('en-US', {
        maximumFractionDigits: fromAsset.decimals > 4 ? 4 : fromAsset.decimals
    })} ${fromAsset.symbol}`;

    const formattedToBalance = `${toAsset.balance.toLocaleString('en-US', {
        maximumFractionDigits: toAsset.decimals > 4 ? 4 : toAsset.decimals
    })} ${toAsset.symbol}`;

    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={t('swap_title') || 'Swap Tokens'}>
            <SwapContainer>
                <TokenCard>
                    <CardHeader>
                        <span>{t('swap_you_pay') || 'You Pay'}</span>
                        <BalanceAction onClick={handleMaxClick} title="Click to use Max">
                            {t('swap_balance') || 'Balance'}: {formattedFromBalance} ({t('send_max') || 'Max'})
                        </BalanceAction>
                    </CardHeader>
                    <CardRow>
                        <Input
                            type="number"
                            value={payAmount}
                            onChange={e => {
                                setPayAmount(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="0.0"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: 22,
                                fontWeight: 700
                            }}
                        />
                        <TokenSelector
                            type="button"
                            onClick={handleSelectNextFrom}
                            title="Click to switch token"
                        >
                            {renderAssetIcon(fromAsset.symbol)}
                            {fromAsset.symbol}
                        </TokenSelector>
                    </CardRow>
                </TokenCard>

                <SwapDivider>
                    <SwapCircle type="button" onClick={handleFlip} title="Reverse swap direction">
                        <SwapIcon size={18} />
                    </SwapCircle>
                </SwapDivider>

                <TokenCard>
                    <CardHeader>
                        <span>{t('swap_you_receive') || 'You Receive (Est.)'}</span>
                        <span>{t('swap_balance') || 'Balance'}: {formattedToBalance}</span>
                    </CardHeader>
                    <CardRow>
                        <Input
                            type="number"
                            value={calculatedReceive}
                            readOnly
                            placeholder="0.0"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: 22,
                                fontWeight: 700
                            }}
                        />
                        <TokenSelector
                            type="button"
                            onClick={handleSelectNextTo}
                            title="Click to switch token"
                        >
                            {renderAssetIcon(toAsset.symbol)}
                            {toAsset.symbol}
                        </TokenSelector>
                    </CardRow>
                </TokenCard>

                <RateRow>
                    <span>{t('swap_rate') || 'Rate'}</span>
                    <span>
                        1 {fromAsset.symbol} ≈ {exchangeRate} {toAsset.symbol}
                    </span>
                </RateRow>

                <RateRow>
                    <span>{t('swap_fee') || 'Fee'} ({feePercent}%)</span>
                    <span>
                        {isValidPayAmount
                            ? `~${roundAmount(parsedPayAmount * (feePercent / 100), 4)} ${
                                  fromAsset.symbol
                              }`
                            : `0.00 ${fromAsset.symbol}`}
                    </span>
                </RateRow>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {successMsg && <SuccessMessage>{successMsg}</SuccessMessage>}

                <Button primary fullWidth onClick={handleSwap} disabled={isConfirmDisabled}>
                    {t('swap_button') || 'Swap Tokens'}
                </Button>
            </SwapContainer>
        </BottomDrawer>
    );
};
