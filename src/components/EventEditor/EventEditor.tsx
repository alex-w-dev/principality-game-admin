import React from 'react';
import styles from './EventEditor.module.scss';
import { useParams } from 'react-router';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { inject, observer } from 'mobx-react';
import { eventTypeToName } from '../../utils/event-type-to-name';
import ConditionBlockEditor from '../ConditionBlockEditor/ConditionBlockEditor';
import AnswerEditor from '../AnswerEditor/AnswerEditor';
import { EventType, GameOverType, IEvent, MainConfigStore } from '../../stores/main-config.store';

function renderVariants(mainConfigStore: MainConfigStore, event: IEvent) {
  return <>
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
  </>
}

function renderCriticalEnd(mainConfigStore: MainConfigStore, event: IEvent) {
  return <>
    <h4>Исход игры:</h4>
    <hr/>
    <select
      value={event.gameOver}
      onChange={(e) => mainConfigStore.setSomeData(event, 'gameOver', +e.target.value)}
    >
      <option value={GameOverType.Win}>Победа</option>
      <option value={GameOverType.Defeat}>Поражение</option>
    </select>
  </>
}

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
            {
              (event.type === EventType.Critical)
                ? renderCriticalEnd(mainConfigStore, event)
                : renderVariants(mainConfigStore, event)
            }
          </div>
        </div>
      </div>
    }
  )
)
