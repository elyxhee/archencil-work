import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fabric } from 'fabric';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

let _canvas: any;

@Component({
    selector: 'app-bounding-box',
    templateUrl: './bounding-box.component.html',
    styleUrls: ['./bounding-box.component.scss']
})
export class BoundingBoxComponent implements OnInit, AfterViewInit {
    @Input() canvas: fabric.Canvas;
    @Input() workingArea: fabric.Canvas;

    @Output() showContextMenuEvent = new EventEmitter<{ x: number; y: number }>();
    @Output() hideContextMenuEvent = new EventEmitter<void>();

    rotationImgIcon: any;

    isLocked = false;

    // The current element selected on the canvas
    selectedObject: fabric.Object | null = null; // <-- Add this property

    // eslint-disable-next-line no-unused-vars
    constructor(private http: HttpClient) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit() {
        const svgRotateIconPath = './assets/icons/svg/element-actions/restart.svg';
        this.rotationImgIcon = document.createElement('img');
        this.loadSvgIcon(svgRotateIconPath)
            .then((svgData) => {
                this.rotationImgIcon.src = svgData;
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });
    }

    ngAfterViewInit() {
        if (!this.canvas) {
            console.error('Canvas not found');

            return;
        }
        _canvas = this.canvas;

        //this.customizeControls();
        this.setCustomControls();
        this.modifyBoundingBox();

        _canvas.on('mouse:over', (options) => {
            if (options.target?.isControl) {
                _canvas.defaultCursor = 'grab';
            }
        });

        _canvas.on('mouse:out', (options) => {
            if (options.target?.isControl) {
                _canvas.defaultCursor = 'default';
            }
        });

        _canvas.on('object:rotating', () => {
            _canvas.setCursor('grab');
        });

        this.handleObjectSelection();
    }

    private customizeControls(): void {
        fabric.Object.prototype.controls = {
            tl: new fabric.Control({ x: -0.5, y: -0.5, cursorStyle: 'nw-resize' }),
            tr: new fabric.Control({ x: 0.5, y: -0.5, cursorStyle: 'ne-resize' }),
            bl: new fabric.Control({ x: -0.5, y: 0.5, cursorStyle: 'sw-resize' }),
            br: new fabric.Control({ x: 0.5, y: 0.5, cursorStyle: 'se-resize' }),
            mtr: new fabric.Control({ x: 0, y: -0.5, cursorStyle: 'crosshair' })
        };
    }

