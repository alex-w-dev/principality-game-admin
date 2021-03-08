import React from 'react';
import styles from './EventsEditor.module.scss';
import { inject, observer } from 'mobx-react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { EventType } from '../../stores/main-config.store';
import { Link, useRouteMatch } from 'react-router-dom';
import { eventTypeToName } from '../../utils/event-type-to-name';

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
        >Добавить {eventTypeToName(props.eventType)}</button>
        <hr/>
        {
          mainConfigStore.mainConfig.events
            .filter(e => e.type === props.eventType)
            .map((e, index) => {
              return <div
                key={index}
              >
                <Link
                  to={`${routerMatch.url}/${mainConfigStore.mainConfig.events.indexOf(e)}`}
                >
                  {index}. {e.title.ru}
                </Link>
              </div>
            })
        }

      </div>;
    }
  )
)
