import React from 'react';
import styles from './GameTesting.module.scss';
import { toJS } from 'mobx';
import { mainConfigStore } from '../../hooks/use-main-config-store';
import { GameTester, GameTesterStatus, ITestEvent } from '../../game/game-tester';
import { EventType, GameOverType } from '../../stores/main-config.store';
import styled from 'styled-components';

function GOToColor(gameOver: GameOverType): string {
  switch (gameOver) {
    case GameOverType.Defeat: return 'red';
    case GameOverType.Win: return 'green';
    default: return 'inherit'
  }
}

const TestTable = styled.div`
  width: 99999px;
`

const TestCellText = styled.div<{gameOver?: GameOverType}>`
  min-width: 10px;
  min-height: 10px;
  background: ${props => GOToColor(props.gameOver)};
`

const TestCell = styled.div`
  display: flex;
`
const TestCellChildren = styled.div`
  min-width: 10px;
  min-height: 10px;
  border: 1px solid #e2e2e2;
  margin-left: 5px;
`

interface Stats {
  useRandomEvents: boolean;
  stepsLimit: number;
}

export default class GameTesting extends React.Component<any, Stats> {

  state = {
    useRandomEvents: false,
    stepsLimit: 10,
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

  renderResultCell(testEvent: ITestEvent) {
    return <TestCell key={`${testEvent.eventIndex}-${testEvent.answerIndex}`}>
      <TestCellText gameOver={testEvent.gameOver}>{testEvent.eventIndex}/{testEvent.answerIndex}</TestCellText>
      {testEvent.children && <TestCellChildren>
        {testEvent.children?.map(e => this.renderResultCell(e))}
      </TestCellChildren>}
    </TestCell>
  }

  renderResultTable() {
    if (this.gameTester.status !== GameTesterStatus.Complete) return null;

    if (!this.gameTester.testResult[0]) return null;

    return <TestTable>
      {this.renderResultCell(this.gameTester.testResult[0])}
    </TestTable>;
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
      {
        this.renderResultTable()
      }
    </div>;
  }
}
