import React from "react";
import { hot } from "react-hot-loader";
// const reactLogo = require("./../assets/img/react_logo.svg");
import VariablesEditor from "../../pages/VariablesEditor/VariablesEditor";
import EventsEditor from '../../pages/EventsList/EventsList';
import { BrowserRouter as Router, Route, Link, useLocation } from "react-router-dom";
import GameTesting from '../../pages/GameTesting/GameTesting';
import styles from './App.module.scss'
import ExportButton from '../ExportButton/ExportButton';
import { EventType } from '../../stores/main-config.store';
import { ImportButton } from '../ImportButton/ImportButton';
import EventEditor from '../EventEditor/EventEditor';
import GamePage from '../../pages/Game/Game';

function App () {
  return (
    <Router>
      <div className={styles.app}>
        <div className={styles.header}>
          <nav>
            <Link to={'/'}>Переменные</Link>
            <Link to={'/common-events'}>Сюжетные события</Link>
            <Link to={'/random-events'}>Случайное события</Link>
            <Link to={'/critical-events'}>Критические события</Link>
            <Link to={'/game'}>Игра</Link>
            <Link to={'/game-testing'}>Тестирование</Link>
          </nav>
          <ExportButton />
          <ImportButton />
        </div>
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


        {/*<img src={reactLogo.default} height="480" />*/}
      </div>
    </Router>
  );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
