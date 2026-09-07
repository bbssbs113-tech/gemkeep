export const useAccountLabel = (account: any) => {
    if (!account) return '';
    return account.name || account.activeTonWallet?.address || 'Wallet';
};
