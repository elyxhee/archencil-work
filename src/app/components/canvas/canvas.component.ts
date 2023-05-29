import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ElementRef } from '@angular/core';
import { fabric } from 'fabric';
import { EntityHandlerService } from './services/entity-handler.service';
import { CanvasManagerService } from './services/canvas-manager.service';
import { ToolsMenuComponent } from './tools-menu/tools-menu.component';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
    public canvas: fabric.Canvas;
    private isSpacePressed = false;
    private isPanning = false;
    private lastPosX: number;
    private lastPosY: number;
    public workingArea: fabric.Rect;

    public workingAreaWidth = 10000;
    public workingAreaHeight = 10000;

    public minZoom: number;
    public maxZoom: number;

    showRedDot: boolean = false;
    redDotPosition = { x: 0, y: 0 };

    constructor(
        // eslint-disable-next-line no-unused-vars
        private canvasManagerService: CanvasManagerService,
        // eslint-disable-next-line no-unused-vars
        private entityHandlerService: EntityHandlerService,
        // eslint-disable-next-line no-unused-vars
        private renderer: Renderer2,
        // eslint-disable-next-line no-unused-vars
        private el: ElementRef
    ) {
        this.minZoom = 0.1; // Set the minimum zoom level
        this.maxZoom = 10; // Set the maximum zoom level
    }

    ngOnInit() {
        // Create the canvas
        this.canvas = new fabric.Canvas('canvas', {
            selection: false,
            fireRightClick: true, // <-- enable firing of right click events
            fireMiddleClick: true, // <-- enable firing of middle click events
            stopContextMenu: true, // <--  prevent context menu from showing
            lockScalingFlip: true,
            preserveObjectStacking: true
        });

        // Pass the canvas to the service
        CanvasManagerService.canvas = this.canvas;

        this.resizeCanvas();

        window.addEventListener('resize', this.resizeCanvas.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.canvas.on('mouse:down', this.handleMouseDown.bind(this));
        this.canvas.on('mouse:move', this.handleMouseMove.bind(this));
        this.canvas.on('mouse:up', this.handleMouseUp.bind(this));
        this.canvas.wrapperEl.addEventListener('wheel', this.handleMouseWheel.bind(this));
        this.generateRandomHelloWorldTexts();

        this.addWorkingArea();

        /*this.canvas.on('object:modified', () => {
            this.minimap.syncCanvasObjects();
        });*/

        // Add the scaling event listener
        this.canvas.on('object:scaling', (e) => {
            const obj = e.target;

            // Check if the object is being scaled outside the work area
            if (obj.width * obj.scaleX > this.workingAreaWidth || obj.height * obj.scaleY > this.workingAreaHeight) {
                // If outside bounds, revert to the previous scaling values
                obj.set({
                    scaleX: obj.previousScaleX,
                    scaleY: obj.previousScaleY
                });
            } else {
                // If within bounds, store the current scaling values
                obj.previousScaleX = obj.scaleX;
                obj.previousScaleY = obj.scaleY;
            }

            // Render the canvas
            this.canvas.renderAll();
        });

        this.canvas.on('object:scaling', (e) => {
            // eslint-disable-next-line no-unused-vars
            const obj = e.target;

            // Render the canvas
            this.canvas.renderAll();
        });
    }

    onMinimapClicked(event: any): void {
        // Your logic for handling the minimap click event
        console.log('Minimap clicked:', event);
    }

    ngAfterViewInit() {
        this.updateWorkingArea();

        // Prevent the browser's default context menu
        this.canvas.lowerCanvasEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        window.removeEventListener('keyup', this.handleKeyUp.bind(this));
        this.canvas.wrapperEl.removeEventListener('wheel', this.handleMouseWheel.bind(this));
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === 'KeyK') {
            const scaleFactor = Math.min(500 / this.workingArea.width, 300 / this.workingArea.height);

            // Save the current viewport transform of the main canvas
            const prevViewportTransform = this.canvas.viewportTransform.slice();

            // Reset the viewport transform of the main canvas to default values
            this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

            const dataUrl = this.canvas.toDataURL({
                left: this.workingArea.left,
                top: this.workingArea.top,
                width: this.workingArea.width,
                height: this.workingArea.height,
                multiplier: scaleFactor
            });

            // Restore the previous viewport transform of the main canvas
            this.canvas.setViewportTransform(prevViewportTransform);

            // Open the screenshot in a new tab
            window.open(dataUrl, '_blank');
        }

        if (event.code === 'Space') {
            this.isSpacePressed = true;
            this.canvas.defaultCursor = 'grab';
        }

        if (event.altKey && event.code === 'KeyK') {
            this.showRedDot = !this.showRedDot;
            if (this.showRedDot) {
                this.redDotPosition.x = this.canvas.width / 2 - 5;
                this.redDotPosition.y = this.canvas.height / 2 - 5;
            }
        }
    }

    handleKeyUp(event: KeyboardEvent) {
        if (event.code === 'Space') {
            this.isSpacePressed = false;
            this.canvas.defaultCursor = 'default';
        }
    }

    handleMouseDown(event: fabric.IEvent) {
        if (this.isSpacePressed) {
            this.isPanning = true;
            this.canvas.defaultCursor = 'grabbing';
            this.lastPosX = event.e.clientX;
            this.lastPosY = event.e.clientY;
        } else {
            if (ToolsMenuComponent.currentSelected == 'Select') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Text') {
                this.canvasManagerService.handleTextClick(event);
            } else if (ToolsMenuComponent.currentSelected == 'Sticky note') {
                this.canvasManagerService.handleStickyNote(event);
            } else if (ToolsMenuComponent.currentSelected == 'Shape') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Connection') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Drawing') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Comment') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Frame') {
                //console.log(ToolsMenuComponent.currentSelected);
            }
        }
    }

    handleMouseMove(event: fabric.IEvent) {
        if (this.isPanning && event.e.clientX && event.e.clientY) {
            const deltaLeft = event.e.clientX - this.lastPosX;
            const deltaTop = event.e.clientY - this.lastPosY;

            const currentLeft = this.canvas.viewportTransform[4];
            const currentTop = this.canvas.viewportTransform[5];

            const newLeft = currentLeft + deltaLeft;
            const newTop = currentTop + deltaTop;

            // Define your panning boundaries
            const leftBoundary = -this.workingAreaWidth;
            const rightBoundary = this.workingAreaWidth;
            const topBoundary = -this.workingAreaHeight;
            const bottomBoundary = this.workingAreaHeight;

            // Check if the new viewport position is within the boundaries
            if (
                newLeft >= leftBoundary &&
                newLeft <= rightBoundary &&
                newTop >= topBoundary &&
                newTop <= bottomBoundary
            ) {
                this.canvas.relativePan(new fabric.Point(deltaLeft, deltaTop));
            }

            this.lastPosX = event.e.clientX;
            this.lastPosY = event.e.clientY;
        } else if (event.target && !this.isSpacePressed) {
            const target = event.target;
            target.setCoords(); // Update the object's coordinates

            const zoom = this.canvas.getZoom();
            let oCoords = target.oCoords;
            const viewportTransform = this.canvas.viewportTransform;

            const minX = 0;
            const maxX = this.workingAreaWidth;
            const minY = 0;
            const maxY = this.workingAreaHeight;

            // Calculate the necessary adjustments
            let deltaX = 0;
            let deltaY = 0;

            // Apply the adjustments
            target.set({
                left: target.left + deltaX,
                top: target.top + deltaY
            });
            target.setCoords();

            const coordsArray = ['tl', 'tr', 'bl', 'br'];
            for (const coord of coordsArray) {
                const transformedX = (oCoords[coord].x - viewportTransform[4]) / zoom;
                const transformedY = (oCoords[coord].y - viewportTransform[5]) / zoom;

                if (transformedX < minX) {
                    deltaX = Math.max(deltaX, minX - transformedX);
                } else if (transformedX > maxX) {
                    deltaX = Math.min(deltaX, maxX - transformedX);
                }

                if (transformedY < minY) {
                    deltaY = Math.max(deltaY, minY - transformedY);
                } else if (transformedY > maxY) {
                    deltaY = Math.min(deltaY, maxY - transformedY);
                }
            }

            // Apply the adjustments
            target.set({
                left: target.left + deltaX,
                top: target.top + deltaY
            });

            target.setCoords();

            // Double-check and make sure no corners are outside the boundary box
            oCoords = target.oCoords;
            for (const coord of coordsArray) {
                const transformedX = (oCoords[coord].x - viewportTransform[4]) / zoom;
                const transformedY = (oCoords[coord].y - viewportTransform[5]) / zoom;

                if (transformedX < minX) {
                    target.set({ left: target.left + (minX - transformedX) });
                } else if (transformedX > maxX) {
                    target.set({ left: target.left - (transformedX - maxX) });
                }

                if (transformedY < minY) {
                    target.set({ top: target.top + (minY - transformedY) });
                } else if (transformedY > maxY) {
                    target.set({ top: target.top - (transformedY - maxY) });
                }
            }

            target.setCoords();

            this.updateWorkingArea();
        }
    }

    handleMouseWheel(event: WheelEvent) {
        event.preventDefault();
        event.stopPropagation();

        const maxZoom = this.maxZoom;
        const minZoom = this.minZoom;

        let delta = Math.sign(event.deltaY);
        const smoothZoomFactor = 1.1; // Smoother zoom
        const fastZoomFactor = 1.3; // Faster zoom when Alt key is pressed

        const zoomFactor = event.altKey ? fastZoomFactor : smoothZoomFactor;

        let zoomLevel = this.canvas.getZoom();

        // Calculate the new zoom level logarithmically
        let targetZoomLevel = delta < 0 ? zoomLevel * zoomFactor : zoomLevel / zoomFactor;

        // Clamp the zoom level within the maximum and minimum scroll values
        targetZoomLevel = Math.max(minZoom, Math.min(maxZoom, targetZoomLevel));

        // Get the canvas-relative position of the mouse
        const boundingRect = this.canvas.wrapperEl.getBoundingClientRect();
        const canvasMouseX = event.clientX - boundingRect.left;
        const canvasMouseY = event.clientY - boundingRect.top;

        // Directly set the zoom level without animation
        this.canvas.zoomToPoint(new fabric.Point(canvasMouseX, canvasMouseY), targetZoomLevel);
        this.canvas.renderAll(); // Re-render the canvas
    }

    handleMouseUp() {
        this.isPanning = false;
        if (this.isSpacePressed) {
            this.canvas.defaultCursor = 'grab';
        }
    }

    resizeCanvas() {
        const canvasContainer = document.querySelector('.canvas-container') as HTMLElement;
        this.canvas.setWidth(canvasContainer.clientWidth);
        this.canvas.setHeight(canvasContainer.clientHeight);
        this.canvas.calcOffset();
        this.canvas.renderAll();
    }

    updateWorkingArea() {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        const viewportTransform = this.canvas.viewportTransform;
        const zoom = this.canvas.getZoom();

        this.canvas.forEachObject((obj) => {
            if (obj === this.workingArea) return; // Skip the working area rectangle itself

            if (obj.constrained === false) {
                return; // Skip the green box
            }

            const objBounds = obj.getBoundingRect();
            const transformedLeft = (objBounds.left - viewportTransform[4]) / zoom;
            const transformedTop = (objBounds.top - viewportTransform[5]) / zoom;
            const transformedWidth = objBounds.width / zoom;
            const transformedHeight = objBounds.height / zoom;

            minX = Math.min(minX, transformedLeft);
            minY = Math.min(minY, transformedTop);
            maxX = Math.max(maxX, transformedLeft + transformedWidth);
            maxY = Math.max(maxY, transformedTop + transformedHeight);
        });

        this.workingArea.set({
            left: minX,
            top: minY,
            width: Math.min(maxX - minX, this.workingAreaWidth),
            height: Math.min(maxY - minY, this.workingAreaHeight)
        });

        this.workingArea.setCoords(); // Update the object's coordinates
    }

    addWorkingArea() {
        const rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.workingAreaWidth,
            height: this.workingAreaHeight,
            fill: 'rgba(255, 0, 0, 0.3)',
            selectable: false,
            evented: false,
            name: 'workingArea'
        });

        this.workingArea = rect; // Add this line
        this.canvas.add(rect);
        this.canvas.moveTo(rect, -1); // Move the rectangle to the bottom layer
    }

    generateRandomHelloWorldTexts() {
        for (let i = 0; i < 10; i++) {
            const randomLeft = Math.random() * (this.canvas.width - 100); // Subtracting 100 to avoid text going off the canvas
            const randomTop = Math.random() * (this.canvas.height - 50); // Subtracting 50 to avoid text going off the canvas
            const randomColor = this.getRandomColor(); // Generate a random color
            this.entityHandlerService.addEntityText(this.canvas, 'Hello World', randomLeft, randomTop, randomColor);
        }
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
