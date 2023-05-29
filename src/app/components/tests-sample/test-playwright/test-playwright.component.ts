import { Component } from '@angular/core';

@Component({
    selector: 'app-test-playwright',
    templateUrl: './test-playwright.component.html',
    styleUrls: ['./test-playwright.component.scss']
})
export class TestPlaywrightComponent {
    name: string = '';
    buttonClicked: boolean = false;

    onButtonClick(): void {
        this.buttonClicked = true;
    }
}
