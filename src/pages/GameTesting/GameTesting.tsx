import React from 'react';
import styles from './GameTesting.module.scss';
import { toJS } from 'mobx';
import { mainConfigStore } from '../../hooks/use-main-config-store';
import { GameTester, GameTesterStatus } from '../../game/game-tester';
import { EventType } from '../../stores/main-config.store';

interface Stats {
  useRandomEvents: boolean;
  stepsLimit: number;
}

export default class GameTesting extends React.Component<any, Stats> {

  state = {
    useRandomEvents: true,
    stepsLimit: 50,
  }

  gameTester = new GameTester(mainConfigStore.mainConfig, this.state.stepsLimit);

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
      <br/>
      <label>
        <span>Лимит ходов</span>
        <input
          type="number"
          value={this.state.stepsLimit}
          onChange={(e) => {
            this.setState({
              stepsLimit: parseInt(e.target.value),
            })
          }}
        />
      </label>
      <br/>
      <button
        disabled={this.gameTester.status !== GameTesterStatus.Complete}
        onClick={() =>{
          const config  = toJS(mainConfigStore.mainConfig);

          if (!this.state.useRandomEvents) {
            config.events = config.events.filter(e => e.type !== EventType.Random);
          }

          this.gameTester = new GameTester(config, this.state.stepsLimit);
          this.gameTester.startCompleteTest();
          this.forceUpdate();
        } }
      >Старт</button>
      <button
        disabled={this.gameTester.status !== GameTesterStatus.Process}
        onClick={() =>{
          this.gameTester.stop();
          this.forceUpdate();
        } }
      >Stop</button>
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
