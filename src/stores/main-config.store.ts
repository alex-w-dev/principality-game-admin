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
  static mainConfig: IMainConfig = MainConfigStore.getDefaultConfig();

  static export(): void {
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

  static loadFromLocalStorage(): void {
    const lsMainConfig = localStorage.getItem("mainGameConfig");

    if (lsMainConfig) {
      this.import(JSON.parse(lsMainConfig));
    }
  }

  static saveInLocalStorage(): void {
    localStorage.setItem("mainGameConfig", JSON.stringify(this.mainConfig));
  }

  static import(mainConfig: IMainConfig): void {
    this.mainConfig = mainConfig;
  }

  static getDefaultConfig(): IMainConfig {
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
