/* eslint-disable @angular-eslint/no-input-rename */
import { AfterViewInit, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { createPopper } from '@popperjs/core';
import { ViewEncapsulation } from '@angular/core';
import { DebouncedFunc, debounce } from 'lodash';

@Component({
    selector: 'app-global-tooltip',
    templateUrl: './global-tooltip.component.html',
    styleUrls: ['./global-tooltip.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GlobalTooltipComponent implements AfterViewInit, OnDestroy {
    private popperInstance: any = null;
    @Input() referenceElement: HTMLElement;

    @Input('tooltip') tooltipContent: string = '';
    @Input('tooltip-placement') tooltipPlacement: any = 'auto';
    @Input('tooltip-size') tooltipSize: string = 'normal';
    @Input('tooltip-delay') tooltipDelay: [number, number] = [500, 0];
    @Input('tooltip-offset') tooltipOffset: [number, number] = [0, 0];
    @Input('tooltip-duration') tooltipDuration: [number, number] = [200, 200];
    @Input('tooltip-nest') tooltipNest: string = '';

    private nest_timeout: number = 3000;
    private static lastShowTimes: Map<string, number> = new Map();

    private isMouseOver = false; // New flag to track if mouse is over

    // eslint-disable-next-line no-unused-vars
    constructor(private el: ElementRef) {}

    private showTooltipDebounce: DebouncedFunc<() => void>;
    private hideTooltipDebounce: DebouncedFunc<() => void>;

    ngAfterViewInit() {
        this.initializeTooltip();
        this.showTooltipDebounce = debounce(this.showTooltipImmediate, this.tooltipDelay[0]);
        this.hideTooltipDebounce = debounce(this.hideTooltipImmediate, this.tooltipDelay[1]);
    }

    ngOnDestroy() {
        this.tooltipElement.remove();

        // Destroy the popper instance
        if (this.popperInstance) {
            this.popperInstance.destroy();
            this.popperInstance = null;
        }
    }

    private tooltipTimeout: any = null;

    showTooltip() {
        this.isMouseOver = true; // Set the flag to true
        const lastShowTime = GlobalTooltipComponent.lastShowTimes.get(this.tooltipNest);
        const now = Date.now();

        if (this.tooltipNest && lastShowTime && now - lastShowTime < this.nest_timeout) {
            this.showTooltipDebounce.cancel();
            this.showTooltipImmediate();
        } else {
            this.showTooltipDebounce();
        }
    }

    hideTooltip() {
        this.isMouseOver = false; // Clear the flag
        this.hideTooltipDebounce();
    }

    private showTooltipImmediate() {
        if (!this.isMouseOver) {
            return;
        }
        const now = Date.now();
        this.tooltipElement.style.visibility = 'visible';
        this.tooltipElement.style.transition = `opacity ${this.tooltipDuration[0]}ms ease-in-out`;
        this.tooltipElement.style.opacity = '1';
        this.tooltipElement.querySelector('.arrow').classList.add('arrow-before-visible');

        if (this.tooltipNest) {
            GlobalTooltipComponent.lastShowTimes.set(this.tooltipNest, now);
        }

        // Update the popper instance to ensure proper positioning
        if (this.popperInstance) {
            this.popperInstance.update();
        }
    }

    private hideTooltipImmediate() {
        // Check if the mouse is back over the reference element
        if (this.isMouseOver) {
            return;
        }
        this.tooltipElement.style.transition = `opacity ${this.tooltipDuration[1]}ms ease-in-out`;
        this.tooltipElement.style.opacity = '0';
        setTimeout(() => {
            if (this.isMouseOver) {
                // Check if the mouse is back over the reference element
                return;
            }
            this.tooltipElement.style.visibility = 'hidden';
            this.tooltipElement.querySelector('.arrow').classList.remove('arrow-before-visible');
        }, this.tooltipDuration[1]);
    }

    private clearTooltipTimeout() {
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }
    }

    tooltipElement: HTMLElement;

    private initializeTooltip() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'tooltip';
        this.tooltipElement.style.visibility = 'hidden';
        this.tooltipElement.style.opacity = '0';

        const wrapper = document.createElement('div');
        wrapper.className = `tooltip-wrapper tooltip-${this.tooltipSize}`; // Add the tooltipSize to the class list

        const textNode = document.createTextNode(this.tooltipContent);
        wrapper.appendChild(textNode);

        const arrow = document.createElement('div');
        arrow.classList.add('arrow');
        arrow.setAttribute('data-popper-arrow', '');
        wrapper.appendChild(arrow);

        this.tooltipElement.appendChild(wrapper);

        document.body.appendChild(this.tooltipElement);

        this.popperInstance = createPopper(this.referenceElement, this.tooltipElement, {
            placement: this.tooltipPlacement,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: this.tooltipOffset
                    }
                },
                {
                    name: 'arrow',
                    options: {
                        element: arrow
                    }
                }
            ]
        });
    }
}
