import { PointerSensor, KeyboardSensor } from "@dnd-kit/core";

// Custom Pointer Sensor to prevent dragging on elements with data-no-dnd="true"
export class NoDndPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown',
            handler: ({ nativeEvent: event }) => {
                console.log('Pointer sensor activated')
                let element = event.target;
                // Traverse up the DOM tree to check for the data-no-dnd attribute
                while (element) {
                    if (element.dataset && element.dataset.noDnd === "true") {
                        return false; // Prevent drag initiation
                    }
                    element = element.parentElement;
                }
                return true; // Allow drag if no data-no-dnd is found
            },
        },
    ];
}

// Custom Keyboard Sensor to prevent dragging on elements with data-no-dnd="true"
export class NoDndKeyboardSensor extends KeyboardSensor {
    static activators = [
        {
            eventName: 'onKeyDown',
            handler: ({ nativeEvent: event }) => {
                console.log('Keyboard sensor activated', {
                    keyCode: event.code,
                    target: event.target
                });

                // First check if it's a valid activation key
                if (!(event.code === 'Space' || event.code === 'Enter')) {
                    console.log('Invalid key pressed, preventing drag');
                    return false;
                }

                let element = event.target;
                // Traverse up the DOM tree to check for the data-no-dnd attribute
                while (element) {
                    console.log('Checking element:', element, 'noDnd:', element.dataset?.noDnd);
                    if (element.dataset && element.dataset.noDnd === "true") {
                        console.log('Found no-dnd element, preventing drag');
                        return false; // Prevent drag initiation
                    }
                    element = element.parentElement;
                }
                console.log('No no-dnd found, allowing drag');
                return true; // Allow drag if no data-no-dnd is found
            },
        },
    ];
}
