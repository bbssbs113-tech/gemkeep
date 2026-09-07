import React, { useContext } from 'react';

export const AppSdkContext = React.createContext<any>(null);
export const useAppSdk = () => useContext(AppSdkContext);
