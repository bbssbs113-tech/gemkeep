import React, { useState } from 'react';
import styled from 'styled-components';
import { BottomDrawer } from '../shared/BottomDrawer';
import { WalletEmoji } from '../shared/emoji/WalletEmoji';
import { CheckIcon, PlusIcon, EditIcon, TrashIcon, CloseIcon } from '../Icon';
import { Button } from '../fields/Button';
import { Input } from '../fields/Input';
import { useGemKeepState, GemKeepWallet } from '../../state/gemkeep';
import { useTranslation } from '../../hooks/translation';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 8px;
`;

const WalletsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 50vh;
    overflow-y: auto;
`;

const WalletItem = styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: ${props =>
        props.$active ? 'rgba(0, 136, 204, 0.12)' : 'rgba(255, 255, 255, 0.04)'};
    border: 1px solid
        ${props =>
            props.$active ? props.theme.buttonPrimaryBackground || '#0088cc' : 'transparent'};
    border-radius: 16px;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;

    &:hover {
        background: ${props =>
            props.$active ? 'rgba(0, 136, 204, 0.16)' : 'rgba(255, 255, 255, 0.08)'};
    }
`;

const WalletLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
`;

const WalletMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
`;

const WalletNameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const WalletName = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ActiveBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 6px;
    background: ${props => props.theme.buttonPrimaryBackground || '#0088cc'};
    color: #ffffff;
`;

const WalletAddress = styled.span`
    font-size: 12px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const WalletBalance = styled.span`
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const WalletRight = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
`;

const ActionIconButton = styled.button<{ $danger?: boolean; $disabled?: boolean }>`
    background: rgba(255, 255, 255, 0.06);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
    opacity: ${props => (props.$disabled ? 0.3 : 1)};
    color: ${props =>
        props.$danger
            ? props.theme.accentRed || '#ff3b30'
            : props.theme.textSecondary || '#8a95a5'};
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover {
        background: ${props =>
            props.$disabled
                ? 'rgba(255, 255, 255, 0.06)'
                : props.$danger
                ? 'rgba(255, 59, 48, 0.2)'
                : 'rgba(255, 255, 255, 0.15)'};
        color: ${props =>
            props.$disabled
                ? undefined
                : props.$danger
                ? props.theme.accentRed || '#ff3b30'
                : '#ffffff'};
    }
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
    max-width: 400px;
    background: ${props => props.theme.backgroundPage || '#1c2430'};
    border-radius: 20px;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const ModalText = styled.p`
    margin: 0;
    font-size: 14px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    line-height: 1.5;
`;

const ModalActions = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

