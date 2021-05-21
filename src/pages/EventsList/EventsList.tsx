import React from 'react';
import styles from './EventsList.module.scss';
import { inject, observer } from 'mobx-react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import {
  EventType,
} from '../../stores/main-config.store';
import { Link, useRouteMatch } from 'react-router-dom';
import { eventTypeToName } from '../../utils/event-type-to-name';
import SortableList from '../../components/SortableList/SortableList';
import { runInAction } from 'mobx';
import { stringifyCondition } from '../../utils/stringify-condition';



export default inject()(
  observer(

    function EventsEditor(props: { eventType: EventType }) {
      const mainConfigStore = useMainConfigStore();
      const routerMatch = useRouteMatch()

      return <div
        className={styles.variablesEditor}
      >
        <button
          onClick={() => mainConfigStore.addNewEvent(props.eventType)}
        >
          Добавить {eventTypeToName(props.eventType)}
        </button>
        <hr/>
        <SortableList
          items={mainConfigStore.mainConfig.events.filter(e => e.type === props.eventType)}
          onNewList={sorted => {
            runInAction(() => {
              mainConfigStore.mainConfig.events = [
                ...mainConfigStore.mainConfig.events.filter(e => !sorted.includes(e)),
                ...sorted,
              ]
            })
          }}
          renderItem={(e, index) => {
            return <div
              key={index}
              className={styles.eventListItem}
            >
              <Link
                to={`${routerMatch.url}/${mainConfigStore.mainConfig.events.indexOf(e)}`}
                className={styles.eventListItemLink}
              >
                {e.title.ru}
              </Link>
              <div>
                {stringifyCondition(e.conditionBlock)}
              </div>
              <button
                onClick={() => mainConfigStore.removeEvent(e)}
              >
                Удалить
              </button>
            </div>
          }}
        />

      </div>;
    }
  )
)