    loadSvgIcon(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get(path, { responseType: 'text' }).subscribe(
                (data) => {
                    resolve(`data:image/svg+xml;utf8,${encodeURIComponent(data)}`);
                },
                (error: HttpErrorResponse) => {
                    console.error('Error fetching SVG icon:', error.message);
                    reject(error);
                }
            );
        });
    }

    setCustomControls() {
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'white';
        fabric.Object.prototype.cornerStyle = 'circle';

        const strokeColor = 'grey';
        const strokeWidth = 1; // adjust as needed
        const circleSize = 10; // adjust as needed

        // redefine render function for corner controls
        const controls = ['tl', 'tr', 'bl', 'br', 'ml', 'mt', 'mr', 'mb'];
        controls.forEach((control) => {
            // eslint-disable-next-line no-unused-vars
            fabric.Object.prototype.controls[control].render = function (ctx, left, top, styleOverride, fabricObject) {
                styleOverride = styleOverride || {};
                ctx.save();
                ctx.strokeStyle = styleOverride.cornerStrokeColor || strokeColor;
                ctx.lineWidth = styleOverride.cornerStrokeWidth || strokeWidth;
                ctx.fillStyle = styleOverride.cornerColor || this.cornerColor;
                ctx.beginPath();
                ctx.arc(left, top, circleSize / 2, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            };
        });

        // Rotation control
        fabric.Object.prototype.controls.mtr = new fabric.Control({
            x: -0.5, // Shifted to the left
            y: 0.5, // Shifted to the bottom
            offsetX: -20, // Adjust offsetX if needed
            offsetY: 20, // Adjust offsetY if needed
            cursorStyle: 'grab',
            actionHandler: fabric.controlsUtils.rotationWithSnapping,
            actionName: 'rotate',
            cornerSize: 38,
            withConnection: false,
            render: (ctx, left, top, styleOverride, fabricObject) => {
                this.renderRotationControl(ctx, left, top, styleOverride, fabricObject);
            }
        });

        // Rotation control visibility
        fabric.Object.prototype.setControlVisible('mtr', true);
    }

    // Defining how the rendering action will be
    renderRotationControl(ctx, left, top, styleOverride, fabricObject) {
        const size = 24;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));

        // Check if the fabricObject is locked, being dragged or rotated
        const isLocked =
            fabricObject.lockMovementX &&
            fabricObject.lockMovementY &&
            fabricObject.lockScalingX &&
            fabricObject.lockScalingY &&
            fabricObject.lockRotation;
        const isDraggingOrRotating = fabricObject.isMoving || fabricObject.isRotating;

        // Set the global alpha based on the locked state or the dragging/rotating state
        ctx.globalAlpha = isLocked || isDraggingOrRotating ? 0.3 : 1;

        ctx.drawImage(this.rotationImgIcon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    renderSvgControl(ctx, left, top, styleOverride, fabricObject) {
        const size = fabricObject.cornerSize;
        const x = left - size / 2;
        const y = top - size / 2;

        ctx.save();

        // Check if the fabricObject is locked or not
        const isLocked =
            fabricObject.lockMovementX &&
            fabricObject.lockMovementY &&
            fabricObject.lockScalingX &&
            fabricObject.lockScalingY &&
            fabricObject.lockRotation;

        // Set the colors based on the locked state
        const fillColor = isLocked ? 'rgba(244, 67, 54, 0.3)' : '#f44336';
        const strokeColor = isLocked ? 'rgba(211, 47, 47, 0.3)' : '#d32f2f';
        const strokeWidth = isLocked ? 1.5 : 2;

        // Create a circle for the custom control
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2 - strokeWidth, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // Add an inner circle to make it look nicer
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 4, 0, 2 * Math.PI);
        ctx.fillStyle = strokeColor;
        ctx.fill();

        ctx.restore();
    }

    modifyBoundingBox() {
        fabric.Object.prototype.set({
            strokeWidth: 3, // Add a 20px transparent stroke
            stroke: 'rgba(0, 0, 0, 0)' // Make the stroke transparent
        });
    }

    // eslint-disable-next-line no-unused-vars
    rotateByPointer(eventData, transform, x, y) {
        const { target } = transform;
        const pointer = target.canvas.getPointer(eventData.e);

        const center = target.getCenterPoint();
        const angle = Math.atan2(pointer.y - center.y, pointer.x - center.x);

        target.rotate((fabric.util.radiansToDegrees(angle) + 90) % 360);
        return true;
    }

    handleObjectSelection() {
        _canvas.on('before:selection:cleared', (options) => {
            if (options.target) {
                const object = options.target;
                object.off('mousedown');
            }
            this.selectedObject = null; // Clear the selected object
        });

        _canvas.on('mouse:down', (options) => {
            if (options.target) {
                const object = options.target;

                // Select the object
                _canvas.setActiveObject(options.target);
                this.selectedObject = options.target; // Update the selected object

                object.on('mousedown', (event) => {
                    if (event.e.which === 3) {
                        // Right-click event
                        event.e.preventDefault(); // Prevent the default context menu
                        // eslint-disable-next-line no-empty
                    } else {
                    }
                });
            } else if (options.e.which === 3) {
                // Right-click on empty space
                options.e.preventDefault(); // Prevent the default context menu
                this.selectedObject = null; // Clear the selected object
            } else {
                // Any other mouse button on empty space
                this.selectedObject = null; // Clear the selected object
            }
        });
    }

    delete() {
        // eslint-disable-next-line no-unused-vars
        const activeObject = _canvas.getActive;
    }
}
