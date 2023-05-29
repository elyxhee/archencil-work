import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestJasmineComponent } from './test-jasmine.component';

describe('TestJasmineComponent', () => {
    let component: TestJasmineComponent;
    let fixture: ComponentFixture<TestJasmineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestJasmineComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestJasmineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct message', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('p').textContent).toContain('Hello, Angular!');
    });

    it('getMessage() should return the correct message', () => {
        expect(component.getMessage()).toBe('Hello, Angular!');
    });
});
