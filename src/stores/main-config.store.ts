import { autorun, extendObservable, makeAutoObservable, toJS } from 'mobx';

const defaultMainConfig = require('./default-main-config.json');

export interface IVariable {
  code: string;
  initial: number;
  min: number | '';
  max: number | '';
}

export enum IConditionSign {
  Equal = 0,
  LessThan = 1,
  GreaterThan = 2,
}

export interface ICondition {
  variableCode: IVariable['code'];
  sign: IConditionSign,
  value: number;
}

export enum StepRewardOperation {
  Increase = 0,
  Decrease = 1,
}

export interface IStepReward {
  operation: StepRewardOperation;
  variableCode: IVariable['code'];
}

export interface ILocale<T> {
  en: T;
  ru: T;
}

export interface IAnswer {
  conditionBlock: IConditionBlock;
  text: ILocale<string>;
  voiceUrl: ILocale<string>;
  imageUrl: string;
  rewards: IStepReward[]
}

export enum ConditionBlockType {
  And = 0,
  Or = 1,
}

export interface IConditionBlock {
  conditionType: ConditionBlockType;
  conditions: (ICondition | IConditionBlock)[];
}

export enum EventType {
  Critical = 0,
  Common = 1,
  Random = 2,
}

export interface IEvent {
  type: EventType;
  conditionBlock: IConditionBlock;
  title: ILocale<string>;
  text: ILocale<string>;
  voiceUrl: ILocale<string>;
  imageUrl: string;
  answers: IAnswer[]
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
    this.mainConfig.events.push({
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
        conditionType: ConditionBlockType.And,
        conditions: [
          {
            variableCode: 'STEP',
            sign: IConditionSign.GreaterThan,
            value: 5,
          },
          {
            variableCode: 'GOLD',
            sign: IConditionSign.LessThan,
            value: 1,
          },
          {
            conditionType: ConditionBlockType.Or,
            conditions: [
              {
                variableCode: 'GOLD',
                sign: IConditionSign.Equal,
                value: 1,
              },
              {
                variableCode: 'STEP',
                sign: IConditionSign.Equal,
                value: 5,
              },
            ]
          }
        ],
      },
      answers: [],
    })
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
