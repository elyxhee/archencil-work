import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-test-tailwind-ui',
    templateUrl: './test-tailwind-ui.component.html',
    styleUrls: ['./test-tailwind-ui.component.scss']
})
export class TestTailwindUiComponent implements OnInit {
    tailwindCSSLoaded: boolean;

    constructor() {
        this.tailwindCSSLoaded = false;
    }

    ngOnInit(): void {
        this.checkTailwindCSS();
    }

    checkTailwindCSS(): void {
        const computedStyle = getComputedStyle(document.body);
        this.tailwindCSSLoaded = computedStyle.getPropertyValue('--tw-ring-offset-width') !== '';
    }
}
