import { shuffle } from 'lodash';
import {
  ConditionBlockType,
  ConditionSign,
  EventType,
  GameOverType,
  IAnswer,
  ICondition,
  IConditionBlock,
  IEvent,
  IMainConfig, IVariable,
} from '../stores/main-config.store';
import { toJS } from 'mobx';

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
    let event: IEvent;

    const commonEvent = this.commonEvents.filter(this.eventConditionFilter)?.[0];

    if (commonEvent) {
      // сюжетное событие
      event = commonEvent;
    }

    if (!event && !this.gameState.stepsWithCriticalEvents.includes(this.gameState.variables['STEP'])) {
      // если на этом ходу не было критических событий - ищем.
      const criticalEvent = this.criticalEvents.filter(this.eventConditionFilter)?.[0];

      if (criticalEvent) {
        event = criticalEvent;
      }
    }

    if (!event) {
      const randomEvent = shuffle(
        this.randomEvents
          .filter(this.eventConditionFilter)
          .filter((e) => !this.gameState.doneEventIndexes.includes(this.getMainConfigEventIndex(e)))
      )?.[0];

      if (randomEvent) {
        // случайное событие
        event = randomEvent;
      }
    }

    event = toJS(event || this.getFakeEvent());

    // уберем ответы, которые не соответсвуют их условиям
    event.answers = event.answers.filter(this.eventConditionFilter);

    return event;
  }

  giveAnswer(event: IEvent, answer?: IAnswer): GameOverType | null {
    if (!answer) {
      if (event.answers.length) {
        throw new Error('Если в событии есть хотябы 1 ответ - нельзя давайть пустые ответы на событие')
      }
    }

    answer?.rewards.forEach(reward => {
      const variableCode = this.getMainConfigVariableByCode(reward.variableCode);

      this.gameState.variables[reward.variableCode] = Math.min(
        variableCode.max === '' ? Infinity : variableCode.max,
        Math.max(
          variableCode.min === '' ? -Infinity : variableCode.min,
          this.gameState.variables[reward.variableCode] + reward.value,
        )
      );
    })

    if (event.type === EventType.Critical) {
      this.gameState.stepsWithCriticalEvents.push(this.gameState.variables['STEP']);
    } else {
      this.doneEventAndMoveOn(event);
    }

    return answer?.gameOver || null;
  }

  getMainConfigEvent(event: IEvent): IEvent {
    return this.mainConfig.events.find((e) => e.text.ru === event.text.ru);
  }

  getMainConfigEventIndex(event: IEvent): number {
    return this.mainConfig.events.indexOf(
      this.getMainConfigEvent(event),
    );
  }

  private getMainConfigVariableByCode(code: string): IVariable {
    return this.mainConfig.variables.find(v => v.code === code);
  }

  private doneEventAndMoveOn(event: IEvent): void {
    const indexOfEvent = this.getMainConfigEventIndex(event);

    if (indexOfEvent !== -1) {
      this.gameState.doneEventIndexes.push(indexOfEvent);
    }

    this.gameState.variables['STEP']++;
  }

  private eventConditionFilter = (event: IEvent | IAnswer): boolean => {
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
        // {
        //   rewards: [],
        //   resultText: {
        //     ru: 'ничего не произошло RESULT_TEXT',
        //     en: '(ENG) ничего не произошло RESULT_TEXT',
        //   },
        //   voiceUrl: {
        //     ru: '',
        //     en: '',
        //   },
        //   imageUrl: '',
        //   conditionBlock: {
        //     type: ConditionBlockType.Or,
        //     conditions: [],
        //   },
        //   choiceText: {
        //     ru: 'ничего не произошло CHOISE_TEXT',
        //     en: '(ENG) ничего не произошло CHOISE_TEXT',
        //   }
        // }
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
