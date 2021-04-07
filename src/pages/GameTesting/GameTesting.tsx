import React from 'react';
import styles from './GameTesting.module.scss';
import { toJS } from 'mobx';
import { mainConfigStore } from '../../hooks/use-main-config-store';
import { GameTester } from '../../game/game-tester';
import { EventType } from '../../stores/main-config.store';

interface Stats {
  useRandomEvents: boolean;
}

export default class GameTesting extends React.Component<any, Stats> {

  gameTester = new GameTester(mainConfigStore.mainConfig);

  state = {
    useRandomEvents: true,
  }

  interval

  componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 500)

  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.gameTester.stop();
  }


  render() {
    return <div
      className={styles.variablesEditor}
    >
      <label>
        <span>Включать случайные события</span>
        <input
          type="checkbox"
          checked={this.state.useRandomEvents}
          onChange={(e) => {
            this.setState({
              useRandomEvents: e.target.checked,
            })
          }}
        />
      </label>
      --|--
      <button onClick={() =>{
        const config  = toJS(mainConfigStore.mainConfig);

        if (!this.state.useRandomEvents) {
          config.events = config.events.filter(e => e.type !== EventType.Random);
        }

        this.gameTester = new GameTester(config);
        this.gameTester.startCompleteTest();
        this.forceUpdate();
      } }>Старт</button>
      <hr/>
      Статус: {this.gameTester.status}, проверено: {this.gameTester.answeredCount}, осталось: {this.gameTester.needToNextEvent.length}
      <hr/>
      <div>
        Результаты:
      </div>
      <div>
        случаи когда была явная победа (коллво): {this.gameTester.gameOverWinsCount}
      </div>
      <div>
        случаи когда был проигрыш: {this.gameTester.gameOverDefeats.length}
      </div>
    </div>;
  }
}
