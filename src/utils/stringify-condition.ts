import { ConditionBlockType, ConditionSign, ICondition, IConditionBlock } from '../stores/main-config.store';

export function stringifyCondition(condition: ICondition | IConditionBlock): string {
  if ((condition as ICondition).variableCode) {
    condition = condition as ICondition;

    switch (condition.sign) {
      case ConditionSign.Equal:
        return `${condition.variableCode}=${condition.value}`;
      case ConditionSign.GreaterThan:
        return `${condition.variableCode}>${condition.value}`;
      case ConditionSign.LessThan:
      default:
        return `${condition.variableCode}<${condition.value}`;
    }
  } else {
    condition = condition as IConditionBlock;

    const text = condition.conditions.map(stringifyCondition).join(` ${(condition.type === ConditionBlockType.Or) ? 'ИЛИ' : 'И'} `)
    return `(${text})`;
  }

}
