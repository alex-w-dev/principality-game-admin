import React from 'react';
import styles from './ConditionBlockEditor.module.scss';
import { ConditionBlockType, ICondition, IConditionBlock } from '../../stores/main-config.store';
import ConditionEditor from '../ConditionEditor/ConditionEditor';
import { inject, observer } from 'mobx-react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { useForceUpdate } from '../../hooks/use-force-update';

interface Props {
  conditionBlock: IConditionBlock,
  parentConditionBlock?: IConditionBlock,
  onRemove?: () => void
}

export default inject()(
  observer(
    function ConditionBlockEditor(props: Props) {
      const mainConfigStore = useMainConfigStore();
      const forceUpdate = useForceUpdate();

      return <div
        className={styles.conditionBlockEditor}
      >
        <div
          className={styles.conditionBlockEditorBlockStart}
        >
          <div>
            <select
              value={props.conditionBlock.type}
              onChange={(e) => {
                mainConfigStore.setConditionBlockType(props.conditionBlock, +e.target.value )
                forceUpdate()
              } }
            >
              <option value={ConditionBlockType.And}>И</option>
              <option value={ConditionBlockType.Or}>ИЛИ</option>
            </select>
            <b dangerouslySetInnerHTML={{ __html: ` {` }} />
          </div>
          <div>
            <button
              onClick={() => {
                mainConfigStore.conditionBlockAddCondition(props.conditionBlock)
                forceUpdate()
              }}
            >+ Условие</button>
            <button
              onClick={() => {
                mainConfigStore.conditionBlockAddConditionBlock(props.conditionBlock)
                forceUpdate()
              }}
            >+ Блок Условий</button>
            {
              props.parentConditionBlock && <button
                className={styles.removeConditionsBLockButton}
                onClick={() => {
                  mainConfigStore.removeConditionBlock(props.conditionBlock, props.parentConditionBlock)
                  props.onRemove?.();
                }}
              >Удалить блок</button>
            }
          </div>
        </div>
        {
          props.conditionBlock.conditions.map((cond, index) => {
            return <div
              className={styles.conditionBlockEditorCondition}
              key={index}
            >
              {
                (!!(cond as IConditionBlock).conditions)
                  ? <ConditionBlockEditor
                      conditionBlock={cond as IConditionBlock}
                      parentConditionBlock={props.conditionBlock}
                      onRemove={forceUpdate}
                    />
                  : <ConditionEditor
                      condition={cond as ICondition}
                      parentConditionBlock={props.conditionBlock}
                      onRemove={forceUpdate}
                    />
              }
            </div>
          })
        }
        <div
          className={styles.conditionBlockEditorBlockStart}
        ><b dangerouslySetInnerHTML={{ __html: '}' }} /></div>
      </div>;
    }
  )

)
