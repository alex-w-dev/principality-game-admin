import React from 'react'
import { MainConfigStore } from '../stores/main-config.store';

const storesContext = React.createContext(new MainConfigStore())

export const useMainConfigStore = () => React.useContext(storesContext)
