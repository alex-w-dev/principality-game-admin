import React from "react";
import { hot } from "react-hot-loader";
// const reactLogo = require("./../assets/img/react_logo.svg");
import { MainConfigStore } from '../../stores/main-config.store';
import VariablesEditor from "../../pages/VariablesEditor/VariablesEditor";
import StepsEditor from '../../pages/StepsEditor/StepsEditor';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GameTesting from '../../pages/GameTesting/GameTesting';
import styles from './App.module.scss'
import ExportButton from '../ExportButton/ExportButton';

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <Router>
        <div className={styles.app}>
          <div className={styles.header}>
            <nav>
              <Link to={'/'}>Переменные</Link>
              <Link to={'/steps-editor'}>Сюжетные Шаги</Link>
              <Link to={'/random-event'}>Случайное Шаги</Link>
              <Link to={'/steps-editor'}>Критические события</Link>
              <Link to={'/game-testing'}>Тестирование</Link>
            </nav>
            <ExportButton />
          </div>
          <Route exact path="/">
            <VariablesEditor />
          </Route>
          <Route path="/steps-editor">
            <StepsEditor />
          </Route>
          <Route path="/game-testing">
            <GameTesting />
          </Route>


          {/*<img src={reactLogo.default} height="480" />*/}
        </div>
      </Router>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
