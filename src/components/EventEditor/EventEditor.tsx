import React from 'react';
import styles from './EventEditor.module.scss';
import { useParams } from 'react-router';
import { useMainConfigStore } from '../../hooks/use-main-config-store';

export default function EventEditor () {
  const mainConfigStore = useMainConfigStore();
  const { index } = useParams() as any;

  return <div
    className={styles.eventEditor}
  >
    {mainConfigStore.mainConfig.events[parseInt(index)].title.ru}
  </div>
}
