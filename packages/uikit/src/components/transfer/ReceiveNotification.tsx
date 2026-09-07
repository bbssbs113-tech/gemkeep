import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BottomDrawer } from '../shared/BottomDrawer';
import { Button } from '../fields/Button';
import { Input } from '../fields/Input';
import { CopyIcon, QrCodeIcon, CheckIcon, TonIcon, UsdtIcon } from '../Icon';
import { useGemKeepState } from '../../state/gemkeep';
import { useTranslation } from '../../hooks/translation';

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding-top: 4px;
`;

const AssetSelectRow = styled.div`
    display: flex;
    gap: 8px;
    width: 100%;
    margin-bottom: 2px;
`;

const AssetChip = styled.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 20px;
    background: ${props =>
        props.$active
            ? props.theme.buttonPrimaryBackground || '#0088cc'
            : 'rgba(255, 255, 255, 0.08)'};
    color: #ffffff;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background: ${props =>
            props.$active
                ? props.theme.buttonPrimaryBackground || '#0088cc'
                : 'rgba(255, 255, 255, 0.14)'};
    }
`;

const QrBox = styled.div`
    width: 160px;
    height: 160px;
    background: #ffffff;
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
`;

const AddressBox = styled.div`
    width: 100%;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: monospace;
    font-size: 13px;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    word-break: break-all;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 6px;
`;

const FieldLabel = styled.label`
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const PresetsRow = styled.div`
    display: flex;
    gap: 8px;
    width: 100%;
`;

const PresetButton = styled.button`
    flex: 1;
    padding: 6px 0;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: none;
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
    }
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

const ActionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

export interface ReceiveNotificationProps {
    isOpen: boolean;
    onClose: () => void;
    address?: string;
    assetSymbol?: string;
}

function renderAssetIcon(symbol: string) {
    const s = symbol.toUpperCase();
    if (s === 'USDT') return <UsdtIcon size={18} />;
    return <TonIcon size={18} />;
}

export const ReceiveNotification: React.FC<ReceiveNotificationProps> = ({
    isOpen,
    onClose,
    address,
    assetSymbol
}) => {
    const { t } = useTranslation();
    const { activeWallet, receiveAsset, assets } = useGemKeepState();

    const [selectedSymbol, setSelectedSymbol] = useState(assetSymbol || 'TON');
    const [amount, setAmount] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        if (assetSymbol) {
            setSelectedSymbol(assetSymbol);
        }
    }, [assetSymbol]);

    useEffect(() => {
        if (!isOpen) {
            setError(null);
            setSuccessMsg(null);
            setAmount('');
        }
    }, [isOpen]);

    const displayAddress =
        address || activeWallet?.address || 'EQGEMKEEPMAIN0000000000000000000000000000000000';

    const activeAsset = assets.find(a => a.symbol.toUpperCase() === selectedSymbol.toUpperCase()) ||
        assets[0] || {
            symbol: 'TON',
            name: 'Toncoin',
            balance: 0,
            decimals: 9,
            priceUsd: 5.65
        };

    const handleCopy = () => {
        navigator.clipboard?.writeText(displayAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReceive = () => {
        setError(null);
        setSuccessMsg(null);

        const trimmed = amount.trim();
        if (!trimmed) {
            setError('Please enter an amount to receive.');
            return;
        }

        const amountNum = parseFloat(trimmed);

        if (isNaN(amountNum) || !isFinite(amountNum) || amountNum <= 0) {
            setError('Invalid amount. Must be a positive number.');
            return;
        }

        const parts = trimmed.split('.');
        if (parts.length === 2 && parts[1].length > activeAsset.decimals) {
            setError(`Amount cannot have more than ${activeAsset.decimals} decimal places.`);
            return;
        }

        const result = receiveAsset({
            asset: activeAsset.symbol,
            amount: amountNum,
            sender: 'EQVIRTUALFAUCET000000000000000000000000000000'
        });

        if (result.success) {
            setError(null);
            setSuccessMsg(`Received +${amountNum} ${activeAsset.symbol}!`);
            setAmount('');
            setTimeout(() => {
                setSuccessMsg(null);
                onClose();
            }, 900);
        } else {
            setError(result.error);
        }
    };

    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={`${t('receive_title') || 'Receive'} ${activeAsset.symbol}`}>
            <ContentWrapper>
                {assets.length > 1 && (
                    <AssetSelectRow>
                        {assets.map(a => (
                            <AssetChip
                                key={a.id || a.symbol}
                                $active={
                                    a.symbol.toUpperCase() === activeAsset.symbol.toUpperCase()
                                }
                                onClick={() => {
                                    setSelectedSymbol(a.symbol);
                                    setError(null);
                                    setSuccessMsg(null);
                                }}
                                type="button"
                            >
                                {renderAssetIcon(a.symbol)}
                                <span>{a.symbol}</span>
                            </AssetChip>
                        ))}
                    </AssetSelectRow>
                )}

                <QrBox>
                    <QrCodeIcon size={130} color="#0088cc" />
                </QrBox>

                <AddressBox onClick={handleCopy} title="Click to copy">
                    <span>{displayAddress}</span>
                </AddressBox>

                <FieldGroup>
                    <FieldLabel>{t('receive_amount_label') || 'Receive / Deposit Amount'} ({activeAsset.symbol})</FieldLabel>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => {
                            setAmount(e.target.value);
                            if (error) setError(null);
                        }}
                    />
                    <PresetsRow>
                        {[10, 50, 100, 500].map(val => (
                            <PresetButton
                                key={val}
                                type="button"
                                onClick={() => {
                                    setAmount(val.toString());
                                    if (error) setError(null);
                                }}
                            >
                                +{val}
                            </PresetButton>
                        ))}
                    </PresetsRow>
                </FieldGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {successMsg && <SuccessMessage>{successMsg}</SuccessMessage>}

                <ActionsContainer>
                    <Button
                        primary
                        fullWidth
                        onClick={handleReceive}
                        disabled={!amount || parseFloat(amount) <= 0}
                    >
                        {t('receive_confirm') || 'Confirm & Receive'}
                    </Button>

                    <Button secondary fullWidth onClick={handleCopy}>
                        {copied ? (
                            <>
                                <CheckIcon size={18} style={{ marginRight: 8 }} />
                                {t('receive_copied') || 'Address Copied!'}
                            </>
                        ) : (
                            <>
                                <CopyIcon size={18} style={{ marginRight: 8 }} />
                                {t('receive_copy_address') || 'Copy Address'}
                            </>
                        )}
                    </Button>
                </ActionsContainer>
            </ContentWrapper>
        </BottomDrawer>
    );
};
