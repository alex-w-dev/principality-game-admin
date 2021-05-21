import { mainConfigStore } from '../hooks/use-main-config-store';

export function variableCodeToTitle(variableCode: string): string {
  const variable = mainConfigStore.mainConfig.variables.find(v => v.code === variableCode);

  return variable?.title || variableCode;
}
