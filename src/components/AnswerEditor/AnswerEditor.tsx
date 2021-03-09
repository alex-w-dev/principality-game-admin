import React from 'react';
import styles from './AnswerEditor.module.scss';
import { inject, observer } from 'mobx-react';
import { IAnswer, IEvent, IStepReward } from '../../stores/main-config.store';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import ConditionBlockEditor from '../ConditionBlockEditor/ConditionBlockEditor';
import RewardEditor from '../RewardEditor/RewardEditor';

interface Props {
  event: IEvent;
  answer: IAnswer;
}

export default inject()(
  observer(
    function AnswerEditor (props: Props){
      const mainConfigStore = useMainConfigStore();

      return <div
        className={styles.answerEditor}
      >
        <div
          className={styles.answerEditorDeleteButtonContainer}
        >
          <button
            onClick={() => mainConfigStore.removeAnswer(props.event, props.answer)}
          >Удалить вариант</button>
        </div>
        <label >
          <div>Текст (РУС)</div>
          <textarea
            value={props.answer.text.ru}
            onChange={(e) => mainConfigStore.setSomeData(props.answer, 'text.ru', e.target.value) }
          />
        </label>
        <label >
          <div>Текст (ENG)</div>
          <textarea
            value={props.answer.text.en}
            onChange={ (e) => mainConfigStore.setSomeData(props.answer, 'text.en', e.target.value) }
          />
        </label>
        <label>
          <div>Условие того, что этот вариант ответа будет доступен (без условий доступен всегда):</div>
          <ConditionBlockEditor conditionBlock={props.answer.conditionBlock} />
        </label>
        <div>
          <div>
            <span>Вгознограждения для этого варианта:</span>
          </div>
          { props.answer.rewards.map((reward, index ) => {
            return <div
              key={index}
            >
              <RewardEditor
                reward={reward}
                answer={props.answer}
              />
            </div>
          }) }
        </div>
        <button
          onClick={() => mainConfigStore.answerAddNewReward(props.answer)}
        >Добавить награду</button>

      </div>
    }
  )
)
