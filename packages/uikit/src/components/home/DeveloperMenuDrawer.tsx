import React, { useState } from 'react';
import styled from 'styled-components';
import { BottomDrawer } from '../shared/BottomDrawer';
import { Button } from '../fields/Button';
import { Input } from '../fields/Input';
import { TonIcon, UsdtIcon, CheckIcon } from '../Icon';
import { useGemKeepState, GemKeepAsset } from '../../state/gemkeep';
import { useTranslation } from '../../hooks/translation';

interface DeveloperMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 4px;
`;

const HeaderBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 8px;
    background: rgba(0, 136, 204, 0.12);
    color: ${props => props.theme.buttonPrimaryBackground || '#0088cc'};
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
`;

const TabRow = styled.div`
    display: flex;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 3px;
    gap: 4px;
`;

const TabButton = styled.button<{ $active: boolean }>`
    flex: 1;
    padding: 8px 12px;
    border-radius: 10px;
    border: none;
    background: ${props => (props.$active ? 'rgba(255, 255, 255, 0.12)' : 'transparent')};
    color: ${props =>
        props.$active
            ? props.theme.textPrimary || '#ffffff'
            : props.theme.textSecondary || '#8a95a5'};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const SectionTitle = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const AssetGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
`;

const AssetCard = styled.button<{ $active: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: ${props =>
        props.$active ? 'rgba(0, 136, 204, 0.14)' : 'rgba(255, 255, 255, 0.04)'};
    border: 1px solid
        ${props =>
            props.$active ? props.theme.buttonPrimaryBackground || '#0088cc' : 'transparent'};
    border-radius: 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;

    &:hover {
        background: ${props =>
            props.$active ? 'rgba(0, 136, 204, 0.18)' : 'rgba(255, 255, 255, 0.08)'};
    }
`;

const AssetInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
`;

const AssetText = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`;

const AssetSymbol = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const AssetBalance = styled.span`
    font-size: 12px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const QuickAmountRow = styled.div`
    display: flex;
    gap: 6px;
    margin-top: 4px;
`;

const QuickAmountBtn = styled.button`
    flex: 1;
    padding: 6px 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
    }
`;

const MessageText = styled.div<{ $isError?: boolean }>`
    font-size: 13px;
    font-weight: 500;
    color: ${props =>
        props.$isError ? props.theme.accentRed || '#ff3b30' : props.theme.accentGreen || '#34c759'};
    padding: 8px 12px;
    background: ${props =>
        props.$isError ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)'};
    border-radius: 10px;
`;

export const DeveloperMenuDrawer: React.FC<DeveloperMenuDrawerProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { activeWallet, assets, devAddBalance, devRemoveBalance } = useGemKeepState();
    const [action, setAction] = useState<'add' | 'remove'>('add');
    const [selectedSymbol, setSelectedSymbol] = useState<string>('USDT');
    const [amountStr, setAmountStr] = useState<string>('10');
    const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(
        null
    );

    const selectedAsset =
        assets.find(a => a.symbol.toUpperCase() === selectedSymbol.toUpperCase()) || assets[0];

    const handleActionSubmit = () => {
        setStatusMessage(null);
        const amountNum = parseFloat(amountStr);

        if (isNaN(amountNum) || !isFinite(amountNum) || amountNum <= 0) {
            setStatusMessage({ text: t('dev_menu_error_invalid_val') || 'Please enter a valid positive number.', isError: true });
            return;
        }

        if (action === 'add') {
            const res = devAddBalance({
                asset: selectedAsset.symbol,
                amount: amountNum
            });
            if (res.success) {
                setStatusMessage({
                    text: `Added +${amountNum} ${selectedAsset.symbol} to ${activeWallet.name}.`,
                    isError: false
                });
            } else {
                setStatusMessage({ text: res.error, isError: true });
            }
        } else {
            const res = devRemoveBalance({
                asset: selectedAsset.symbol,
                amount: amountNum
            });
            if (res.success) {
                setStatusMessage({
                    text: `Removed -${amountNum} ${selectedAsset.symbol} from ${activeWallet.name}.`,
                    isError: false
                });
            } else {
                setStatusMessage({ text: res.error, isError: true });
            }
        }
    };

    const renderAssetIcon = (asset: GemKeepAsset) => {
        if (asset.symbol.toUpperCase() === 'TON') {
            return <TonIcon size={22} />;
        }
        return <UsdtIcon size={22} />;
    };

    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={t('dev_menu_title') || 'Developer Menu'}>
            <Container>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <HeaderBadge>{t('dev_menu_section_title') || 'Virtual State Control'}</HeaderBadge>
                    <span style={{ fontSize: '12px', color: '#8a95a5' }}>
                        Active: {activeWallet.name}
                    </span>
                </div>

                <TabRow>
                    <TabButton
                        $active={action === 'add'}
                        onClick={() => {
                            setAction('add');
                            setStatusMessage(null);
                        }}
                    >
                        + Add Balance
                    </TabButton>
                    <TabButton
                        $active={action === 'remove'}
                        onClick={() => {
                            setAction('remove');
                            setStatusMessage(null);
                        }}
                    >
                        - Remove Balance
                    </TabButton>
                </TabRow>

                <Section>
                    <SectionTitle>{t('send_asset') || 'Select Asset'}</SectionTitle>
                    <AssetGrid>
                        {assets.map(asset => {
                            const isSelected =
                                asset.symbol.toUpperCase() === selectedAsset.symbol.toUpperCase();
                            return (
                                <AssetCard
                                    key={asset.id}
                                    $active={isSelected}
                                    onClick={() => {
                                        setSelectedSymbol(asset.symbol);
                                        setStatusMessage(null);
                                    }}
                                >
                                    <AssetInfo>
                                        {renderAssetIcon(asset)}
                                        <AssetText>
                                            <AssetSymbol>{asset.symbol}</AssetSymbol>
                                            <AssetBalance>
                                                {asset.balance.toLocaleString('en-US', {
                                                    maximumFractionDigits: 4
                                                })}
                                            </AssetBalance>
                                        </AssetText>
                                    </AssetInfo>
                                    {isSelected && <CheckIcon size={16} color="#0088cc" />}
                                </AssetCard>
                            );
                        })}
                    </AssetGrid>
                </Section>

                <Section>
                    <SectionTitle>{t('send_amount') || 'Amount'}</SectionTitle>
                    <Input
                        type="number"
                        value={amountStr}
                        onChange={val => {
                            setAmountStr(val);
                            setStatusMessage(null);
                        }}
                        placeholder={`Amount in ${selectedAsset.symbol}`}
                    />
                    <QuickAmountRow>
                        <QuickAmountBtn onClick={() => setAmountStr('1')}>1</QuickAmountBtn>
                        <QuickAmountBtn onClick={() => setAmountStr('5')}>5</QuickAmountBtn>
                        <QuickAmountBtn onClick={() => setAmountStr('10')}>10</QuickAmountBtn>
                        <QuickAmountBtn onClick={() => setAmountStr('50')}>50</QuickAmountBtn>
                        <QuickAmountBtn onClick={() => setAmountStr('100')}>100</QuickAmountBtn>
                        {action === 'remove' && (
                            <QuickAmountBtn
                                onClick={() => setAmountStr(selectedAsset.balance.toString())}
                            >
                                Max
                            </QuickAmountBtn>
                        )}
                    </QuickAmountRow>
                </Section>

                {statusMessage && (
                    <MessageText $isError={statusMessage.isError}>{statusMessage.text}</MessageText>
                )}

                <Button
                    size="large"
                    onClick={handleActionSubmit}
                    style={{
                        background: action === 'add' ? '#0088cc' : '#ff3b30',
                        marginTop: '8px'
                    }}
                >
                    {action === 'add'
                        ? `Add ${amountStr || '0'} ${selectedAsset.symbol}`
                        : `Remove ${amountStr || '0'} ${selectedAsset.symbol}`}
                </Button>
            </Container>
        </BottomDrawer>
    );
};
