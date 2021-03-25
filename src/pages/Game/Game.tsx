import React from 'react';
import styles from './Game.module.scss';
import { Game, IGameState } from '../../game/game';
import { mainConfigStore } from '../../hooks/use-main-config-store';
import { EventType, GameOverType, IAnswer, IEvent } from '../../stores/main-config.store';

interface State {
  currentEvent: IEvent;
  gameState: IGameState;
  isGameOver: GameOverType | null;
  currentAnswer: IAnswer;
}

export default class GamePage extends React.Component<any, State> {
  game: Game;

  constructor(props) {
    super(props);

    this.game = new Game(mainConfigStore.mainConfig);

    this.state = {
      currentEvent: this.game.getCurrentEvent(),
      gameState: this.game.getClonedGameState(),
      isGameOver: null,
      currentAnswer: null,
    }
  }

  render() {
    return <div
      className={styles.game}
    >
      <div className={styles.variables}>
        <div>
          <b>Текущее игровое состояние:</b>
        </div>
        <table>
          <tbody>
          {Object.entries(this.state.gameState.variables).map(([variableCode, value]) => {
            return <tr
              key={variableCode}
            >
              <td>{variableCode}</td>
              <td>{value}</td>
            </tr>
          })}
          </tbody>
        </table>
      </div>
      <div>
        <div className={styles.currentEvent}>
          <div>
            {/*<h4 dangerouslySetInnerHTML={{__html: this.state.currentEvent.title.ru}} />*/}
            <div>
              <b>Описание задания:</b>
            </div>
            <div dangerouslySetInnerHTML={{__html: this.state.currentEvent.text.ru}} />
            <div>
              <b>Тип события:</b>
            </div>
            <div hidden={this.state.currentEvent.type !== EventType.Common}>
              Сюжетное
            </div>
            <div hidden={this.state.currentEvent.type !== EventType.Random}>
              Случайное
            </div>
            <div hidden={this.state.currentEvent.type !== EventType.Critical}>
              Критическое
            </div>
          </div>
          <div>
            <div>
              <b>Варианты:</b>
            </div>
            {this.state.currentEvent.answers.length
              ? this.state.currentEvent.answers.map((answer, index) => {
                return <div
                  key={answer.choiceText.ru + index}
                  className={`${styles.answer} ${this.state.currentAnswer === answer && styles.active}`}
                  onClick={() => this.onChooseAnswer(answer)}
                >
                  {answer.choiceText.ru}
                </div>
              })
              : <button
                onClick={this.onMoveOnWithoutAnswers}
              >
                Всё понятно, дальше!
              </button>}
          </div>
        </div>
        <div className={styles.currentEvent}>
          {
            this.state.currentAnswer
              ? <>
                <div>
                  {/*<h4 dangerouslySetInnerHTML={{__html: this.state.currentEvent.title.ru}} />*/}
                  <div>
                    <b>Исход задания:</b>
                  </div>
                  <div dangerouslySetInnerHTML={{__html: this.state.currentAnswer.resultText.ru}} />
                </div>
                <div>
                  <div>
                    <b>Дальше:</b>
                  </div>
                  <button
                    onClick={this.onMoveOnClick}
                  >
                    Дальше
                  </button>
                </div>
              </>

              : null
          }
        </div>
      </div>
    </div>;
  }

  onChooseAnswer = (answer: IAnswer) => {
    if (this.state.currentAnswer) {
      return;
    }
    const isGameOver = this.game.giveAnswer(this.state.currentEvent, answer);
    this.setState({
      currentAnswer: answer,
      isGameOver,
      gameState: this.game.getClonedGameState(),
    })
  }

  onMoveOnWithoutAnswers = () => {
    const isGameOver = this.game.giveAnswer(this.state.currentEvent);
    this.setState({
      isGameOver,
      gameState: this.game.getClonedGameState(),
    }, () => {
      this.onMoveOnClick();
    })
  }

  onMoveOnClick = () => {
    if (this.state.isGameOver) {
      alert('Ты проиграл! Ходов больше нет!');
    } else {
      const currentEvent = this.game.getCurrentEvent();

      this.setState({
        currentEvent: currentEvent,
        currentAnswer: null,
      }, () => {
        // автоматически происходит ответ, если есть только 1 выбор
        if (currentEvent.answers.length === 1) {
          this.onChooseAnswer(currentEvent.answers[0])
        }
      })
    }
  }
}
