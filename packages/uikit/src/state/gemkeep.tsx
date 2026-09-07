import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface GemKeepAsset {
    id: string;
    symbol: string;
    name: string;
    balance: number;
    decimals: number;
    priceUsd: number;
    icon?: string;
    change24h?: number;
}

export interface GemKeepWallet {
    id: string;
    name: string;
    address: string;
    tonBalance: number;
    usdtBalance: number;
    assets: GemKeepAsset[];
    createdAt: number;
}

export interface GemKeepTransaction {
    id: string;
    timestamp: number;
    type: 'send' | 'receive' | 'swap' | 'buy' | 'sell' | 'deposit' | 'withdraw' | 'trade';
    asset: string;
    amount: number;
    secondAsset?: string;
    secondAmount?: number;
    recipient?: string;
    sender?: string;
    status: 'completed' | 'pending' | 'failed';
    fee?: number;
    feeAsset?: string;
    walletId: string;
    description?: string;
}

export interface GemKeepTrade {
    id: string;
    walletId: string;
    pair: string;
    asset: string;
    quoteAsset: string;
    direction: 'up' | 'down';
    amount: number;
    entryPrice: number;
    exitPrice?: number;
    currentPrice?: number;
    payout?: number;
    pnl?: number;
    result?: 'win' | 'loss' | 'draw' | 'pending';
    openedAt: number;
    closedAt?: number;
    durationSeconds?: number;
    status: 'open' | 'closed';
}

export interface TradingPair {
    id: string;
    baseSymbol: string;
    quoteSymbol: string;
    displayName: string;
    currentPrice: number;
    change24h: number;
    payoutPercent: number;
}

export interface TradingStats {
    totalTrades: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    totalPnl: number;
}

export interface GemKeepState {
    version: number;
    wallets: GemKeepWallet[];
    activeWalletId: string;
    history: GemKeepTransaction[];
    trades: GemKeepTrade[];
    startingPortfolioValueUsd: number;
    metadata: {
        createdAt: number;
        updatedAt: number;
    };
}

export type GemKeepOperationResult =
    | { success: true; transactionId?: string }
    | { success: false; error: string };

// ==========================================
// CONSTANTS & REGISTRY
// ==========================================

export const GEMKEEP_STORAGE_KEY = 'gemkeep:virtual-state:v1';
export const CURRENT_STATE_VERSION = 1;
export const DEFAULT_VIRTUAL_FEE_TON = 0.005;
export const DEFAULT_SWAP_FEE_PERCENT = 0.5; // 0.5%
export const DEFAULT_TRADE_PAYOUT_PERCENT = 80; // 80% virtual profit payout on win

export const DEFAULT_TRADING_PAIRS: TradingPair[] = [
    {
        id: 'TON-USDT',
        baseSymbol: 'TON',
        quoteSymbol: 'USDT',
        displayName: 'TON / USDT',
        currentPrice: 5.65,
        change24h: 3.14,
        payoutPercent: DEFAULT_TRADE_PAYOUT_PERCENT
    }
];

export const DEFAULT_ASSETS: GemKeepAsset[] = [
    {
        id: 'ton',
        symbol: 'TON',
        name: 'Toncoin',
        balance: 0,
        decimals: 9,
        priceUsd: 5.65,
        change24h: 3.14
    },
    {
        id: 'usdt',
        symbol: 'USDT',
        name: 'Tether USD',
        balance: 1.5,
        decimals: 6,
        priceUsd: 1.0,
        change24h: 0.01
    }
];

// ==========================================
// UTILITY HELPERS
// ==========================================

export function generateUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try {
            return crypto.randomUUID();
        } catch {
            // fallback
        }
    }
    return 'gk_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

