import { makeAutoObservable } from 'mobx';

export interface IGameVariable {
  code: string;
  initialValue: number;
  max: number | null;
  min: number | null;
}

export interface IMainConfig {
  variables: IGameVariable[];
}

export class MainConfigStore {
  mainConfig: IMainConfig = this.getDefaultConfig();

  constructor() {
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
          code: "step",
          initialValue: 0,
          max: null,
          min: null,
        },
        {
          code: "gold",
          initialValue: 100,
          max: null,
          min: 0,
        },
      ],
    };
  }
}
