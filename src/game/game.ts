import { GameOverType, IAnswer, IEvent, IMainConfig } from '../stores/main-config.store';

export type IGameState = {
  variables: {
    [variableCode: string]: number
  },
  doneEventIndexes: number[], // indexes of events which is done
};

export class Game {


  constructor(
    private mainConfig: IMainConfig,
    private gameState?: IGameState,
  ) {
    if (!this.gameState) {
      const variables: IGameState['variables'] = {};

      mainConfig.variables.forEach((variable) => {
        variables[variable.code] = variable.initial;
      })

      this.gameState = {
        variables,
        doneEventIndexes: [],
      };
    }
  }

  getClonedGameState(): IGameState {
    return JSON.parse(JSON.stringify(this.gameState));
  }

  getCurrentEvent(): IEvent {
    return this.mainConfig.events.find(() => true);
  }

  giveAnswer(event: IEvent, answer: IAnswer): GameOverType | null {
    answer.rewards.forEach(reward => {
      this.gameState.variables[reward.variableCode] = this.gameState.variables[reward.variableCode] + reward.value;
    })

    this.gameState.doneEventIndexes.push(
      this.mainConfig.events.indexOf(
        this.mainConfig.events.find((e) => e.text.ru === event.text.ru),
      )
    )

    return answer.gameOver || null;
  }
}