export function roundAmount(value: number, decimals: number = 9): number {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function createInitialGemKeepState(): GemKeepState {
    const now = Date.now();
    const mainWalletAssets: GemKeepAsset[] = [
        {
            id: 'ton',
            symbol: 'TON',
            name: 'Toncoin',
            balance: 0,
            decimals: 9,
            priceUsd: 5.65,
            change24h: 3.14
        },
        {
            id: 'usdt',
            symbol: 'USDT',
            name: 'Tether USD',
            balance: 1.5,
            decimals: 6,
            priceUsd: 1.0,
            change24h: 0.01
        }
    ];

    const mainWallet: GemKeepWallet = {
        id: 'main-wallet',
        name: 'Main Wallet',
        address: 'EQGEMKEEPMAIN0000000000000000000000000000000000',
        tonBalance: 0,
        usdtBalance: 1.5,
        assets: mainWalletAssets,
        createdAt: now
    };

    return {
        version: CURRENT_STATE_VERSION,
        wallets: [mainWallet],
        activeWalletId: 'main-wallet',
        history: [],
        trades: [],
        startingPortfolioValueUsd: 1.5, // $1.50 exact total
        metadata: {
            createdAt: now,
            updatedAt: now
        }
    };
}

export function loadGemKeepState(): GemKeepState {
    if (typeof window === 'undefined') {
        return createInitialGemKeepState();
    }

    try {
        const raw = localStorage.getItem(GEMKEEP_STORAGE_KEY);
        if (!raw) {
            return createInitialGemKeepState();
        }

        const parsed = JSON.parse(raw);
        if (
            !parsed ||
            typeof parsed !== 'object' ||
            parsed.version !== CURRENT_STATE_VERSION ||
            !Array.isArray(parsed.wallets) ||
            parsed.wallets.length === 0
        ) {
            return createInitialGemKeepState();
        }

        return parsed as GemKeepState;
    } catch {
        return createInitialGemKeepState();
    }
}

export function saveGemKeepState(state: GemKeepState): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(GEMKEEP_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('GemKeep virtual state storage save failed:', e);
    }
}

// ==========================================
// CONTEXT INTERFACE
// ==========================================

export interface GemKeepContextValue {
    state: GemKeepState;
    wallets: GemKeepWallet[];
    activeWallet: GemKeepWallet;
    activeWalletId: string;
    assets: GemKeepAsset[];
    history: GemKeepTransaction[];
    trades: GemKeepTrade[];
    portfolioValueUsd: number;
    portfolioChange24hUsd: number;
    portfolioChange24hPercent: number;
    totalPnlUsd: number;
    totalPnlPercent: number;
    sendAsset: (params: {
        asset: string;
        amount: number;
        recipient: string;
        fee?: number;
    }) => GemKeepOperationResult;
    receiveAsset: (params: {
        asset: string;
        amount: number;
        sender?: string;
    }) => GemKeepOperationResult;
    swapAssets: (params: {
        fromAsset: string;
        fromAmount: number;
        toAsset: string;
        feePercent?: number;
    }) => GemKeepOperationResult;
    addTransaction: (transaction: Partial<GemKeepTransaction>) => GemKeepTransaction;
    resetGemKeepState: () => void;
    setActiveWallet: (walletId: string) => void;
    createWallet: (name?: string) => GemKeepWallet;
    renameWallet: (walletId: string, name: string) => void;
    removeWallet: (walletId: string) => void;
    openTrade: (params: {
        pair?: string;
        asset?: string;
        quoteAsset?: string;
        direction: 'up' | 'down';
        amount: number;
        entryPrice: number;
        durationSeconds?: number;
    }) => GemKeepOperationResult;
    closeTrade: (params: { tradeId: string; exitPrice: number }) => GemKeepOperationResult;
    devAddBalance: (params: { asset: string; amount: number }) => GemKeepOperationResult;
    devRemoveBalance: (params: { asset: string; amount: number }) => GemKeepOperationResult;
    tradingStats: TradingStats;
    tradingPairs: TradingPair[];
    activeWalletTrades: GemKeepTrade[];
}

const GemKeepContext = createContext<GemKeepContextValue | null>(null);

// ==========================================
// PROVIDER COMPONENT
// ==========================================

