import { KeyboardSensor } from "@dnd-kit/core";

export class CustomKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: "onKeyDown",
      handler: ({ nativeEvent: event }) => {
        // Only prevent Enter key from triggering drag
        if (event.key === 'Enter') {
          return false;
        }
        return true;
      }
    }
  ];
} 