import React from 'react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';

export default function ExportButton () {
  const mainConfigStore = useMainConfigStore();

  return <button
    onClick={() => mainConfigStore.export()}
  >
    Export {mainConfigStore.mainConfig.variables.length}
  </button>
}
