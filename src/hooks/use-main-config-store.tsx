import React from 'react'
import { MainConfigStore } from '../stores/main-config.store';

export const mainConfigStore = new MainConfigStore();

const storesContext = React.createContext(mainConfigStore)

export const useMainConfigStore = () => React.useContext(storesContext)
