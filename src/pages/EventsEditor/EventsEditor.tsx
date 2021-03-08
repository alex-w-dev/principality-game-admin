import React from 'react';
import styles from './EventsEditor.module.scss';
import { inject, observer } from 'mobx-react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { EventType } from '../../stores/main-config.store';
import { Link } from 'react-router-dom';

export default inject()(
  observer(

    function EventsEditor(props: { eventType: EventType }) {
      const mainConfigStore = useMainConfigStore();

      return <div
        className={styles.variablesEditor}
      >
        <button
          onClick={() => mainConfigStore.addNewEvent(props.eventType)}
        >Добавить событие</button>
        <hr/>
        {
          mainConfigStore.mainConfig.events
            .filter(e => e.type === props.eventType)
            .map((e, index) => {
              return <div
                key={index}
              >
                <Link
                  to={`/edit-event/${index}`}
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
