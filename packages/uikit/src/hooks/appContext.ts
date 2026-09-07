import React, { useContext } from 'react';

export interface IAppContext {
    mainnetApi: any;
    testnetApi: any;
    fiat: any;
    mainnetConfig: any;
    testnetConfig: any;
    tonendpoint: any;
    standalone: boolean;
    extension: boolean;
    ios: boolean;
    proFeatures: boolean;
    hideLedger: boolean;
    hideSigner: boolean;
    hideKeystone: boolean;
    hideQrScanner: boolean;
    hideMam: boolean;
    hideMultisig: boolean;
    hideFireblocks: boolean;
    defaultWalletVersion: any;
    browserLength: number;
    tracker?: any;
}

export const AppContext = React.createContext<IAppContext>({} as IAppContext);
export const useAppContext = () => useContext(AppContext);
