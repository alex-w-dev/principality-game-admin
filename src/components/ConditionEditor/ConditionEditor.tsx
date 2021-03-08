import React from 'react';
import styles from './ConditionEditor.module.scss';
import { ICondition } from '../../stores/main-config.store';
import { eventSignToName } from '../../utils/condition-sign-to-name';
import { inject, observer } from 'mobx-react';

interface Props {
  condition: ICondition,
}

export default inject()(
  observer(
    function ConditionEditor(props: Props) {
      return <div
        className={styles.conditionEditor}
      >
        Если { props.condition.variableCode } { eventSignToName(props.condition.sign) } <input
          type="number"
          value={props.condition.value}
          onChange={(e) => props.condition.value = +e.target.value || 0}
        />
      </div>;
    }
  )
)
