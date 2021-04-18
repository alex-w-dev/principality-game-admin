import { GameOverType, IAnswer, IMainConfig } from '../stores/main-config.store';
import { Game, IGameState } from './game';

interface ITestEvent {
  answerIndex?: number,
  gameStateBeforeAnswer?: IGameState,
  eventIndex?: number,
  children?: ITestEvent[]
}

export enum GameTesterStatus {
  Process = 'процесс',
  Complete = 'завершено',
}

export class GameTester {
  status: GameTesterStatus = GameTesterStatus.Complete;

  testResult: ITestEvent[] = [];
  needToNextEvent: ITestEvent[] = [];
  answeredCount = 0;

  gameOverDefeats: {
    eventIndex: number,
    gameStatsVariables: IGameState['variables'],
    answer: ITestEvent,
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
    const initialAnswer: ITestEvent = {
      answerIndex: 0,
      children: [],
      gameStateBeforeAnswer: game.getClonedGameState(),
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

    const gameStateBeforeAnswer = answered.gameStateBeforeAnswer;
    const game = new Game(this.mainConfig, answered.gameStateBeforeAnswer);
    const currentEvent = game.getCurrentEvent();
    const eventIndex = game.getMainConfigEventIndex(currentEvent);

    Object.assign(answered, {
      eventIndex: eventIndex,
      children: (currentEvent.answers.length && currentEvent.answers || [undefined]).map((answer, index) =>  {
        this.answeredCount++;
        const game = new Game(this.mainConfig, gameStateBeforeAnswer);
        const isGameOver = game.giveAnswer(currentEvent, answer);
        const gameStateAfterAnswer = game.getClonedGameState();
        const answered: ITestEvent = {
          answerIndex: index,
          gameStateBeforeAnswer: gameStateAfterAnswer,
          eventIndex,
        }

        if (isGameOver) {
          if (isGameOver === GameOverType.Defeat) {
            this.gameOverDefeats.push({
              eventIndex,
              gameStatsVariables: gameStateAfterAnswer.variables,
              answer: answered,
            });
          } else if (isGameOver === GameOverType.Win) {
            this.gameOverWinsCount ++;
          }
        } else if (this.stepsLimit && gameStateAfterAnswer.variables['STEP'] > this.stepsLimit) {
          // 50 ходов
        } else  {
          this.needToNextEvent.push(answered);
        }

        return answered;
      }) || [],
    } as Partial<ITestEvent>);

    delete answered.gameStateBeforeAnswer;

    setTimeout(() => {
      this.nextEvent();
    })
  }
}
