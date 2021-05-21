import { ConditionBlockType, ConditionSign, ICondition, IConditionBlock } from '../stores/main-config.store';
import { variableCodeToTitle } from './variable-code-to-title';

export function stringifyCondition(condition: ICondition | IConditionBlock): string {
  if ((condition as ICondition).variableCode) {
    condition = condition as ICondition;

    switch (condition.sign) {
      case ConditionSign.Equal:
        return `${variableCodeToTitle(condition.variableCode)}=${condition.value}`;
      case ConditionSign.GreaterThan:
        return `${variableCodeToTitle(condition.variableCode)}>${condition.value}`;
      case ConditionSign.LessThan:
      default:
        return `${variableCodeToTitle(condition.variableCode)}<${condition.value}`;
    }
  } else {
    condition = condition as IConditionBlock;

    const text = condition.conditions.map(stringifyCondition).join(` ${(condition.type === ConditionBlockType.Or) ? 'ИЛИ' : 'И'} `)
    return `(${text})`;
  }

}
