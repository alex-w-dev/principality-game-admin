import { GameOverType, IAnswer, IMainConfig } from '../stores/main-config.store';
import { Game, IGameState } from './game';

interface ITestAnswer {
  answerIndex: number,
  event?: ITestEvent,
  gameStateOnAnswer?: IGameState,
}
interface ITestEvent {
  eventIndex: number,
  answers: ITestAnswer[]
}

export enum GameTesterStatus {
  Process = 'процесс',
  Complete = 'завершено',
}

export class GameTester {
  status: GameTesterStatus = GameTesterStatus.Complete;

  testResult: ITestAnswer[] = [];
  needToNextEvent: ITestAnswer[] = [];
  answeredCount = 0;

  gameOverDefeats: {
    eventIndex: number,
    gameStatsVariables: IGameState['variables'],
    answer: ITestAnswer,
  }[] = [];
  gameOverWinsCount = 0;

  constructor(
    private mainConfig: IMainConfig,
    private stepsLimit: number,
  ) { }

  stop(): void {
    this.status = GameTesterStatus.Complete;
  }

  startCompleteTest(): void {
    if (this.status === GameTesterStatus.Process) return;

    this.status = GameTesterStatus.Process;

    const game = new Game(this.mainConfig);
    const initialAnswer: ITestAnswer = {
      answerIndex: 0,
      gameStateOnAnswer: game.getClonedGameState(),
    }

    this.testResult = [initialAnswer];
    this.needToNextEvent.push(initialAnswer);

    this.nextEvent();
  }

  nextEvent() {
    if (this.status !== GameTesterStatus.Process) {
      return;
    }

    const answered = this.needToNextEvent.pop();
    if (!answered) {
      this.status = GameTesterStatus.Complete;

      console.log(this.testResult, 'this.testResult');

      return;
    }

    const game = new Game(this.mainConfig, answered.gameStateOnAnswer);
    delete answered.gameStateOnAnswer;

    const currentEvent = game.getCurrentEvent();

    const eventIndex = game.getMainConfigEventIndex(currentEvent);

    answered.event = {
      eventIndex: eventIndex,
      answers: (currentEvent.answers.length && currentEvent.answers || [undefined]).map((answer, index) =>  {
        this.answeredCount++;
        const isGameOver = game.giveAnswer(currentEvent, answer);
        const gameStateOnAnswer = game.getClonedGameState();
        const answered = {
          answerIndex: index,
          gameStateOnAnswer,
        }

        if (isGameOver) {
          if (isGameOver === GameOverType.Defeat) {
            this.gameOverDefeats.push({
              eventIndex,
              gameStatsVariables: gameStateOnAnswer.variables,
              answer: answered,
            });
          } else if (isGameOver === GameOverType.Win) {
            this.gameOverWinsCount ++;
          }
        } else if (this.stepsLimit && gameStateOnAnswer.variables['STEP'] > this.stepsLimit) {
          // 50 ходов
        } else  {
          this.needToNextEvent.push(answered);
        }

        return answered;
      }) || [],
    }


    setTimeout(() => {
      this.nextEvent();
    })
  }
}
