import { makeAutoObservable } from 'mobx';

export interface IGameVariable {
  code: string;
  initialValue: number;
}

export interface IMainConfig {
  variables: IGameVariable[];
  steps: IGameVariable[];
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
    };
  }

  setVariableData(variable: IGameVariable, data: Partial<IGameVariable>): void {
    const dataToSave = {
      ...variable,
      ...data,
    }

    if (isNaN(dataToSave.initialValue)) {
      dataToSave.initialValue = 0;
    }

    if (
      dataToSave.code !== variable.code &&
      this.mainConfig.steps.some(s => s.code === variable.code)
    ) {
      alert(`Эта переменная уже гдето используется! Невозможно переименовать ${variable.code}!`);

      return;
    }

    Object.assign(variable, dataToSave);
    this.saveInLocalStorage();
  }
}
