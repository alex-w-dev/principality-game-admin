import { makeAutoObservable } from 'mobx';

export interface IVariable {
  code: string;
  initialValue: number;
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

export interface IStepBranch {
  text: string;
  voiceUrl: string;
  imageUrl: string;
  rewards: IStepReward[]
}

export interface IConditionBlock {
  conditionType: 'or' | 'and';
  conditions: (ICondition | IConditionBlock)[];
}

export interface IStep {
  conditionBlock: IConditionBlock;
  text: string;
  imageUrl: string;
  branches: IStepBranch[]
}

export interface IMainConfig {
  variables: IVariable[];
  steps: IStep[];
  endConditions: IStep[];
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
          initialValue: 0,
        },
        {
          code: "GOLD",
          initialValue: 100,
        },
      ],
      steps: [],
      endConditions: [],
    };
  }

  setVariableData(variable: IVariable, data: Partial<IVariable>): void {
    const dataToSave = {
      ...variable,
      ...data,
    }

    if (isNaN(dataToSave.initialValue)) {
      dataToSave.initialValue = 0;
    }

    if (
      dataToSave.code !== variable.code &&
      this.mainConfig.variables.filter(v => variable.code === v.code).length === 1 &&
      JSON.stringify(this.mainConfig.steps).indexOf(`"${variable.code}"`) !== -1
    ) {
      alert(`Эта переменная уже гдето используется! Невозможно переименовать ${variable.code}!`);

      return;
    }

    Object.assign(variable, dataToSave);
    this.saveInLocalStorage();
  }
}
