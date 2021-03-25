import React from 'react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { inject, observer } from 'mobx-react';

export default inject()(
  observer(
    function ExportButton () {
      const mainConfigStore = useMainConfigStore();

      return <button
        onClick={() => mainConfigStore.export()}
      >
        Export
      </button>
    }
  )
)
