import { EventType } from '../stores/main-config.store';

export function eventTypeToName(eventType: EventType): string {
  switch (eventType) {
    case EventType.Common:
      return 'Случайное событие';
    case EventType.Critical:
      return 'Критическое событие';
    case EventType.Random:
      return 'Случайное событие';
    default:
      throw new Error('unknown event type ' + eventType)
  }
}
