import React from 'react';
import styles from './VariablesEditor.module.scss';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { inject, observer } from 'mobx-react';


export default inject()(
  observer(function VariablesEditor  () {
    const mainConfigStore = useMainConfigStore();

    return <div
      className={styles.variablesEditor}
    >
      <button
        onClick={() => mainConfigStore.addNewVariable()}
      >Добавить переменную</button>
      <hr/>
      <table>
        <thead>
        <tr>
          <td>Код</td>
          <td>Первоначатьное значение</td>
          <td>Минимальное значение</td>
          <td>Максимальное значение</td>
          <td>Действия</td>
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
                value={variable.initial}
                onChange={(a) => {
                  mainConfigStore.setVariableData(variable, { initial: a.target.value === '' ? 0 : parseInt(a.target.value) })
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={variable.min}
                onChange={(a) => {
                  mainConfigStore.setVariableData(variable, { min: a.target.value === '' ? a.target.value : parseInt(a.target.value) })}
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={variable.max}
                onChange={(a) => {
                  mainConfigStore.setVariableData(variable, { max: a.target.value === '' ? a.target.value : parseInt(a.target.value) })}
                }
              />
            </td>
            <td>
              <button
                onClick={() => mainConfigStore.removeVariable(variable)}
              >Удалить</button>
            </td>
          </tr>
        })}
        </tbody>
      </table>
    </div>
  })
)
