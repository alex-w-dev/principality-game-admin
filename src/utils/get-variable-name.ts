import { IVariable } from '../stores/main-config.store';

export function getVariableName(variable: IVariable): string {
  return variable.title || variable.code;
}