export const GemKeepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GemKeepState>(() => loadGemKeepState());

    // Sync to localStorage on every state change
    useEffect(() => {
        saveGemKeepState(state);
    }, [state]);

    // Active Wallet computation & fallback
    const activeWallet = useMemo<GemKeepWallet>(() => {
        const found = state.wallets.find(w => w.id === state.activeWalletId);
        if (found) return found;

        if (state.wallets.length > 0) return state.wallets[0];

        // Extreme fallback if empty
        const initial = createInitialGemKeepState();
        return initial.wallets[0];
    }, [state.wallets, state.activeWalletId]);

    const activeWalletId = activeWallet.id;
    const assets = activeWallet.assets;
    const history = state.history;
    const trades = state.trades;

    // Portfolio Value Calculation
    const portfolioValueUsd = useMemo(() => {
        return roundAmount(
            assets.reduce((total, asset) => total + asset.balance * asset.priceUsd, 0),
            2
        );
    }, [assets]);

    // PnL & 24h Change calculations
    const totalPnlUsd = useMemo(() => {
        return roundAmount(portfolioValueUsd - state.startingPortfolioValueUsd, 2);
    }, [portfolioValueUsd, state.startingPortfolioValueUsd]);

    const totalPnlPercent = useMemo(() => {
        if (state.startingPortfolioValueUsd <= 0) return 0;
        return roundAmount((totalPnlUsd / state.startingPortfolioValueUsd) * 100, 2);
    }, [totalPnlUsd, state.startingPortfolioValueUsd]);

    const portfolioChange24hUsd = useMemo(() => {
        return roundAmount(
            assets.reduce((total, asset) => {
                const changeFraction = (asset.change24h || 0) / 100;
                const assetUsd = asset.balance * asset.priceUsd;
                return total + assetUsd * changeFraction;
            }, 0),
            2
        );
    }, [assets]);

    const portfolioChange24hPercent = useMemo(() => {
        if (portfolioValueUsd <= 0) return 0;
        return roundAmount((portfolioChange24hUsd / portfolioValueUsd) * 100, 2);
    }, [portfolioChange24hUsd, portfolioValueUsd]);

    // ------------------------------------------
    // ENGINE OPERATIONS
    // ------------------------------------------

    const addTransaction = (txData: Partial<GemKeepTransaction>): GemKeepTransaction => {
        const newTx: GemKeepTransaction = {
            id: txData.id || generateUUID(),
            timestamp: txData.timestamp || Date.now(),
            type: txData.type || 'deposit',
            asset: txData.asset || 'TON',
            amount: txData.amount || 0,
            secondAsset: txData.secondAsset,
            secondAmount: txData.secondAmount,
            recipient: txData.recipient,
            sender: txData.sender,
            status: txData.status || 'completed',
            fee: txData.fee,
            feeAsset: txData.feeAsset,
            walletId: txData.walletId || activeWalletId,
            description: txData.description
        };

        setState(prev => ({
            ...prev,
            history: [newTx, ...prev.history],
            metadata: { ...prev.metadata, updatedAt: Date.now() }
        }));

        return newTx;
    };

    const sendAsset = ({
        asset: symbol,
        amount,
        recipient,
        fee = DEFAULT_VIRTUAL_FEE_TON
    }: {
        asset: string;
        amount: number;
        recipient: string;
        fee?: number;
    }): GemKeepOperationResult => {
        if (!amount || amount <= 0) {
            return { success: false, error: 'Invalid amount. Must be greater than 0.' };
        }

        if (!recipient || recipient.trim() === '') {
            return { success: false, error: 'Recipient address is required.' };
        }

        const normSymbol = symbol.toUpperCase();
        const targetAssetIndex = assets.findIndex(a => a.symbol === normSymbol);

        if (targetAssetIndex === -1) {
            return { success: false, error: `Asset ${symbol} not found in wallet.` };
        }

        const targetAsset = assets[targetAssetIndex];
        const tonAssetIndex = assets.findIndex(a => a.symbol === 'TON');

        // Check fee sufficiency (fee is in TON)
        let requiredTon = normSymbol === 'TON' ? amount + fee : fee;
        const currentTon = tonAssetIndex !== -1 ? assets[tonAssetIndex].balance : 0;

        if (currentTon < requiredTon) {
            return { success: false, error: `Insufficient TON for gas fee (${fee} TON required).` };
        }

        if (normSymbol !== 'TON' && targetAsset.balance < amount) {
            return { success: false, error: `Insufficient ${normSymbol} balance.` };
        }

        // Apply deducts
        const now = Date.now();
        const txId = generateUUID();

        setState(prev => {
            const updatedWallets = prev.wallets.map(w => {
                if (w.id !== activeWalletId) return w;

                const updatedAssets = w.assets.map(a => {
                    let newBalance = a.balance;
                    if (a.symbol === 'TON') {
                        const tonDeduct = normSymbol === 'TON' ? amount + fee : fee;
                        newBalance = roundAmount(a.balance - tonDeduct, a.decimals);
                    } else if (a.symbol === normSymbol) {
                        newBalance = roundAmount(a.balance - amount, a.decimals);
                    }

                    return { ...a, balance: newBalance };
                });

                const updatedTonBal =
                    updatedAssets.find(a => a.symbol === 'TON')?.balance ?? w.tonBalance;
                const updatedUsdtBal =
                    updatedAssets.find(a => a.symbol === 'USDT')?.balance ?? w.usdtBalance;

                return {
                    ...w,
                    assets: updatedAssets,
                    tonBalance: updatedTonBal,
                    usdtBalance: updatedUsdtBal
                };
            });

            const newTx: GemKeepTransaction = {
                id: txId,
                timestamp: now,
                type: 'send',
                asset: normSymbol,
                amount: roundAmount(amount, targetAsset.decimals),
                recipient: recipient.trim(),
                status: 'completed',
                fee: fee,
                feeAsset: 'TON',
                walletId: activeWalletId,
                description: `Sent ${amount} ${normSymbol} to ${recipient}`
            };

            return {
                ...prev,
                wallets: updatedWallets,
                history: [newTx, ...prev.history],
                metadata: { ...prev.metadata, updatedAt: now }
            };
        });

        return { success: true, transactionId: txId };
    };

    const receiveAsset = ({
        asset: symbol,
        amount,
        sender = 'EQEXTERNALRECEIVE...'
    }: {
        asset: string;
        amount: number;
        sender?: string;
    }): GemKeepOperationResult => {
        if (!amount || isNaN(amount) || !isFinite(amount) || amount <= 0) {
            return { success: false, error: 'Invalid amount. Must be greater than 0.' };
        }

        const normSymbol = symbol.toUpperCase();
        const targetAssetIndex = assets.findIndex(a => a.symbol === normSymbol);

        if (targetAssetIndex === -1) {
            return { success: false, error: `Asset ${symbol} not found.` };
        }

        const targetAsset = assets[targetAssetIndex];
        const now = Date.now();
        const txId = generateUUID();

        setState(prev => {
            const updatedWallets = prev.wallets.map(w => {
                if (w.id !== activeWalletId) return w;

                const updatedAssets = w.assets.map(a => {
                    if (a.symbol === normSymbol) {
                        return { ...a, balance: roundAmount(a.balance + amount, a.decimals) };
                    }
                    return a;
                });

                const updatedTonBal =
                    updatedAssets.find(a => a.symbol === 'TON')?.balance ?? w.tonBalance;
                const updatedUsdtBal =
                    updatedAssets.find(a => a.symbol === 'USDT')?.balance ?? w.usdtBalance;

                return {
                    ...w,
                    assets: updatedAssets,
                    tonBalance: updatedTonBal,
                    usdtBalance: updatedUsdtBal
                };
            });

            const newTx: GemKeepTransaction = {
                id: txId,
                timestamp: now,
                type: 'receive',
                asset: normSymbol,
                amount: roundAmount(amount, targetAsset.decimals),
                sender: sender,
                status: 'completed',
                walletId: activeWalletId,
                description: `Received ${amount} ${normSymbol}`
            };

            return {
                ...prev,
                wallets: updatedWallets,
                history: [newTx, ...prev.history],
                metadata: { ...prev.metadata, updatedAt: now }
            };
        });

        return { success: true, transactionId: txId };
    };

    const swapAssets = ({
        fromAsset: fromSymbol,
        fromAmount,
        toAsset: toSymbol,
        feePercent = DEFAULT_SWAP_FEE_PERCENT
    }: {
        fromAsset: string;
        fromAmount: number;
        toAsset: string;
        feePercent?: number;
    }): GemKeepOperationResult => {
        const fromNorm = fromSymbol.toUpperCase();
        const toNorm = toSymbol.toUpperCase();

        if (fromNorm === toNorm) {
            return { success: false, error: 'Cannot swap the same asset.' };
        }

        if (!fromAmount || isNaN(fromAmount) || !isFinite(fromAmount) || fromAmount <= 0) {
            return { success: false, error: 'Invalid amount. Must be greater than 0.' };
        }

        const fromAsset = assets.find(a => a.symbol === fromNorm);
        const toAsset = assets.find(a => a.symbol === toNorm);

        if (!fromAsset) return { success: false, error: `Source asset ${fromNorm} not found.` };
        if (!toAsset) return { success: false, error: `Target asset ${toNorm} not found.` };

        if (fromAsset.balance < fromAmount) {
            return { success: false, error: `Insufficient ${fromNorm} balance for swap.` };
        }

        // Value Calculations
        const grossUsd = fromAmount * fromAsset.priceUsd;
        const feeUsd = grossUsd * (feePercent / 100);
        const netUsd = grossUsd - feeUsd;
        const rawToAmount = netUsd / toAsset.priceUsd;
        const finalToAmount = roundAmount(rawToAmount, toAsset.decimals);

        const now = Date.now();
        const txId = generateUUID();

        setState(prev => {
            const updatedWallets = prev.wallets.map(w => {
                if (w.id !== activeWalletId) return w;

                const updatedAssets = w.assets.map(a => {
                    if (a.symbol === fromNorm) {
                        return { ...a, balance: roundAmount(a.balance - fromAmount, a.decimals) };
                    }
                    if (a.symbol === toNorm) {
                        return {
                            ...a,
                            balance: roundAmount(a.balance + finalToAmount, a.decimals)
                        };
                    }
                    return a;
                });

                const updatedTonBal =
                    updatedAssets.find(a => a.symbol === 'TON')?.balance ?? w.tonBalance;
                const updatedUsdtBal =
                    updatedAssets.find(a => a.symbol === 'USDT')?.balance ?? w.usdtBalance;

                return {
                    ...w,
                    assets: updatedAssets,
                    tonBalance: updatedTonBal,
                    usdtBalance: updatedUsdtBal
                };
            });

            const newTx: GemKeepTransaction = {
                id: txId,
                timestamp: now,
                type: 'swap',
                asset: fromNorm,
                amount: roundAmount(fromAmount, fromAsset.decimals),
                secondAsset: toNorm,
                secondAmount: finalToAmount,
                status: 'completed',
                fee: roundAmount(feeUsd / (fromAsset.priceUsd || 1), 4),
                feeAsset: fromNorm,
                walletId: activeWalletId,
                description: `Swapped ${fromAmount} ${fromNorm} for ${finalToAmount} ${toNorm}`
            };

            return {
                ...prev,
                wallets: updatedWallets,
                history: [newTx, ...prev.history],
                metadata: { ...prev.metadata, updatedAt: now }
            };
        });

        return { success: true, transactionId: txId };
    };

    const resetGemKeepState = (): void => {
        const initialState = createInitialGemKeepState();
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem(GEMKEEP_STORAGE_KEY);
            } catch {
                // ignore storage error
            }
        }
        setState(initialState);
    };

    // Wallet Management
    const setActiveWallet = (walletId: string): void => {
        if (!state.wallets.some(w => w.id === walletId)) return;
        setState(prev => ({
            ...prev,
            activeWalletId: walletId,
            metadata: { ...prev.metadata, updatedAt: Date.now() }
        }));
    };

    const createWallet = (name?: string): GemKeepWallet => {
        const now = Date.now();
        const id = generateUUID();
        const walletName = name || `Wallet ${state.wallets.length + 1}`;
        const newWallet: GemKeepWallet = {
            id,
            name: walletName,
            address: `EQGEMKEEP_${id.substring(0, 12).toUpperCase()}`,
            tonBalance: 0,
            usdtBalance: 1.5,
            assets: DEFAULT_ASSETS.map(a => ({ ...a })),
            createdAt: now
        };

        setState(prev => ({
            ...prev,
            wallets: [...prev.wallets, newWallet],
            activeWalletId: id,
            metadata: { ...prev.metadata, updatedAt: now }
        }));

        return newWallet;
    };

    const renameWallet = (walletId: string, name: string): void => {
        if (!name || name.trim() === '') return;
        setState(prev => ({
            ...prev,
            wallets: prev.wallets.map(w => (w.id === walletId ? { ...w, name: name.trim() } : w)),
            metadata: { ...prev.metadata, updatedAt: Date.now() }
        }));
    };

    const removeWallet = (walletId: string): void => {
        if (state.wallets.length <= 1) return; // Keep at least one wallet

        setState(prev => {
            const nextWallets = prev.wallets.filter(w => w.id !== walletId);
            const nextActiveId =
                prev.activeWalletId === walletId ? nextWallets[0].id : prev.activeWalletId;

            return {
                ...prev,
                wallets: nextWallets,
                activeWalletId: nextActiveId,
                metadata: { ...prev.metadata, updatedAt: Date.now() }
            };
        });
    };

    // Active Wallet Trades & Statistics
    const activeWalletTrades = useMemo(() => {
        return state.trades.filter(t =>
            t.walletId ? t.walletId === activeWalletId : activeWalletId === 'main-wallet'
        );
    }, [state.trades, activeWalletId]);

    const tradingStats = useMemo<TradingStats>(() => {
        const closedTrades = activeWalletTrades.filter(t => t.status === 'closed');
        const totalTrades = closedTrades.length;
        const wins = closedTrades.filter(t => t.result === 'win').length;
        const losses = closedTrades.filter(t => t.result === 'loss').length;
        const draws = closedTrades.filter(t => t.result === 'draw').length;
        const winRate = totalTrades > 0 ? roundAmount((wins / totalTrades) * 100, 1) : 0;
        const totalPnl = roundAmount(
            closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0),
            2
        );

        return {
            totalTrades,
            wins,
            losses,
            draws,
            winRate,
            totalPnl
        };
    }, [activeWalletTrades]);

    // Virtual Trading Engine
    const openTrade = ({
        pair = 'TON/USDT',
        asset: symbol = 'TON',
        quoteAsset: quoteSymbol = 'USDT',
        direction,
        amount,
        entryPrice,
        durationSeconds = 30
    }: {
        pair?: string;
        asset?: string;
        quoteAsset?: string;
        direction: 'up' | 'down';
        amount: number;
        entryPrice: number;
        durationSeconds?: number;
    }): GemKeepOperationResult => {
        if (!amount || amount <= 0) return { success: false, error: 'Invalid trade amount.' };

        const quoteAssetNorm = (quoteSymbol || 'USDT').toUpperCase();
        const quoteAsset = activeWallet.assets.find(a => a.symbol.toUpperCase() === quoteAssetNorm);
        if (!quoteAsset || quoteAsset.balance < amount) {
            return {
                success: false,
                error: `Insufficient ${quoteAssetNorm} balance for trade margin.`
            };
        }

        const tradeId = generateUUID();
        const now = Date.now();

        const newTrade: GemKeepTrade = {
            id: tradeId,
            walletId: activeWalletId,
            pair,
            asset: symbol,
            quoteAsset: quoteSymbol,
            direction,
            amount: roundAmount(amount, 2),
            entryPrice: roundAmount(entryPrice, 4),
            currentPrice: roundAmount(entryPrice, 4),
            status: 'open',
            openedAt: now,
            durationSeconds
        };

        setState(prev => {
            const updatedWallets = prev.wallets.map(wallet => {
                if (wallet.id !== activeWalletId) return wallet;

                const updatedAssets = wallet.assets.map(a => {
                    if (a.symbol.toUpperCase() === quoteAssetNorm) {
                        return { ...a, balance: roundAmount(a.balance - amount, a.decimals) };
                    }
                    return a;
                });

                const updatedUsdt =
                    quoteAssetNorm === 'USDT'
                        ? roundAmount(wallet.usdtBalance - amount, 6)
                        : wallet.usdtBalance;

                return {
                    ...wallet,
                    assets: updatedAssets,
                    usdtBalance: updatedUsdt
                };
            });

            return {
                ...prev,
                wallets: updatedWallets,
                trades: [newTrade, ...prev.trades],
                metadata: { ...prev.metadata, updatedAt: now }
            };
        });

        return { success: true, transactionId: tradeId };
    };

    const closeTrade = ({
        tradeId,
        exitPrice
    }: {
        tradeId: string;
        exitPrice: number;
    }): GemKeepOperationResult => {
        const trade = state.trades.find(t => t.id === tradeId && t.status === 'open');
        if (!trade) return { success: false, error: 'Open trade not found.' };

        const exitPriceClean = roundAmount(exitPrice, 4);
        let result: 'win' | 'loss' | 'draw' = 'draw';
        let payout = 0;
        let pnl = 0;

        if (exitPriceClean === trade.entryPrice) {
            result = 'draw';
            payout = trade.amount;
            pnl = 0;
        } else if (trade.direction === 'up') {
            if (exitPriceClean > trade.entryPrice) {
                result = 'win';
                payout = roundAmount(trade.amount * (1 + DEFAULT_TRADE_PAYOUT_PERCENT / 100), 2);
                pnl = roundAmount(trade.amount * (DEFAULT_TRADE_PAYOUT_PERCENT / 100), 2);
            } else {
                result = 'loss';
                payout = 0;
                pnl = -roundAmount(trade.amount, 2);
            }
        } else {
            // direction === 'down'
            if (exitPriceClean < trade.entryPrice) {
                result = 'win';
                payout = roundAmount(trade.amount * (1 + DEFAULT_TRADE_PAYOUT_PERCENT / 100), 2);
                pnl = roundAmount(trade.amount * (DEFAULT_TRADE_PAYOUT_PERCENT / 100), 2);
            } else {
                result = 'loss';
                payout = 0;
                pnl = -roundAmount(trade.amount, 2);
            }
        }

        const now = Date.now();
        const tradeWalletId = trade.walletId || activeWalletId;
        const quoteAssetNorm = (trade.quoteAsset || 'USDT').toUpperCase();

        setState(prev => {
            const updatedWallets = prev.wallets.map(wallet => {
                if (wallet.id !== tradeWalletId || payout <= 0) return wallet;

                const updatedAssets = wallet.assets.map(a => {
                    if (a.symbol.toUpperCase() === quoteAssetNorm) {
                        return { ...a, balance: roundAmount(a.balance + payout, a.decimals) };
                    }
                    return a;
                });

                const updatedUsdt =
                    quoteAssetNorm === 'USDT'
                        ? roundAmount(wallet.usdtBalance + payout, 6)
                        : wallet.usdtBalance;

                return {
                    ...wallet,
                    assets: updatedAssets,
                    usdtBalance: updatedUsdt
                };
            });

            const updatedTrades = prev.trades.map(t =>
                t.id === tradeId
                    ? {
                          ...t,
                          status: 'closed' as const,
                          exitPrice: exitPriceClean,
                          payout,
                          pnl,
                          result,
                          closedAt: now
                      }
                    : t
            );

            const newTx: GemKeepTransaction = {
                id: generateUUID(),
                timestamp: now,
                type: 'trade',
                asset: trade.asset || 'TON',
                amount: trade.amount,
                secondAsset: trade.quoteAsset || 'USDT',
                secondAmount: payout,
                status: 'completed',
                walletId: tradeWalletId,
                description: `Trade ${trade.direction.toUpperCase()} ${
                    trade.pair || 'TON/USDT'
                }: ${result.toUpperCase()} (PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)})`
            };

            return {
                ...prev,
                wallets: updatedWallets,
                trades: updatedTrades,
                history: [newTx, ...prev.history],
                metadata: { ...prev.metadata, updatedAt: now }
            };
        });

        return { success: true, transactionId: tradeId };
    };

    const devAddBalance = ({
        asset: symbol,
        amount
    }: {
        asset: string;
        amount: number;
    }): GemKeepOperationResult => {
        if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount) || amount <= 0) {
            return { success: false, error: 'Please enter a valid positive number.' };
        }

        const normSymbol = symbol.toUpperCase();
        const targetAsset = assets.find(a => a.symbol.toUpperCase() === normSymbol);
        if (!targetAsset) {
            return { success: false, error: `Asset ${symbol} not found in wallet.` };
        }

        const roundedAmount = roundAmount(amount, targetAsset.decimals);
        if (roundedAmount <= 0) {
            return {
                success: false,
                error: `Amount too small for ${normSymbol} (max decimals: ${targetAsset.decimals}).`
            };
        }

        const now = Date.now();
        const txId = generateUUID();

        setState(prev => {
            const updatedWallets = prev.wallets.map(w => {
                if (w.id !== activeWalletId) return w;

                const updatedAssets = w.assets.map(a => {
                    if (a.symbol.toUpperCase() === normSymbol) {
                        return {
                            ...a,
                            balance: roundAmount(a.balance + roundedAmount, a.decimals)
                        };
                    }
                    return a;
                });

                const updatedTonBal =
                    updatedAssets.find(a => a.symbol === 'TON')?.balance ?? w.tonBalance;
                const updatedUsdtBal =
                    updatedAssets.find(a => a.symbol === 'USDT')?.balance ?? w.usdtBalance;

                return {
                    ...w,
                    assets: updatedAssets,
                    tonBalance: updatedTonBal,
                    usdtBalance: updatedUsdtBal
                };
            });

            const newTx: GemKeepTransaction = {
                id: txId,
                timestamp: now,
                type: 'deposit',
                asset: normSymbol,
                amount: roundedAmount,
                status: 'completed',
                walletId: activeWalletId,
                description: 'Developer Balance Added'
            };

            return {
                ...prev,
                wallets: updatedWallets,
                history: [newTx, ...prev.history],
                metadata: { ...prev.metadata, updatedAt: now }
            };
        });

        return { success: true, transactionId: txId };
    };

    const devRemoveBalance = ({
        asset: symbol,
        amount
    }: {
        asset: string;
        amount: number;
    }): GemKeepOperationResult => {
        if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount) || amount <= 0) {
            return { success: false, error: 'Please enter a valid positive number.' };
        }

        const normSymbol = symbol.toUpperCase();
        const targetAsset = assets.find(a => a.symbol.toUpperCase() === normSymbol);
        if (!targetAsset) {
            return { success: false, error: `Asset ${symbol} not found in wallet.` };
        }

        const roundedAmount = roundAmount(amount, targetAsset.decimals);
        if (roundedAmount <= 0) {
            return {
                success: false,
                error: `Amount too small for ${normSymbol} (max decimals: ${targetAsset.decimals}).`
            };
        }

        if (targetAsset.balance < roundedAmount) {
            return {
                success: false,
                error: `Cannot remove more than current balance (${targetAsset.balance} ${normSymbol}).`
            };
        }

        const now = Date.now();
        const txId = generateUUID();

        setState(prev => {
            const updatedWallets = prev.wallets.map(w => {
                if (w.id !== activeWalletId) return w;

                const updatedAssets = w.assets.map(a => {
                    if (a.symbol.toUpperCase() === normSymbol) {
                        return {
                            ...a,
                            balance: roundAmount(a.balance - roundedAmount, a.decimals)
                        };
                    }
                    return a;
                });

                const updatedTonBal =
                    updatedAssets.find(a => a.symbol === 'TON')?.balance ?? w.tonBalance;
                const updatedUsdtBal =
                    updatedAssets.find(a => a.symbol === 'USDT')?.balance ?? w.usdtBalance;

                return {
                    ...w,
                    assets: updatedAssets,
                    tonBalance: updatedTonBal,
                    usdtBalance: updatedUsdtBal
                };
            });

            const newTx: GemKeepTransaction = {
                id: txId,
                timestamp: now,
                type: 'withdraw',
                asset: normSymbol,
                amount: roundedAmount,
                status: 'completed',
                walletId: activeWalletId,
                description: 'Developer Balance Removed'
            };

            return {
                ...prev,
                wallets: updatedWallets,
                history: [newTx, ...prev.history],
                metadata: { ...prev.metadata, updatedAt: now }
            };
        });

        return { success: true, transactionId: txId };
    };

    const value: GemKeepContextValue = {
        state,
        wallets: state.wallets,
        activeWallet,
        activeWalletId,
        assets,
        history,
        trades: state.trades,
        activeWalletTrades,
        tradingStats,
        tradingPairs: DEFAULT_TRADING_PAIRS,
        portfolioValueUsd,
        portfolioChange24hUsd,
        portfolioChange24hPercent,
        totalPnlUsd,
        totalPnlPercent,
        sendAsset,
        receiveAsset,
        swapAssets,
        addTransaction,
        resetGemKeepState,
        setActiveWallet,
        createWallet,
        renameWallet,
        removeWallet,
        openTrade,
        closeTrade,
        devAddBalance,
        devRemoveBalance
    };

    return <GemKeepContext.Provider value={value}>{children}</GemKeepContext.Provider>;
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useGemKeepState(): GemKeepContextValue {
    const context = useContext(GemKeepContext);
    if (!context) {
        throw new Error('useGemKeepState must be used within a GemKeepProvider');
    }
    return context;
}
