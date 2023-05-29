import { Injectable } from '@angular/core';
import { CanvasManagerService } from '../canvas/services/canvas-manager.service';

@Injectable({
    providedIn: 'root'
})
export class MouseCursorService {
    private customCursorUrl: string | null = null;
    private basePath = 'assets/mouse_cursors/';
    private DEBUG_RED_DOT = false;
    private cursorDiv: HTMLDivElement | null = null;
    private cursorBoxDiv: HTMLDivElement | null = null; // New div for the blue bounding box

    private preloadedCursors = new Map<string, string>();

    private currentCursor: string = null;

    // Debug cursor properties of the red dot
    private DEBUG_WIDTH_RED_DOT: number = 5;
    private DEBUG_HEIGHT_RED_DOT: number = 5;
    private DEBUG_OFFSET_X_RED_DOT: number = -2;
    private DEBUG_OFFSET_Y_RED_DOT: number = -1;

    // New debug variables
    private DEBUG_CURSOR_BOX = false;
    private DEBUG_CURSOR_BOX_WIDTH = 32;
    private DEBUG_CURSOR_BOX_HEIGHT = 32;
    private DEBUG_CURSOR_BOX_OFFSET_X = 0;
    private DEBUG_CURSOR_BOX_OFFSET_Y = 0;

    cursorNames = ['comment', 'crosshair-1', 'crosshair-2', 'crosshair', 'pencil', 'sticky-note', 'text-editor'];

    // eslint-disable-next-line no-unused-vars
    constructor() {
        this.preloadCursors(this.cursorNames);
    }

    private async preloadCursors(cursorNames: string[]): Promise<void> {
        for (const cursorName of cursorNames) {
            const cursorImageUrl = this.basePath + cursorName + '.png';
            try {
                const preloadedCursor = await this.preloadImage(cursorImageUrl);
                this.preloadedCursors.set(cursorName, preloadedCursor);
            } catch (error) {
                console.error(`Failed to preload cursor "${cursorName}":`, error);
            }
        }
    }

