/* eslint-disable no-unused-vars */
/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, ElementRef, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { GlobalTooltipService } from '../services/global-tooltip.service';
import { GlobalTooltipComponent } from '../global-tooltip.component';
import { ComponentRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[tooltip]'
})
export class GlobalTooltipDirective implements OnInit, OnDestroy {
    @Input('tooltip') tooltipContent: string;
    @Input('tooltip-placement') tooltipPlacement: any = 'auto';
    @Input('tooltip-size') tooltipSize: string = 'normal';
    @Input('tooltip-delay') tooltipDelay: string = '500,0';
    @Input('tooltip-offset') tooltipOffset: string = '0,0';
    @Input('tooltip-duration') tooltipDuration: string = '200,200';
    @Input('tooltip-nest') tooltipNest: string = '';

    private componentRef: ComponentRef<GlobalTooltipComponent>;

    constructor(private el: ElementRef, private tooltipService: GlobalTooltipService) {}

    ngOnInit() {
        this.componentRef = this.tooltipService.createTooltip();
        this.setTooltipProperties();
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.componentRef.instance.showTooltip();
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.componentRef.instance.hideTooltip();
    }

    ngOnDestroy() {
        this.tooltipService.destroyTooltip(this.componentRef);
    }

    private setTooltipProperties() {
        const instance = this.componentRef.instance;
        instance.tooltipContent = this.tooltipContent;
        instance.tooltipPlacement = this.tooltipPlacement;
        instance.tooltipSize = this.tooltipSize;
        const [a, b] = this.tooltipDelay.split(',').map(Number);
        instance.tooltipDelay = [a || 0, b || 0];
        const [x, y] = this.tooltipOffset.split(',').map(Number);
        instance.tooltipOffset = [x || 0, y || 0];
        const [z, w] = this.tooltipDuration.split(',').map(Number);
        instance.tooltipDuration = [z || 0, w || 0];
        instance.referenceElement = this.el.nativeElement;
        instance.tooltipNest = this.tooltipNest;
    }
}
