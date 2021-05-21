import React from 'react';
import styles from './AnswerEditor.module.scss';
import { inject, observer } from 'mobx-react';
import { GameOverType, IAnswer, IEvent, IStepReward } from '../../stores/main-config.store';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import ConditionBlockEditor from '../ConditionBlockEditor/ConditionBlockEditor';
import RewardEditor from '../RewardEditor/RewardEditor';
import { ImageContainer } from '../EventEditor/EventEditor';

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
            value={props.answer.choiceText.ru}
            onChange={(e) => mainConfigStore.setSomeData(props.answer, 'choiceText.ru', e.target.value) }
          />
        </label>
        <label >
          <div>Текст (ENG)</div>
          <textarea
            value={props.answer.choiceText.en}
            onChange={ (e) => mainConfigStore.setSomeData(props.answer, 'choiceText.en', e.target.value) }
          />
        </label>
        <label>
          <div>Условие того, что этот вариант ответа будет доступен (без условий доступен всегда):</div>
          <ConditionBlockEditor conditionBlock={props.answer.conditionBlock} />
        </label>
        <label >
          Закончить игру?
          <select
            value={props.answer.gameOver}
            onChange={(e) => mainConfigStore.setSomeData(props.answer, 'gameOver', +e.target.value || undefined)}
          >
            <option>Игра продолжается</option>
            <option value={GameOverType.Win}>Победа</option>
            <option value={GameOverType.Defeat}>Поражение</option>
          </select>
        </label>
        <div>
          <div>
            <span>Вгознаграждения для этого варианта:</span>
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
        <label>
          <br/>
          <button
            onClick={() => mainConfigStore.answerAddNewReward(props.answer)}
          >Добавить награду</button>
        </label>
        <label >
          <div>Исход (РУС)</div>
          <textarea
            value={props.answer.resultText.ru}
            onChange={(e) => mainConfigStore.setSomeData(props.answer, 'resultText.ru', e.target.value) }
          />
        </label>
        <label >
          <div>Исход (ENG)</div>
          <textarea
            value={props.answer.resultText.en}
            onChange={ (e) => mainConfigStore.setSomeData(props.answer, 'resultText.en', e.target.value) }
          />
        </label>

        <label >
          <div>Изображение</div>
          <input
            value={props.answer.imageUrl}
            onChange={ (e) => mainConfigStore.setSomeData(props.answer, 'imageUrl', e.target.value) }
          />
          {props.answer.imageUrl && <ImageContainer>
            <img src={props.answer.imageUrl} alt=""/>
          </ImageContainer>}
        </label>
        <label >
          <div>Голос (РУС)</div>
          <input
            value={props.answer.voiceUrl.ru}
            onChange={ (e) => mainConfigStore.setSomeData(props.answer, 'voiceUrl.ru', e.target.value) }
          />
          {props.answer.voiceUrl.ru && <audio src={props.answer.voiceUrl.ru} controls/>}
        </label>
        <label >
          <div>Голос (ENG)</div>
          <input
            value={props.answer.voiceUrl.en}
            onChange={ (e) => mainConfigStore.setSomeData(props.answer, 'voiceUrl.en', e.target.value) }
          />
          {props.answer.voiceUrl.en && <audio src={props.answer.voiceUrl.en} controls/>}
        </label>

      </div>
    }
  )
)
