import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';

@Injectable({
    providedIn: 'root'
})
export class EntityHandlerService {
    constructor(
        // eslint-disable-next-line no-unused-vars
        private canvasManagerService: CanvasManagerService
    ) {}

    addEntityText(canvas: fabric.Canvas, str: string, left: number, top: number, color: string): void {
        const text = new fabric.Text(str, {
            left: left,
            top: top,
            fill: color, // Set the color of the text
            fontSize: 24,
            fontFamily: 'Arial',
            lockScalingFlip: {
                direction: 'both'
            }
        });
        text.bringToFront();
        canvas.add(text);
    }
}
