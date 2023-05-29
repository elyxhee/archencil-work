/**
 * Due to security and usability reasons, web browsers generally do not allow certain key events to be overridden by web applications. These keys include 'Alt', 'Ctrl', and 'F1-F12', among others, which are reserved for important browser shortcuts, such as opening the browser menu.
 *
 * This limitation ensures that users retain full control over their browsing experience, preventing web pages from interfering with critical browser functionalities. Therefore, attempts to override the default behavior of these keys using methods like event.preventDefault() will not have the desired effect.
 *
 * It is advisable to consider alternate implementation strategies if specific functionality tied to these keys is required in a web application.
 */

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InputConfigStartupService {
    constructor() {
        this.disableInterferingInputs();
    }

    disableInterferingInputs() {
        // Disabling Alt key default behavior
        window.addEventListener('keydown', this.preventAltKeyDefault, true);
    }

    // You can add more methods here to handle other input types

    private preventAltKeyDefault = (event: KeyboardEvent) => {
        if (event.altKey) {
            event.preventDefault();
        }
    };
}
