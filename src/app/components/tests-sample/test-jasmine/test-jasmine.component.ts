import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-test-jasmine',
    templateUrl: './test-jasmine.component.html',
    styleUrls: ['./test-jasmine.component.scss']
})
export class TestJasmineComponent implements OnInit {
    constructor() {
        this.message = 'Hello, Angular!';
    }

    ngOnInit(): void {
        console.log('');
    }

    message: string;

    getMessage(): string {
        return this.message;
    }
}
