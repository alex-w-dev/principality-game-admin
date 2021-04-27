import React from 'react';
import styles from './GameTesting.module.scss';
import { toJS } from 'mobx';
import { mainConfigStore } from '../../hooks/use-main-config-store';
import { GameTester, GameTesterStatus, ITestEvent } from '../../game/game-tester';
import { EventType, GameOverType, IVariable } from '../../stores/main-config.store';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import VariableStateTable from '../../components/VariableStateTable';
import EventDescription from '../../components/EventDescription';

function GOToColor(gameOver: GameOverType): string {
  switch (gameOver) {
    case GameOverType.Defeat: return 'red';
    case GameOverType.Win: return 'green';
    default: return 'inherit'
  }
}

const TestTable = styled.div`
  /*width: 99999px;*/
`

const TestCellText = styled.div<{gameOver?: GameOverType}>`
  min-width: 10px;
  min-height: 10px;
  color: ${props => GOToColor(props.gameOver)};
  :hover {
    cursor: pointer;
    background: #62dbff;
  }
  :focus {
    background: #62dbff;
  }
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

const Result = styled.div<{atTop: boolean}>`
  position: fixed;
  ${props => props.atTop ? 'top: 0' : 'bottom: 0'};
  left: 0;
  max-height: 50vh;
  overflow-y: auto;
  border: 1px solid black;
`

const TopForm = styled.div`
  display: grid;
  height: 90vh;
  grid-template-columns: 1fr 1fr 2fr;
`

const TopFormBlock = styled.div`
  overflow: auto;
  height: 100%;
  border-left: 1px solid #e0e0e0;
  padding: 0 5px;
  
  input {
    max-width: 70px;
  }
`


interface IState {
  useRandomEvents: boolean;
  stepsLimit: number;
  hoveredTestEvent?: ITestEvent;
  focusedTestEvent?: ITestEvent;
  resultAtTop: boolean;
  startVariables: IVariable[];
}

export default class GameTesting extends React.Component<any, IState> {

  state = {
    useRandomEvents: false,
    focusedTestEvent: false,
    stepsLimit: 10,
    startVariables: JSON.parse(JSON.stringify(mainConfigStore.mainConfig.variables)),
    resultAtTop: true,
  } as IState

  gameTester = new GameTester(mainConfigStore.mainConfig, this.state.stepsLimit);

  interval

  componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 500)
    // window.addEventListener('mousemove', this.onWindowMouseMove)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.gameTester.stop();
    // window.removeEventListener('mousemove', this.onWindowMouseMove)
  }

  onWindowMouseMove = (e) => {
    this.setState({
      resultAtTop: window.innerHeight / 2 < e.screenY,
    })
  }

  renderHoveredEvent() {
    const eventForRender = this.state.focusedTestEvent || this.state.hoveredTestEvent

    if (!eventForRender) {
      return null;
    }

    const event = eventForRender.eventIndex >= 0 ? this.gameTester.mainConfig.events[eventForRender.eventIndex] : null;

    return <table
      style={{
        background: 'white',
      }}
    >
      <thead>
      <tr>
        <td>
          Variables After Answer
        </td>
        <td>
          Event
        </td>
        <td>
          Answer
        </td>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <VariableStateTable
            variables={eventForRender.gameStateBeforeAnswer.variables}
          />
        </td>
        <td>
          {event && <EventDescription
            event={event}
          /> || 'Empty Event'}
        </td>
        <td>
          {event && event.answers.map((a, index )=> {
            const t = a.choiceText.ru || a.resultText.ru;

            return <div
              style={{ marginTop: '15px' }}
              key={index}
            >
              {index === eventForRender.answerIndex && <b>{t}</b> || t}
            </div>
          })}
        </td>
      </tr>
      </tbody>
    </table>
  }

  renderTooltip() {

    return <Result
      atTop={this.state.resultAtTop}
      onMouseEnter={() => this.setState({
        resultAtTop: !this.state.resultAtTop,
      })}
    >
      {this.renderHoveredEvent()}
    </Result>
  }

  renderResultCell(testEvent: ITestEvent) {
    return <TestCell key={`${testEvent.eventIndex}-${testEvent.answerIndex}`}>
      <TestCellText
        tabIndex={1}
        gameOver={testEvent.gameOver}
        onFocus={e => {
          e.stopPropagation();
          this.setState({
            focusedTestEvent: testEvent,
            hoveredTestEvent: testEvent,
          });
        }}
        onBlur={e => {
          e.stopPropagation();
          this.setState({
            focusedTestEvent: null,
          });
        }}
        onMouseEnter={e => {
          e.stopPropagation();

          if (this.state.focusedTestEvent) {
            return;
          }

          this.setState({
            hoveredTestEvent: testEvent,
          })
        }}
      >
        {testEvent.gameStateBeforeAnswer.variables['STEP']}
      </TestCellText>
      {testEvent.children && <TestCellChildren>
        {testEvent.children?.map(e => this.renderResultCell(e))}
      </TestCellChildren>}
    </TestCell>
  }

  cachedTable;
  cachedRestRes;
  renderResultTable() {
    if (this.gameTester.status !== GameTesterStatus.Complete) return null;

    if (!this.gameTester.testResult[0]) return null;

    if (this.cachedRestRes !== this.gameTester || !this.cachedTable) {
      this.cachedRestRes = this.gameTester;
      this.cachedTable = <TestTable
        key={this.gameTester.answeredCount}
        /*onMouseLeave={() => this.setState({hoveredTestEvent: null})}*/
      >
        {this.renderResultCell(this.gameTester.testResult[0])}
      </TestTable>
    }

    return this.cachedTable;
  }

  render() {
    return <div
      className={styles.variablesEditor}
    >
      <TopForm>
        <TopFormBlock>
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
          <div>Начать с переменных:</div>
          <table>
            <tbody>
            {this.state.startVariables.map(startVar => {
              return <tr key={startVar.code}>
                <td style={{textAlign: 'right'}}>{startVar.code}</td>
                <td>
                  <input
                    type="number"
                    min={startVar.min}
                    max={startVar.max}
                    value={startVar.initial}
                    onChange={(e) => {
                      startVar.initial = parseInt(e.target.value);
                      this.forceUpdate();
                    }}
                  />
                </td>
              </tr>
            })}
            </tbody>
          </table>

          <br/>
          <button
            disabled={this.gameTester.status !== GameTesterStatus.Complete}
            onClick={() =>{
              const config  = toJS(mainConfigStore.mainConfig);

              if (!this.state.useRandomEvents) {
                config.events = config.events.filter(e => e.type !== EventType.Random);
              }
              config.variables = JSON.parse(JSON.stringify(this.state.startVariables));

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
        </TopFormBlock>
        <TopFormBlock>
          Статус: {this.gameTester.status}, проверено: {this.gameTester.answeredCount}, осталось: {this.gameTester.needToNextEvent.length}
          <hr/>
          <div>
            Результаты:
          </div>
          <div>
            случаи когда была явная победа (коллво): {this.gameTester.gameOverWinsCount}
          </div>
          <div>
            случаи когда был проигрыш: {this.gameTester.gameOverDefeatsCount}
          </div>
          {
            this.renderResultTable()
          }
        </TopFormBlock>
        <TopFormBlock>
          {this.renderHoveredEvent()}
        </TopFormBlock>
      </TopForm>

      {/*{
        this.renderTooltip()
      }*/}
    </div>;
  }
}
