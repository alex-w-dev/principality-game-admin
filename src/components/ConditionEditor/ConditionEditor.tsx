import React from 'react';
import styles from './ConditionEditor.module.scss';
import { ConditionSign, ICondition, IConditionBlock, IVariable } from '../../stores/main-config.store';
import { eventSignToName } from '../../utils/condition-sign-to-name';
import { inject, observer } from 'mobx-react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { getVariableName } from '../../utils/get-variable-name';

interface Props {
  condition: ICondition,
  parentConditionBlock?: IConditionBlock,
  onRemove?: () => void
}

export default inject()(
  observer(
    function ConditionEditor(props: Props) {
      const mainConfigStore = useMainConfigStore();

      return <div
        className={styles.conditionEditor}
      >
        <div>
          <span>
            Если
          </span>
            <span>
            <select
              value={props.condition.variableCode}
              onChange={(e) => mainConfigStore.setConditionData(props.condition, { variableCode: e.target.value }) }
            >
              {mainConfigStore.mainConfig.variables.map((variable) => {
                return <option
                  key={variable.code}
                  value={variable.code}>
                  {getVariableName(variable)}
                </option>
              })}
            </select>
          </span>
            <span>
            <select
              value={props.condition.sign}
              onChange={(e) => mainConfigStore.setConditionData(props.condition, { sign: +e.target.value }) }
            >
              <option value={ConditionSign.Equal}>{eventSignToName(ConditionSign.Equal)}</option>
              <option value={ConditionSign.GreaterThan}>{eventSignToName(ConditionSign.GreaterThan)}</option>
              <option value={ConditionSign.LessThan}>{eventSignToName(ConditionSign.LessThan)}</option>
            </select>
          </span>
            <span>
            <input
              type="number"
              value={props.condition.value}
              onChange={(e) => mainConfigStore.setConditionData(props.condition, { value: +e.target.value || 0 }) }
            />
          </span>
        </div>
        <div>
          {
            props.parentConditionBlock && <button
              className={styles.removeConditionsBLockButton}
              onClick={() => {
                mainConfigStore.removeCondition(props.condition, props.parentConditionBlock)
                props.onRemove?.();
              }}
            >Удалить условие</button>
          }
        </div>
      </div>;
    }
  )
)
