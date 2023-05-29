import { AfterViewInit, Component, Input } from '@angular/core';
import { EntityHandlerService } from '../services/entity-handler.service';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { fabric } from 'fabric';

@Component({
    selector: 'app-tools-menu',
    templateUrl: './tools-menu.component.html',
    styleUrls: ['./tools-menu.component.scss']
})
export class ToolsMenuComponent implements AfterViewInit {
    @Input() canvas: fabric.Canvas;

    DEFAULT_OPTION = 'Select';
    static currentSelected = 'select';

    buttons = [
        { name: 'Select', icon: 'cursor.svg', alt: 'Select' },
        { name: 'Text', icon: 'font.svg', alt: 'Text' },
        { name: 'Sticky note', icon: 'sticky-note.svg', alt: 'Sticky note' },
        { name: 'Shape', icon: 'shapes.svg', alt: 'Shape' },
        { name: 'Connection', icon: 'curved-arrow.svg', alt: 'Connection line' },
        { name: 'Drawing', icon: 'pen.svg', alt: 'Pen' },
        { name: 'Comment', icon: 'comment.svg', alt: 'Comment' },
        { name: 'Frame', icon: 'capture.svg', alt: 'Frame' }
    ];

    constructor(
        // eslint-disable-next-line no-unused-vars
        private entityHandlerService: EntityHandlerService,
        // eslint-disable-next-line no-unused-vars
        private canvasManagerService: CanvasManagerService
    ) {
        this.onButtonClick(this.DEFAULT_OPTION);
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngAfterViewInit() {}

    onButtonClick(name: string) {
        if (this.canvas) {
            this.canvasManagerService.discardAllSelection();
        }

        if (name == 'Select') {
            this.canvasManagerService.resetCursorStyle();
        } else if (name == 'Text') {
            //const options = { width: 18, height: 18, offsetX: 9, offsetY: 9 };
            this.canvasManagerService.setCursorStyle('text-editor');
        } else if (name == 'Sticky note') {
            //const options = { width: 32, height: 32, offsetX: 18, offsetY: 10 };
            this.canvasManagerService.setCursorStyle('sticky-note');
        } else if (name == 'Shape') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            this.canvasManagerService.setCursorStyle('crosshair');
        } else if (name == 'Connection') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            this.canvasManagerService.setCursorStyle('crosshair-1');
        } else if (name == 'Drawing') {
            //const options = { width: 24, height: 24, offsetX: 0, offsetY: 22 };
            this.canvasManagerService.setCursorStyle('pencil');
        } else if (name == 'Comment') {
            //const options = { width: 24, height: 24, offsetX: 4, offsetY: 21 };
            this.canvasManagerService.setCursorStyle('comment');
        } else if (name == 'Frame') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            this.canvasManagerService.setCursorStyle('crosshair-2');
        } else {
            console.warn(`Unhandled button name: ${name}`);
        }

        ToolsMenuComponent.currentSelected = name;
    }

    public getCurrentSelected() {
        return ToolsMenuComponent.currentSelected;
    }
}
