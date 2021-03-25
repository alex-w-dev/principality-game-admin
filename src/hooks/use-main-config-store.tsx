import React, { useState } from 'react'
import { MainConfigStore } from '../stores/main-config.store';
import { setState } from 'expect/build/jestMatchersObject';
import { useObserver } from 'mobx-react-lite';

export const mainConfigStore = new MainConfigStore();

const storesContext = React.createContext(mainConfigStore)

export const useMainConfigStore = () => {
  return React.useContext(storesContext)
}

export function useMainConfigStore2() {
  const _mainConfigStore = useMainConfigStore();

  return useObserver(() => (
    _mainConfigStore
  ))
}
