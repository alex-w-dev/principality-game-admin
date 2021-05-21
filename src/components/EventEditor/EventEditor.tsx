import React from 'react';
import styles from './EventEditor.module.scss';
import { useParams } from 'react-router';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { inject, observer } from 'mobx-react';
import { eventTypeToName } from '../../utils/event-type-to-name';
import ConditionBlockEditor from '../ConditionBlockEditor/ConditionBlockEditor';
import AnswerEditor from '../AnswerEditor/AnswerEditor';
import { IEvent, MainConfigStore } from '../../stores/main-config.store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { stringifyCondition } from '../../utils/stringify-condition';
import styled from 'styled-components';

const SmallFontsize = styled.span`
 font-size: 11px;
`
const GrayFont = styled.span`
 color: gray;
`
const RedFont = styled.span`
  color: #f84949;
`
const GreenFont = styled.span`
  color: #33bb2e;
`

function renderVariants(mainConfigStore: MainConfigStore, event: IEvent) {
  return <>
    <h4>Варианты ответов:</h4>
    <hr/>
    <button
      onClick={() => mainConfigStore.addAnswer(event)}
    >
      Добавить вариант ответа
    </button>

    {event.answers.length === 1 && <div className={styles.info}>
      Если вариант выбора только 1, то он автоматически выберется и описание события не будет показано, будет отображаться сразу исход этого ответа.
    </div>}

    {event.answers.length === 0 && <div className={styles.info}>
      Если нет вариантов, то будет показано только описание события и кнопка &#34;Далее&#34;
    </div>}

    <Tabs>
      <TabList>
        { event.answers.map((eventAnswer, index) => {
          return <Tab
            key={index}
          >
            <div>
              {index} - {eventAnswer.rewards.map((reward) => <>
                <SmallFontsize>{reward.variableCode}: &nbsp;</SmallFontsize>
                {reward.value > 0
                  ? <GreenFont>+{reward.value.toString()}</GreenFont>
                  : <RedFont>{reward.value.toString()}</RedFont>}
                ;
              </>) }
              {!eventAnswer.rewards.length && <GrayFont>без изменений</GrayFont>}
            </div>
            {!!eventAnswer.conditionBlock?.conditions?.length && <div>
              <SmallFontsize>
                {stringifyCondition(eventAnswer.conditionBlock)}
              </SmallFontsize>
            </div>}
          </Tab>
        }) }
      </TabList>


      { event.answers.map((eventAnswer, index) => {
        return <TabPanel
          key={index}
        >
          <div
            className={styles.rewardContainer}
          >
            <AnswerEditor
              answer={eventAnswer}
              event={event}
            />
          </div>
        </TabPanel>
      }) }
    </Tabs>

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
              renderVariants(mainConfigStore, event)
            }
          </div>
        </div>
      </div>
    }
  )
)
