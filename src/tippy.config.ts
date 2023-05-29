// src/tippy.config.ts
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export function initializeTippy() {
    tippy('[data-tippy-content]', {
        theme: 'normal', // Set the default theme globally
        allowHTML: true,
        placement: 'top', // Change this to your preferred tooltip position
        delay: [500, 0]
    });
}
