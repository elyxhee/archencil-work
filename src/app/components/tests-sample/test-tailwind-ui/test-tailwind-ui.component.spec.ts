import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTailwindUiComponent } from './test-tailwind-ui.component';

describe('TestTailwindUiComponent', () => {
    let component: TestTailwindUiComponent;
    let fixture: ComponentFixture<TestTailwindUiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestTailwindUiComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestTailwindUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
