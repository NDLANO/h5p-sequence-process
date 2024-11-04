import { PointerSensor } from "@dnd-kit/core";

function shouldHandleEvent(element) {
  let cur = element;

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}

export class CustomPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown",
      handler: ({ nativeEvent: event }) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          !shouldHandleEvent(event.target)
        ) {
          return false;
        }

        return true;
      },
    },
  ];
} 