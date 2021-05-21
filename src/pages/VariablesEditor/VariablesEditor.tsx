import React from 'react';
import styles from './VariablesEditor.module.scss';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { inject, observer } from 'mobx-react';
// import SortableList from '../../components/SortableList/SortableList';
// import { runInAction } from 'mobx';

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

      {/*<div className={styles.variablesEditorHeader}>*/}
      {/*  <div>Код</div>*/}
      {/*  <div>Первоначатьное значение</div>*/}
      {/*  <div>Минимальное значение</div>*/}
      {/*  <div>Максимальное значение</div>*/}
      {/*  <div>Действия</div>*/}
      {/*</div>*/}

      {/*<SortableList*/}
      {/*  items={mainConfigStore.mainConfig.variables}*/}
      {/*  onNewList={sorted => runInAction(() => mainConfigStore.mainConfig.variables = sorted )}*/}
      {/*  renderItem={(variable, index) => <div*/}
      {/*    className={styles.variablesEditorLine}*/}
      {/*  >*/}
      {/*    <div>*/}
      {/*      <input*/}
      {/*        value={variable.code}*/}
      {/*        onChange={(a) => mainConfigStore.setVariableData(variable, { code: a.target.value })}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <input*/}
      {/*        type="number"*/}
      {/*        value={variable.initial}*/}
      {/*        onChange={(a) => {*/}
      {/*          mainConfigStore.setVariableData(variable, { initial: a.target.value === '' ? 0 : parseInt(a.target.value) })*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <input*/}
      {/*        type="number"*/}
      {/*        value={variable.min}*/}
      {/*        onChange={(a) => {*/}
      {/*          mainConfigStore.setVariableData(variable, { min: a.target.value === '' ? a.target.value : parseInt(a.target.value) })}*/}
      {/*        }*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <input*/}
      {/*        type="number"*/}
      {/*        value={variable.max}*/}
      {/*        onChange={(a) => {*/}
      {/*          mainConfigStore.setVariableData(variable, { max: a.target.value === '' ? a.target.value : parseInt(a.target.value) })}*/}
      {/*        }*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <button*/}
      {/*        onClick={() => mainConfigStore.removeVariable(variable)}*/}
      {/*      >Удалить</button>*/}
      {/*    </div>*/}
      {/*  </div>}*/}
      {/*/>*/}


      <table>
        <thead>
        <tr>
          <td>Название (для понимания)</td>
          <td><b>Код</b></td>
          <td>Описание (если надо)</td>
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
                value={variable.title}
                onChange={(a) => mainConfigStore.setVariableData(variable, { title: a.target.value })}
              />
            </td>
            <td>
              <input
                value={variable.code}
                onChange={(a) => mainConfigStore.setVariableData(variable, { code: a.target.value })}
              />
            </td>
            <td>
              <textarea
                value={variable.description}
                onChange={(a) => mainConfigStore.setVariableData(variable, { description: a.target.value })}
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
