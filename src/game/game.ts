import {
  ConditionBlockType,
  ConditionSign,
  EventType,
  GameOverType,
  IAnswer,
  ICondition,
  IConditionBlock,
  IEvent,
  IMainConfig,
} from '../stores/main-config.store';

export type IGameState = {
  variables: {
    [variableCode: string]: number
  },
  doneEventIndexes: number[], // indexes of events which is done
  stepsWithCriticalEvents: number[], // numbers of step with critical events
};

export class Game {

  private commonEvents: IEvent<EventType.Common>[];
  private criticalEvents: IEvent<EventType.Critical>[];
  private randomEvents: IEvent<EventType.Random>[];

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
        stepsWithCriticalEvents: [],
      };
    }

    const allPossibleEvents = this.mainConfig.events
      .filter((e, i) => !this.gameState.doneEventIndexes.includes(i))

    this.commonEvents = allPossibleEvents
      .filter((e) => e.type === EventType.Common) as IEvent<EventType.Common>[];
    this.randomEvents = allPossibleEvents
      .filter((e) => e.type === EventType.Random) as IEvent<EventType.Random>[];
    this.criticalEvents = allPossibleEvents
      .filter((e) => e.type === EventType.Critical) as IEvent<EventType.Critical>[];
  }

  getClonedGameState(): IGameState {
    return JSON.parse(JSON.stringify(this.gameState));
  }

  getCurrentEvent(): IEvent {
    console.log(this.commonEvents, 'this.commonEvents.length');
    const commonEvent = this.commonEvents.filter(this.eventConditionFilter)?.[0];

    if (commonEvent) {
      return commonEvent;
    }

    if (!this.gameState.stepsWithCriticalEvents.includes(this.gameState.variables['STEP'])) {
      const criticalEvent = this.criticalEvents.filter(this.eventConditionFilter)?.[0];

      if (criticalEvent) {
        return criticalEvent;
      }
    }

    const randomEvent = this.randomEvents.filter(this.eventConditionFilter)?.[0];

    if (randomEvent) {
      return randomEvent;
    }

    return this.getFakeEvent();
  }

  giveAnswer(event: IEvent, answer: IAnswer): GameOverType | null {
    answer.rewards.forEach(reward => {
      this.gameState.variables[reward.variableCode] = this.gameState.variables[reward.variableCode] + reward.value;
    })

    if (event.type === EventType.Critical) {
      this.gameState.stepsWithCriticalEvents.push(this.gameState.variables['STEP']);
    } else {
      const indexOfEvent = this.mainConfig.events.indexOf(
        this.mainConfig.events.find((e) => e.text.ru === event.text.ru),
      )

      if (indexOfEvent !== -1) {
        this.gameState.doneEventIndexes.push(indexOfEvent);
      }

      this.gameState.variables['STEP']++;
    }

    return answer.gameOver || null;
  }

  private eventConditionFilter = (event: IEvent): boolean => {
    return this.isConditionTruly(event.conditionBlock);
  }

  private isConditionTruly = (condition: IConditionBlock | ICondition): boolean => {
    if ((condition as ICondition).variableCode) {
      condition = condition as ICondition;

      switch (condition.sign) {
        case ConditionSign.Equal:
          return this.gameState.variables[condition.variableCode] === condition.value;
        case ConditionSign.GreaterThan:
          return this.gameState.variables[condition.variableCode] > condition.value;
        case ConditionSign.LessThan:
        default:
          return this.gameState.variables[condition.variableCode] < condition.value;
      }
    } else {
      condition = condition as IConditionBlock;

      return condition.type === ConditionBlockType.Or
        ? condition.conditions.some(condition => this.isConditionTruly(condition))
        : condition.conditions.every(condition => this.isConditionTruly(condition))
    }
  }

  private getFakeEvent(): IEvent {
    return {
      type: EventType.Common,
      title: {
        ru: 'ничего не произошло',
        en: '(ENG) ничего не произошло',
      },
      text: {
        ru: 'TEXT ничего не произошло TEXT',
        en: '(ENG) TEXT ничего не произошло TEXT',
      },
      answers: [
        {
          rewards: [],
          resultText: {
            ru: 'ничего не произошло RESULT_TEXT',
            en: '(ENG) ничего не произошло RESULT_TEXT',
          },
          voiceUrl: {
            ru: '',
            en: '',
          },
          imageUrl: '',
          conditionBlock: {
            type: ConditionBlockType.Or,
            conditions: [],
          },
          choiceText: {
            ru: 'ничего не произошло CHOISE_TEXT',
            en: '(ENG) ничего не произошло CHOISE_TEXT',
          }
        }
      ],
      conditionBlock: {
        type: ConditionBlockType.Or,
        conditions: [],
      },
      voiceUrl: {
        ru: '',
        en: '',
      },
      imageUrl: '',
    }
  }
}
