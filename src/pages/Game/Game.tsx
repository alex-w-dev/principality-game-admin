import React from 'react';
import styles from './Game.module.scss';
import { Game, IGameState } from '../../game/game';
import { mainConfigStore } from '../../hooks/use-main-config-store';
import { EventType, GameOverType, IAnswer, IEvent } from '../../stores/main-config.store';
import VariableStateTable from '../../components/VariableStateTable';
import EventDescription from '../../components/EventDescription';
import { ImageContainer } from '../../components/EventEditor/EventEditor';

interface State {
  currentEvent: IEvent;
  gameState: IGameState;
  isGameOver: GameOverType | null;
  currentAnswer: IAnswer;
  isGameStarted: boolean;
}

export default class GamePage extends React.Component<any, State> {
  game: Game;

  private currentAudio: HTMLAudioElement;

  constructor(props) {
    super(props);

    this.game = new Game(mainConfigStore.mainConfig);

    this.state = {
      currentEvent: null,
      gameState: this.game.getClonedGameState(),
      isGameOver: null,
      isGameStarted: false,
      currentAnswer: null,
    }
  }

  startGame = () => {
    this.setState({isGameStarted: true});
    this.onMoveOnClick();
  }

  componentWillUnmount() {
    this.playAudioOnce();
  }

  render() {
    if (!this.state.isGameStarted) {
      return <button onClick={this.startGame}>NEW GAME</button>
    }

    return <div
      className={styles.game}
    >
      <div className={styles.variables}>
        <div>
          <b>Текущее игровое состояние:</b>
        </div>
        <VariableStateTable
          variables={this.state.gameState.variables}
        />
      </div>
      <div>
        <div className={styles.currentEvent}>
          <EventDescription
            event={this.state.currentEvent}
          />
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
                  {this.state.currentAnswer.imageUrl && <ImageContainer>
                    <img src={this.state.currentAnswer.imageUrl} alt=""/>
                  </ImageContainer>}
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
    this.playAudioOnce(answer.voiceUrl.ru);

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
      this.playAudioOnce(currentEvent.voiceUrl.ru);

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

  private playAudioOnce(audioUrl?: string) {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (!audioUrl) return;

    this.currentAudio = new Audio(audioUrl);
    this.currentAudio.play();
  }
}
