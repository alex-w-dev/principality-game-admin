import { makeAutoObservable } from 'mobx';

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

export class MainConfigStore {
  mainConfig: IMainConfig = this.getDefaultConfig();

  constructor() {
    // this.loadFromLocalStorage();

    makeAutoObservable(this)
  }

  export(): void {
    this.saveInLocalStorage();

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
      this.setMainConfig(JSON.parse(lsMainConfig));
    }
  }

  saveInLocalStorage(): void {
    localStorage.setItem("mainGameConfig", JSON.stringify(this.mainConfig));
  }

  setMainConfig(mainConfig: IMainConfig): void {
    this.mainConfig = mainConfig;
  }

  getDefaultConfig(): IMainConfig {
    return {
      variables: [
        {
          code: "STEP",
          initial: 0,
          max: '',
          min: 0,
        },
        {
          code: "GOLD",
          initial: 100,
          max: '',
          min: 0,
        },
      ],
      events: [],
    };
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
    this.saveInLocalStorage();
  }

  addNewEvent(eventType: EventType): void {
    this.mainConfig.events.push({
      imageUrl: '',
      title: {
        en: 'New Event',
        ru: 'Умерать от голода',
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
            conditionType: ConditionBlockType.Or,
            conditions: [
              {
                variableCode: 'GOLD',
                sign: IConditionSign.LessThan,
                value: 1,
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
