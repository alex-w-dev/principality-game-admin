import React from 'react';
import styles from './VariablesEditor.module.scss';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { observer } from 'mobx-react-lite';


export default observer(function VariablesEditor  () {
  const mainConfigStore = useMainConfigStore();

  return <div
    className={styles.variablesEditor}
  >
    <table>
      <thead>
      <tr>
        <td>Code</td>
        <td>Initial</td>
      </tr>
      </thead>
      <tbody>
      {mainConfigStore.mainConfig.variables.map((variable, index) => {
        return <tr
          key={index}
        >
          <td>
            <input
              value={variable.code}
              onChange={(a) => mainConfigStore.setVariableData(variable, { code: a.target.value })}
            />
          </td>
          <td>
            <input
              type="number"
              value={variable.initialValue}
              onChange={(a) => mainConfigStore.setVariableData(variable, { initialValue: parseInt(a.target.value) })}
            />
          </td>
        </tr>
      })}
      </tbody>
    </table>
  </div>
})