function formatShortAddress(addr: string): string {
    if (!addr) return '';
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function calculateWalletTotalUsd(wallet: GemKeepWallet): string {
    if (!wallet.assets || wallet.assets.length === 0) {
        return '$0.00';
    }
    const totalUsd = wallet.assets.reduce((sum, a) => sum + a.balance * a.priceUsd, 0);
    return `$${totalUsd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

export interface WalletManagerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WalletManagerDrawer: React.FC<WalletManagerDrawerProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { wallets, activeWalletId, setActiveWallet, createWallet, renameWallet, removeWallet } =
        useGemKeepState();

    const [isCreating, setIsCreating] = useState(false);
    const [newWalletName, setNewWalletName] = useState('');
    const [renamingWallet, setRenamingWallet] = useState<GemKeepWallet | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [deletingWallet, setDeletingWallet] = useState<GemKeepWallet | null>(null);

    const handleSelectWallet = (id: string) => {
        setActiveWallet(id);
        onClose();
    };

    const handleStartCreate = () => {
        setNewWalletName(`Wallet ${wallets.length + 1}`);
        setIsCreating(true);
    };

    const handleConfirmCreate = () => {
        const name = newWalletName.trim() || `Wallet ${wallets.length + 1}`;
        createWallet(name);
        setIsCreating(false);
        setNewWalletName('');
        onClose();
    };

    const handleStartRename = (e: React.MouseEvent, w: GemKeepWallet) => {
        e.stopPropagation();
        setRenamingWallet(w);
        setRenameValue(w.name);
    };

    const handleConfirmRename = () => {
        if (renamingWallet && renameValue.trim()) {
            renameWallet(renamingWallet.id, renameValue.trim());
            setRenamingWallet(null);
            setRenameValue('');
        }
    };

    const handleStartDelete = (e: React.MouseEvent, w: GemKeepWallet) => {
        e.stopPropagation();
        if (wallets.length <= 1) return; // Last wallet protection
        setDeletingWallet(w);
    };

    const handleConfirmDelete = () => {
        if (deletingWallet) {
            removeWallet(deletingWallet.id);
            setDeletingWallet(null);
        }
    };

    return (
        <>
            <BottomDrawer isOpen={isOpen} onClose={onClose} title={t('wallet_manager_title') || 'Manage Wallets'}>
                <Container>
                    <WalletsList>
                        {wallets.map(w => {
                            const isActive = w.id === activeWalletId;
                            const totalUsd = calculateWalletTotalUsd(w);

                            return (
                                <WalletItem
                                    key={w.id}
                                    $active={isActive}
                                    onClick={() => handleSelectWallet(w.id)}
                                >
                                    <WalletLeft>
                                        <WalletEmoji emoji="💎" containerSize={36} />
                                        <WalletMeta>
                                            <WalletNameRow>
                                                <WalletName>{w.name}</WalletName>
                                                {isActive && <ActiveBadge>{t('wallet_manager_active') || 'Active'}</ActiveBadge>}
                                            </WalletNameRow>
                                            <WalletAddress>
                                                {formatShortAddress(w.address)} •{' '}
                                                <WalletBalance>{totalUsd}</WalletBalance>
                                            </WalletAddress>
                                        </WalletMeta>
                                    </WalletLeft>

                                    <WalletRight>
                                        <ActionIconButton
                                            type="button"
                                            title="Rename Wallet"
                                            onClick={e => handleStartRename(e, w)}
                                        >
                                            <EditIcon size={16} />
                                        </ActionIconButton>

                                        <ActionIconButton
                                            type="button"
                                            $danger
                                            $disabled={wallets.length <= 1}
                                            title={
                                                wallets.length <= 1
                                                    ? 'Cannot delete the only wallet'
                                                    : 'Delete Wallet'
                                            }
                                            onClick={e => handleStartDelete(e, w)}
                                        >
                                            <TrashIcon size={16} />
                                        </ActionIconButton>

                                        {isActive && (
                                            <div style={{ color: '#0088cc', marginLeft: 4 }}>
                                                <CheckIcon size={20} />
                                            </div>
                                        )}
                                    </WalletRight>
                                </WalletItem>
                            );
                        })}
                    </WalletsList>

                    <Button
                        primary
                        fullWidth
                        onClick={handleStartCreate}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        <PlusIcon size={20} />
                        {t('wallet_manager_add_new') || 'Add New Wallet'}
                    </Button>
                </Container>
            </BottomDrawer>

            {/* Create Wallet Modal */}
            {isCreating && (
                <ModalOverlay onClick={() => setIsCreating(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalTitle>{t('wallet_manager_create_title') || 'New Wallet'}</ModalTitle>
                        <ModalText>
                            {t('wallet_manager_reset_desc') || 'Create a new virtual wallet with starter demo balances.'}
                        </ModalText>
                        <Input
                            placeholder={t('wallet_manager_name_placeholder') || 'Wallet Name'}
                            value={newWalletName}
                            onChange={setNewWalletName}
                            autoFocus
                        />
                        <ModalActions>
                            <Button fullWidth onClick={() => setIsCreating(false)}>
                                {t('action_cancel') || 'Cancel'}
                            </Button>
                            <Button primary fullWidth onClick={handleConfirmCreate}>
                                {t('wallet_manager_create_btn') || 'Create'}
                            </Button>
                        </ModalActions>
                    </ModalCard>
                </ModalOverlay>
            )}

            {/* Rename Wallet Modal */}
            {renamingWallet && (
                <ModalOverlay onClick={() => setRenamingWallet(null)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalTitle>{t('action_edit') || 'Rename Wallet'}</ModalTitle>
                        <ModalText>{t('wallet_manager_wallet_name') || 'Enter a new name for this virtual wallet.'}</ModalText>
                        <Input
                            placeholder={t('wallet_manager_name_placeholder') || 'Wallet Name'}
                            value={renameValue}
                            onChange={setRenameValue}
                            autoFocus
                        />
                        <ModalActions>
                            <Button fullWidth onClick={() => setRenamingWallet(null)}>
                                {t('action_cancel') || 'Cancel'}
                            </Button>
                            <Button
                                primary
                                fullWidth
                                disabled={!renameValue.trim()}
                                onClick={handleConfirmRename}
                            >
                                {t('action_save') || 'Save'}
                            </Button>
                        </ModalActions>
                    </ModalCard>
                </ModalOverlay>
            )}

            {/* Delete Wallet Confirmation Modal */}
            {deletingWallet && (
                <ModalOverlay onClick={() => setDeletingWallet(null)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalTitle style={{ color: '#ff3b30' }}>{t('action_delete') || 'Delete Wallet'}</ModalTitle>
                        <ModalText>
                            {t('wallet_manager_delete_confirm') || 'Are you sure you want to delete this wallet?'} {t('wallet_manager_balance_warning') || 'All virtual balances in this wallet will be removed.'}
                        </ModalText>
                        <ModalActions>
                            <Button fullWidth onClick={() => setDeletingWallet(null)}>
                                {t('action_cancel') || 'Cancel'}
                            </Button>
                            <Button
                                fullWidth
                                style={{
                                    background: '#ff3b30',
                                    color: '#ffffff',
                                    borderColor: '#ff3b30'
                                }}
                                onClick={handleConfirmDelete}
                            >
                                {t('action_delete') || 'Delete'}
                            </Button>
                        </ModalActions>
                    </ModalCard>
                </ModalOverlay>
            )}
        </>
    );
};
