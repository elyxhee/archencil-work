/* eslint-disable no-unused-vars */
import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { GlobalTooltipComponent } from '../global-tooltip.component';

@Injectable({
    providedIn: 'root'
})
export class GlobalTooltipService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) {}

    createTooltip() {
        // Create a component reference from the component
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(GlobalTooltipComponent)
            .create(this.injector);

        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        // Append DOM element to the body
        document.body.appendChild(domElem);

        return componentRef;
    }

    destroyTooltip(componentRef) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }
}
