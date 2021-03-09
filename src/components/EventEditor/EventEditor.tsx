import React from 'react';
import styles from './EventEditor.module.scss';
import { useParams } from 'react-router';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { inject, observer } from 'mobx-react';
import { eventTypeToName } from '../../utils/event-type-to-name';
import ConditionBlockEditor from '../ConditionBlockEditor/ConditionBlockEditor';
import RewardEditor from '../RewardEditor/RewardEditor';
import AnswerEditor from '../AnswerEditor/AnswerEditor';

export default inject()(
  observer(
    function EventEditor () {
      const mainConfigStore = useMainConfigStore();
      const { index } = useParams() as any;

      const event = mainConfigStore.mainConfig.events[parseInt(index)];

      return <div>
        <h2>{eventTypeToName(event.type)} (ID {index}): {event.title.ru} ({event.title.en})</h2>
        <div
          className={styles.eventEditor}
        >
          <div>
            <h4>Описание события и условие вызова:</h4>
            <hr/>
            <label >
              <div>Заголовок (РУС)</div>
              <input
                value={event.title.ru}
                onChange={(e) => mainConfigStore.setSomeData(event, 'title.ru', e.target.value) }
              />
            </label>
            <label >
              <div>Заголовок (ENG)</div>
              <input
                value={event.title.en}
                onChange={(e) => mainConfigStore.setSomeData(event, 'title.en', e.target.value) }
              />
            </label>
            <label >
              <div>Текст (РУС)</div>
              <textarea
                value={event.text.ru}
                onChange={(e) => mainConfigStore.setSomeData(event, 'text.ru', e.target.value) }
              />
            </label>
            <label >
              <div>Текст (ENG)</div>
              <textarea
                value={event.text.en}
                onChange={ (e) => mainConfigStore.setSomeData(event, 'text.en', e.target.value) }
              />
            </label>
            <label>
              <div>Условие того, что это событие вызовется:</div>
              <ConditionBlockEditor conditionBlock={event.conditionBlock} />
            </label>
          </div>
          <div>
            <h4>Вырианты ответов:</h4>
            <hr/>
            <button
              onClick={() => mainConfigStore.addAnswer(event)}
            >
              Добавить вариант ответа
            </button>

            { event.answers.map((eventAnswer, index) => {
              return <div
                className={styles.rewardContainer}
                key={index}
              >
                <AnswerEditor
                  answer={eventAnswer}
                  event={event}
                />
              </div>
            }) }
          </div>
        </div>
      </div>
    }
  )
)
