import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNgRxComponent } from './test-ngrx.component';

describe('TestNgRxComponent', () => {
    let component: TestNgRxComponent;
    let fixture: ComponentFixture<TestNgRxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestNgRxComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestNgRxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
