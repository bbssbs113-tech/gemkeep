import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BottomDrawer } from '../shared/BottomDrawer';
import { Button } from '../fields/Button';
import { Input } from '../fields/Input';
import { TonIcon, UsdtIcon } from '../Icon';
import { useGemKeepState } from '../../state/gemkeep';
import { useTranslation } from '../../hooks/translation';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 8px;
`;

const FieldLabel = styled.label`
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    margin-bottom: 4px;
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const AssetSelectRow = styled.div`
    display: flex;
    gap: 8px;
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

const AvailableText = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.textPrimary || '#ffffff'};
    }
`;

const FeeInfo = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    padding: 8px 0;
`;

const ErrorMessage = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.accentRed || '#ff3b30'};
    padding: 10px 12px;
    background: rgba(255, 59, 48, 0.1);
    border-radius: 10px;
    text-align: center;
`;

export interface SendNotificationProps {
    isOpen: boolean;
    onClose: () => void;
    assetSymbol?: string;
}

function renderAssetIcon(symbol: string) {
    const s = symbol.toUpperCase();
    if (s === 'USDT') return <UsdtIcon size={18} />;
    return <TonIcon size={18} />;
}

export const SendNotification: React.FC<SendNotificationProps> = ({
    isOpen,
    onClose,
    assetSymbol
}) => {
    const { t } = useTranslation();
    const { assets, sendAsset } = useGemKeepState();

    const [selectedSymbol, setSelectedSymbol] = useState(assetSymbol || 'TON');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (assetSymbol) {
            setSelectedSymbol(assetSymbol);
        }
    }, [assetSymbol]);

    useEffect(() => {
        if (!isOpen) {
            setError(null);
        }
    }, [isOpen]);

    const activeAsset = assets.find(a => a.symbol.toUpperCase() === selectedSymbol.toUpperCase()) ||
        assets[0] || {
            symbol: 'TON',
            balance: 0,
            decimals: 9,
            priceUsd: 5.65
        };

    const handleMaxClick = () => {
        if (activeAsset.symbol === 'TON') {
            const maxVal = Math.max(0, activeAsset.balance - 0.005);
            setAmount(maxVal > 0 ? maxVal.toString() : '0');
        } else {
            setAmount(activeAsset.balance.toString());
        }
        setError(null);
    };

    const handleSend = () => {
        setError(null);
        const amountNum = parseFloat(amount);

        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount greater than 0.');
            return;
        }

        if (!recipient || recipient.trim() === '') {
            setError('Recipient address is required.');
            return;
        }

        const result = sendAsset({
            asset: activeAsset.symbol,
            amount: amountNum,
            recipient: recipient.trim(),
            fee: 0.005
        });

        if (result.success) {
            setError(null);
            setRecipient('');
            setAmount('');
            setComment('');
            onClose();
        } else {
            setError(result.error);
        }
    };

    const isConfirmDisabled = !recipient.trim() || !amount || parseFloat(amount) <= 0;

    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={t('send_title') || 'Send TON / Tokens'}>
            <FormContainer>
                {assets.length > 1 && (
                    <FieldGroup>
                        <FieldLabel>{t('send_asset') || 'Asset'}</FieldLabel>
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
                                    }}
                                    type="button"
                                >
                                    {renderAssetIcon(a.symbol)}
                                    <span>{a.symbol}</span>
                                </AssetChip>
                            ))}
                        </AssetSelectRow>
                    </FieldGroup>
                )}

                <FieldGroup>
                    <FieldLabel>{t('send_recipient') || 'Recipient Address or TON DNS'}</FieldLabel>
                    <Input
                        placeholder={t('send_recipient_placeholder') || 'EQ... or name.ton'}
                        value={recipient}
                        onChange={e => {
                            setRecipient(e.target.value);
                            if (error) setError(null);
                        }}
                    />
                </FieldGroup>

                <FieldGroup>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 4
                        }}
                    >
                        <FieldLabel style={{ margin: 0 }}>{t('send_amount') || 'Amount'}</FieldLabel>
                        <AvailableText onClick={handleMaxClick}>
                            {t('send_available') || 'Available'}:{' '}
                            {activeAsset.balance.toLocaleString('en-US', {
                                maximumFractionDigits:
                                    activeAsset.decimals > 4 ? 4 : activeAsset.decimals
                            })}{' '}
                            {activeAsset.symbol} ({t('send_max') || 'Max'})
                        </AvailableText>
                    </div>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => {
                            setAmount(e.target.value);
                            if (error) setError(null);
                        }}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldLabel>{t('send_comment') || 'Comment (Optional)'}</FieldLabel>
                    <Input
                        placeholder={t('send_comment_placeholder') || 'Encrypted or plain note'}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </FieldGroup>

                <FeeInfo>
                    <span>{t('send_fee') || 'Estimated Fee'}</span>
                    <span>~0.005 TON</span>
                </FeeInfo>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Button primary fullWidth onClick={handleSend} disabled={isConfirmDisabled}>
                    {t('send_confirm') || 'Confirm & Send'}
                </Button>
            </FormContainer>
        </BottomDrawer>
    );
};
