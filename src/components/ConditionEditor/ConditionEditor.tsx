import React from 'react';
import styles from './ConditionEditor.module.scss';
import { ConditionSign, ICondition, IVariable } from '../../stores/main-config.store';
import { eventSignToName } from '../../utils/condition-sign-to-name';
import { inject, observer } from 'mobx-react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';

interface Props {
  condition: ICondition,
}

export default inject()(
  observer(
    function ConditionEditor(props: Props) {
      const mainConfigStore = useMainConfigStore();

      return <div
        className={styles.conditionEditor}
      >
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
                {variable.code}
              </option>
            })}
          </select>
        </span>
        <span>
          <select
            value={props.condition.sign}
            onChange={(e) => mainConfigStore.setConditionData(props.condition, { sign: +e.target.value || ConditionSign.Equal }) }
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
      </div>;
    }
  )
)
