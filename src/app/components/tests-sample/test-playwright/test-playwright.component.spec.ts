import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPlaywrightComponent } from './test-playwright.component';

describe('TestPlaywrightComponent', () => {
    let component: TestPlaywrightComponent;
    let fixture: ComponentFixture<TestPlaywrightComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestPlaywrightComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestPlaywrightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
