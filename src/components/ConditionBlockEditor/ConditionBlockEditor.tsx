import React from 'react';
import styles from './ConditionBlockEditor.module.scss';
import { ConditionBlockType, ICondition, IConditionBlock } from '../../stores/main-config.store';
import ConditionEditor from '../ConditionEditor/ConditionEditor';
import { inject, observer } from 'mobx-react';

interface Props {
  conditionBlock: IConditionBlock,
}

export default inject()(
  observer(
    function ConditionBlockEditor(props: Props) {
      return <div
        className={styles.conditionBlockEditor}
      >
        <div><b dangerouslySetInnerHTML={{ __html: `${props.conditionBlock.conditionType === ConditionBlockType.And ? 'И' : 'ИЛИ'} {` }} /></div>
        {
          props.conditionBlock.conditions.map((cond, index) => {
            return <div
              className={styles.conditionBlockEditorCondition}
              key={index}
            >
              {
                ((cond as IConditionBlock).conditionType)
                  ? <ConditionBlockEditor conditionBlock={cond as IConditionBlock} />
                  : <ConditionEditor condition={cond as ICondition} />
              }
            </div>
          })
        }
        <div><b dangerouslySetInnerHTML={{ __html: '}' }} /></div>
      </div>;
    }
  )

)
