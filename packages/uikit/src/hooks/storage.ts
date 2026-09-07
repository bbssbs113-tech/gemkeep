import React, { useContext } from 'react';

export const StorageContext = React.createContext<any>(null);
export const useStorage = () => useContext(StorageContext);
