import { autorun, extendObservable, makeAutoObservable, toJS } from 'mobx';
import { set } from 'lodash';

const defaultMainConfig = require('./default-main-config.json');

export interface IVariable {
  code: string;
  initial: number;
  min: number | '';
  max: number | '';
}

export enum ConditionSign {
  Equal = 1,
  LessThan = 2,
  GreaterThan = 3,
}

export interface ICondition {
  variableCode: IVariable['code'];
  sign: ConditionSign,
  value: number;
}

export interface IStepReward {
  variableCode: IVariable['code'];
  value: number;
}

export interface ILocale<T> {
  en: T;
  ru: T;
}

export interface IAnswer {
  conditionBlock: IConditionBlock;
  choiceText: ILocale<string>;
  resultText: ILocale<string>;
  voiceUrl: ILocale<string>;
  imageUrl: string;
  rewards: IStepReward[];
  gameOver?: GameOverType;
}

export enum ConditionBlockType {
  And = 1,
  Or = 2,
}

export interface IConditionBlock {
  type: ConditionBlockType;
  conditions: (ICondition | IConditionBlock)[];
}

export enum EventType {
  Common = 1,
  Random = 2,
  Critical = 3,
}

export enum GameOverType {
  Win = 1,
  Defeat = -1,
}

export interface IEvent<T = EventType> {
  type: T;
  conditionBlock: IConditionBlock;
  title: ILocale<string>;
  text: ILocale<string>;
  voiceUrl: ILocale<string>;
  imageUrl: string;
  answers: IAnswer[];
}

export interface IMainConfig {
  variables: IVariable[];
  events: IEvent[];
}

function autoSave(store, save) {
  let firstRun = true;
  autorun(() => {
    // This code will run every time any observable property
    // on the store is updated.
    const json = JSON.stringify(toJS(store));
    if (!firstRun) {
      save(json);
    }
    firstRun = false;
  });
}

export class MainConfigStore {
  mainConfig: IMainConfig = this.getDefaultConfig();

  constructor() {
    makeAutoObservable(this);

    this.loadFromLocalStorage();
    autoSave(this, this.saveInLocalStorage.bind(this));
  }

  export(): void {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(this.mainConfig, null, 2),
    )}`;
    const dlAnchorElem = document.createElement("a");
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "game-main-config.json");
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
  }

  loadFromLocalStorage(): void {
    const lsMainConfig = localStorage.getItem("mainGameConfig");

    if (lsMainConfig) {
      const mainConfig = JSON.parse(lsMainConfig);

      this.setMainConfig(mainConfig);

      extendObservable(this, mainConfig);
    }
  }

  saveInLocalStorage(): void {
    localStorage.setItem("mainGameConfig", JSON.stringify(this.mainConfig));
  }

  setMainConfig(mainConfig: IMainConfig): void {
    this.mainConfig = mainConfig;
  }

  setSomeData(event: any, path: string, value: any): void {
    set(event, path, value);
  }

  setConditionData(condition: ICondition, data: Partial<ICondition>): void {
    Object.assign(condition, data);
  }

  setRewardData(reward: IStepReward, data: Partial<IStepReward>): void {
    Object.assign(reward, data);
  }

  setConditionBlockType(conditionBlock: IConditionBlock, conditionBlockType: ConditionBlockType): void {
    conditionBlock.type = conditionBlockType;
  }

  conditionBlockAddConditionBlock(conditionBlock: IConditionBlock): void {
    conditionBlock.conditions.push({
      conditions: [],
      type: ConditionBlockType.And,
    } as IConditionBlock);
  }

  answerAddNewReward(answer: IAnswer): void {
    answer.rewards.push({
      variableCode: this.mainConfig.variables[1].code,
      value: 1,
    } as IStepReward);
  }

  removeConditionBlock(conditionBlock: IConditionBlock, parentConditionBLock: IConditionBlock): void {
    parentConditionBLock.conditions.splice(parentConditionBLock.conditions.indexOf(conditionBlock), 1);
  }

  removeCondition(condition: ICondition, parentConditionBLock: IConditionBlock): void {
    parentConditionBLock.conditions.splice(parentConditionBLock.conditions.indexOf(condition), 1);
  }

  removeReward(eventAnswer: IAnswer, reward: IStepReward ): void {
    eventAnswer.rewards.splice(eventAnswer.rewards.indexOf(reward), 1);
  }

  removeAnswer(event: IEvent, eventAnswer: IAnswer): void {
    event.answers.splice(event.answers.indexOf(eventAnswer), 1);
  }

  addAnswer(event: IEvent): void {
    event.answers.push({
      conditionBlock: {
        conditions: [],
        type: ConditionBlockType.And,
      },
      choiceText: {
        en: 'Do something good',
        ru: 'Сделать что-нибудь хорошее',
      },
      resultText: {
        en: 'You right',
        ru: 'Это было верное решение',
      },
      imageUrl: '',
      voiceUrl: {
        en: '',
        ru: '',
      },
      rewards: []
    })
  }

  conditionBlockAddCondition(conditionBlock: IConditionBlock): void {
    conditionBlock.conditions.push({
      variableCode: this.mainConfig.variables[0].code,
      sign: ConditionSign.Equal,
      value: 0,
    } as ICondition);
  }

  getDefaultConfig(): IMainConfig {
    return JSON.parse(JSON.stringify(defaultMainConfig));
  }

  addNewVariable(): void {
    this.mainConfig.variables.push({
      code: 'NEW_VAR',
      initial: 0,
      max: '',
      min: '',
    });
  }

  deleteVariable(variable: IVariable): void {
    if (
      this.isVariableInUse(variable)
    ) {
      alert(`Эта переменная уже гдето используется! Невозможно удалить ${variable.code}!`);

      return;
    }

    this.mainConfig.variables.splice(this.mainConfig.variables.indexOf(variable), 1);
  }

  setVariableData(variable: IVariable, data: Partial<IVariable>): void {
    const dataToSave = {
      ...variable,
      ...data,
    }

    if (
      dataToSave.code !== variable.code &&
      this.isVariableInUse(variable)
    ) {
      alert(`Эта переменная уже гдето используется! Невозможно переименовать ${variable.code}!`);

      return;
    }

    Object.assign(variable, dataToSave);
  }

  addNewEvent(eventType: EventType): void {
    const newEvent: IEvent = {
      imageUrl: '',
      title: {
        en: 'New Event',
        ru: 'Новое событие',
      },
      text: {
        en: 'New Event English Description Text',
        ru: 'Новой событие описанное на русском языке',
      },
      type: eventType,
      voiceUrl: {
        ru: '',
        en: ''
      },
      conditionBlock: {
        type: ConditionBlockType.And,
        conditions: [
          {
            variableCode: 'GOLD',
            sign: ConditionSign.LessThan,
            value: 1,
          },
        ],
      },
      answers: [],
    };

    this.mainConfig.events.push(newEvent);
  }

  private isVariableInUse(variable: IVariable): boolean {
    return this.mainConfig.variables.filter(v => variable.code === v.code).length === 1 &&
      (
        JSON.stringify(this.mainConfig.events).indexOf(`"variableCode":"${variable.code}"`) !== -1 /*||
        JSON.stringify(this.mainConfig.criticalEvents).indexOf(`"${variable.code}"`) !== -1 ||
        JSON.stringify(this.mainConfig.randomEvents).indexOf(`"${variable.code}"`) !== -1*/
      );
  }
}
