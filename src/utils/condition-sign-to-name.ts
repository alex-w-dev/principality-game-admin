import { ConditionSign } from '../stores/main-config.store';

export function eventSignToName(conditionSign: ConditionSign): string {
  switch (conditionSign) {
    case ConditionSign.Equal:
      return 'равно'
    case ConditionSign.GreaterThan:
      return 'больше'
    case ConditionSign.LessThan:
      return 'меньше'
    default:
      throw new Error('unknown condition sign ' + conditionSign)
  }
}
