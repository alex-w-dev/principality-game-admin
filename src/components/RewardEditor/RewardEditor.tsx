import React from 'react';
import styles from './RewardEditor.module.scss';
import { inject, observer } from 'mobx-react';
import { IAnswer, IStepReward } from '../../stores/main-config.store';
import { useMainConfigStore } from '../../hooks/use-main-config-store';

interface Props {
  reward: IStepReward;
  answer: IAnswer;
}

export default inject()(
  observer(
    function RewardEditor (props: Props){
      const mainConfigStore = useMainConfigStore();

      return <div
        className={styles.rewardEditor}
      >
        <select
          value={props.reward.variableCode}
          onChange={(e) => mainConfigStore.setRewardData(props.reward, { variableCode: e.target.value }) }
        >
          {mainConfigStore.mainConfig.variables.map((variable) => {
            return <option
              key={variable.code}
              value={variable.code}>
              {variable.code}
            </option>
          })}
        </select>
        <input
          type="number"
          value={props.reward.value}
          onChange={(e) => mainConfigStore.setRewardData(props.reward, { value: +e.target.value || 0 }) }
        />

        <button
          onClick={() => mainConfigStore.removeReward(props.answer, props.reward)}
        >
          Удалить
        </button>

      </div>
    }
  )
)
