import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTooltipComponent } from './global-tooltip.component';

describe('GlobalTooltipComponent', () => {
    let component: GlobalTooltipComponent;
    let fixture: ComponentFixture<GlobalTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GlobalTooltipComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(GlobalTooltipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
