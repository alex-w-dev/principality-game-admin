import React from "react";
import { hot } from "react-hot-loader";
// const reactLogo = require("./../assets/img/react_logo.svg");
import VariablesEditor from "../../pages/VariablesEditor/VariablesEditor";
import EventsEditor from '../../pages/EventsList/EventsList';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GameTesting from '../../pages/GameTesting/GameTesting';
import styles from './App.module.scss'
import ExportButton from '../ExportButton/ExportButton';
import { EventType } from '../../stores/main-config.store';
import { ImportButton } from '../ImportButton/ImportButton';
import EventEditor from '../EventEditor/EventEditor';
import GamePage from '../../pages/Game/Game';
import { useMainConfigStore } from '../../hooks/use-main-config-store';
import { inject, observer } from 'mobx-react';

const StoredApp = inject()(
  observer(
    function App () {
      const mainConfigStore = useMainConfigStore();

      let commonLength = 0;
      let criticalLength = 0;
      let randomLength = 0;

      mainConfigStore.mainConfig.events.forEach((e) => {
        switch (e.type) {
          case EventType.Common:
            commonLength++;
            break;
          case EventType.Critical:
            criticalLength++;
            break;
          case EventType.Random:
            randomLength++;
            break;
        }
      })


      return (
        <Router>
          <div className={styles.app}>
            <div className={styles.header}>
              <nav>
                <Link to={'/'}>Переменные ({mainConfigStore.mainConfig.variables.length})</Link>
                <Link to={'/common-events'}>Сюжетные события ({commonLength})</Link>
                <Link to={'/random-events'}>Случайное события ({randomLength})</Link>
                <Link to={'/critical-events'}>Критические события ({criticalLength})</Link>
                <Link to={'/game'}>Игра</Link>
                <Link to={'/game-testing'}>Тестирование</Link>
              </nav>
              <ExportButton />
              <ImportButton />
            </div>

            <div style={{marginTop: '15px'}}>
              <Route exact path="/">
                <VariablesEditor />
              </Route>
              <Route exact path="/common-events">
                <EventsEditor
                  eventType={EventType.Common}
                />
              </Route>
              <Route exact path="/random-events">
                <EventsEditor
                  eventType={EventType.Random}
                />
              </Route>
              <Route exact path="/critical-events">
                <EventsEditor
                  eventType={EventType.Critical}
                />
              </Route>
              <Route exact path="/game-testing">
                <GameTesting />
              </Route>
              <Route exact path="/game">
                <GamePage />
              </Route>
              <Route path={['/common-events/:index', '/critical-events/:index', '/random-events/:index']} >
                <EventEditor />
              </Route>
            </div>


            {/*<img src={reactLogo.default} height="480" />*/}
          </div>
        </Router>
      );
    }
  )
)

declare let module: Record<string, unknown>;

export default hot(module)(StoredApp);
