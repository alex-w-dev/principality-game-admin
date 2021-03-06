import React from 'react';
import styles from './EventsEditor.module.scss';
import { inject, observer } from 'mobx-react';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { EventType } from '../../stores/main-config.store';

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
            .map((e, i) => {
              return <div
                key={i}
              >
                {e.title.ru}
              </div>
            })
        }

      </div>;
    }
  )
)