    private preloadImage(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                resolve(url);
            };
            img.onerror = () => {
                reject('Failed to load the image');
            };
        });
    }

    private updateCursor(customCursorUrl: string | null, offsetX: number, offsetY: number) {
        if (CanvasManagerService.canvas) {
            const fabricCanvas = CanvasManagerService.canvas as any;
            if (customCursorUrl) {
                fabricCanvas.lowerCanvasEl.style.cursor = `url('${customCursorUrl}') ${offsetX} ${offsetY}, auto`;
            } else {
                fabricCanvas.lowerCanvasEl.style.cursor = 'default';
            }
        }
    }

    private createCursorDiv() {
        if (this.DEBUG_RED_DOT) {
            this.cursorDiv = document.createElement('div');
            this.cursorDiv.style.position = 'absolute';
            this.cursorDiv.style.zIndex = '99999';
            this.cursorDiv.style.pointerEvents = 'none';
            this.cursorDiv.style.backgroundColor = 'red';
            this.cursorDiv.style.borderRadius = '50%';
            document.body.appendChild(this.cursorDiv);

            document.addEventListener('mousemove', (event) => {
                if (this.cursorDiv) {
                    const cursorOffsetX = this.DEBUG_OFFSET_X_RED_DOT;
                    const cursorOffsetY = this.DEBUG_OFFSET_Y_RED_DOT;
                    this.cursorDiv.style.left = `${event.clientX + cursorOffsetX}px`;
                    this.cursorDiv.style.top = `${event.clientY + cursorOffsetY}px`;
                    this.cursorDiv.style.width = `${this.DEBUG_WIDTH_RED_DOT}px`;
                    this.cursorDiv.style.height = `${this.DEBUG_HEIGHT_RED_DOT}px`;
                }
            });
        }

        // Create the blue bounding box div
        if (this.DEBUG_CURSOR_BOX) {
            this.cursorBoxDiv = document.createElement('div');
            this.cursorBoxDiv.style.position = 'absolute';
            this.cursorBoxDiv.style.zIndex = '99998';
            this.cursorBoxDiv.style.pointerEvents = 'none';
            this.cursorBoxDiv.style.border = '1px solid blue';
            document.body.appendChild(this.cursorBoxDiv);

            document.addEventListener('mousemove', (event) => {
                if (this.cursorBoxDiv) {
                    this.cursorBoxDiv.style.left = `${event.clientX + this.DEBUG_CURSOR_BOX_OFFSET_X}px`;
                    this.cursorBoxDiv.style.top = `${event.clientY + this.DEBUG_CURSOR_BOX_OFFSET_Y}px`;
                    this.cursorBoxDiv.style.width = `${this.DEBUG_CURSOR_BOX_WIDTH}px`;
                    this.cursorBoxDiv.style.height = `${this.DEBUG_CURSOR_BOX_HEIGHT}px`;
                }
            });
        }
    }

    async setCursorStyle(
        cursorImage: string | null,
        options: { width?: number; height?: number; offsetX?: number; offsetY?: number } = {}
    ) {
        if (!options.width || !options.height || !options.offsetX || !options.offsetY) {
            // Options not explicitly provided, set options based on the name
            switch (cursorImage) {
                case 'text-editor':
                    options = { width: 18, height: 18, offsetX: 9, offsetY: 9 };
                    break;
                case 'sticky-note':
                    options = { width: 32, height: 32, offsetX: 18, offsetY: 10 };
                    break;
                case 'crosshair':
                    options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
                    break;
                case 'crosshair-1':
                    options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
                    break;
                case 'frame':
                    options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
                    break;
                case 'pencil':
                    options = { width: 24, height: 24, offsetX: 0, offsetY: 22 };
                    break;
                case 'comment':
                    options = { width: 24, height: 24, offsetX: 4, offsetY: 21 };
                    break;
                default:
                //console.warn(`Unhandled cursorImage: ${cursorImage}`);
            }
        }
        if (cursorImage) {
            // Use the preloaded image if available
            const preloadedCursor = this.preloadedCursors.get(cursorImage);
            const cursorImageUrl = preloadedCursor ? preloadedCursor : this.basePath + cursorImage + '.png';

            const customCursorUrl = await this.createScaledCursor(cursorImageUrl, options);

            if (CanvasManagerService.canvas) {
                const fabricCanvas = CanvasManagerService.canvas as any;
                fabricCanvas.defaultCursor = `url('${customCursorUrl}') ${options.offsetX} ${options.offsetY}, auto`;
                fabricCanvas.hoverCursor = `url('${customCursorUrl}') ${options.offsetX} ${options.offsetY}, auto`;
            }

            this.updateCursor(customCursorUrl, options.offsetX, options.offsetY);
        } else {
            this.customCursorUrl = null;
            if (CanvasManagerService.canvas) {
                const fabricCanvas = CanvasManagerService.canvas as any;
                fabricCanvas.defaultCursor = 'default';
                fabricCanvas.hoverCursor = 'pointer';
            }

            this.updateCursor(null, 0, 0);
        }

        if ((this.DEBUG_RED_DOT || this.DEBUG_CURSOR_BOX) && !this.cursorDiv) {
            this.createCursorDiv();
        }

        // Set the current cursor
        //console.log('cursor changed to', cursorImage);
        this.currentCursor = cursorImage;
    }

    private async createScaledCursor(
        cursorImageUrl: string,
        options: { width?: number; height?: number; offsetX?: number; offsetY?: number } = {}
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.src = cursorImageUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = options.width + Math.abs(options.offsetX);
                canvas.height = options.height + Math.abs(options.offsetY);
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(
                        img,
                        options.offsetX < 0 ? Math.abs(options.offsetX) : 0,
                        options.offsetY < 0 ? Math.abs(options.offsetY) : 0,
                        options.width,
                        options.height
                    );
                    resolve(canvas.toDataURL());
                } else {
                    reject('Failed to create a scaled cursor image');
                }
            };
            img.onerror = () => {
                reject('Failed to load the cursor image');
            };
        });
    }

    resetCursorStyle() {
        this.setCursorStyle(null);
        if (this.DEBUG_RED_DOT && !this.cursorDiv) {
            this.createCursorDiv();
        }
    }

    getCurrentCursorStyle(): string | null {
        return this.currentCursor;
    }
}
