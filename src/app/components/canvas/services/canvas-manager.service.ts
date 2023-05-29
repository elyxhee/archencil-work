import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { MouseCursorService } from '~components/services/mouse-cursor.service';

@Injectable({
    providedIn: 'root'
})
export class CanvasManagerService {
    public static canvas: fabric.canvas | null = null;
    private mouseCursorService: MouseCursorService;

    constructor(mouseCursorService: MouseCursorService) {
        this.mouseCursorService = mouseCursorService;
    }

    /* START - MOUSE CURSOR */

    setCursorStyle(
        cursorImage: string | null,
        options: { width?: number; height?: number; offsetX?: number; offsetY?: number } = {}
    ) {
        this.mouseCursorService.setCursorStyle(cursorImage, options);
    }

    getCurrentCursorStyle(): string {
        return this.mouseCursorService.getCurrentCursorStyle();
    }

    resetCursorStyle() {
        this.mouseCursorService.resetCursorStyle();
    }

    /* END - MOUSE CURSOR */

    discardAllSelection() {
        CanvasManagerService.canvas.discardActiveObject();

        // Now remove the headerbar
    }

    getActiveObject() {
        const selectedObject = CanvasManagerService.canvas.getActiveObject();

        return selectedObject;
    }

    // Add this method to your class
    validateText(text: string, minLength: number, maxLength: number): boolean {
        let trimmedText = text.trim();

        // Check if the text is not empty and if it meets the minimum and maximum length
        if (trimmedText !== '' && trimmedText.length >= minLength && trimmedText.length <= maxLength) {
            return true;
        } else {
            return false;
        }
    }

    handleTextClick(event): void {
        let pointer = CanvasManagerService.canvas.getPointer(event.e);

        const textInput = new fabric.IText('', {
            left: pointer.x,
            top: pointer.y - 10,
            fill: '#000000',
            fontSize: 24,
            fontFamily: 'Arial',
            editable: true,
            lockScalingFlip: true,
            exitOnReturn: false,
            selectionStart: 0, // Added this line
            selectionEnd: 0 // And this line
        });

        if (!CanvasManagerService.canvas.getObjects().length) {
            // Disable rendering during text input creation for the first object
            CanvasManagerService.canvas.renderOnAddRemove = false;
        }

        CanvasManagerService.canvas.add(textInput);
        CanvasManagerService.canvas.setActiveObject(textInput);

        textInput.enterEditing();

        textInput.on('editing:exited', () => {
            if (this.validateText(textInput.text, 3, 100)) {
                textInput.bringToFront();
                const textOutput = new fabric.Text(textInput.text, {
                    left: textInput.left,
                    top: textInput.top,
                    fill: textInput.fill,
                    fontSize: textInput.fontSize,
                    fontFamily: textInput.fontFamily,
                    lockScalingFlip: textInput.lockScalingFlip
                });

                CanvasManagerService.canvas.remove(textInput);
                CanvasManagerService.canvas.add(textOutput);
                CanvasManagerService.canvas.setActiveObject(textOutput);

                if (!CanvasManagerService.canvas.getObjects().length) {
                    // Re-enable rendering after adding the first object
                    CanvasManagerService.canvas.renderOnAddRemove = true;
                    // Render the canvas to apply the changes
                    CanvasManagerService.canvas.requestRenderAll();
                }
            } else {
                CanvasManagerService.canvas.remove(textInput);
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey && textInput.isEditing) {
                textInput.exitEditing();
            }
        });

        CanvasManagerService.canvas.requestRenderAll();
    }

    handleStickyNote(event): void {
        let pointer = CanvasManagerService.canvas.getPointer(event.e);

        // Check if there is any object at the clicked position
        const objects = CanvasManagerService.canvas.getObjects();
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];

            // Skip the working area object
            if (object.name === 'workingArea') {
                continue;
            }

            if (object.containsPoint(pointer)) {
                //console.log('Object Name:', object.name); // Output the name of the object for debugging purposes
                return; // Return if an object other than the ignored object already exists at the clicked position
            }
        }

        const stickyNoteBackground = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            fill: '#ffff88',
            width: 200,
            height: 200,
            rx: 10,
            ry: 10,
            hasControls: false,
            originX: 'left',
            originY: 'top',
            hoverCursor: 'text'
        });

        const stickyNoteText = new fabric.IText('', {
            left: stickyNoteBackground.left + 10,
            top: stickyNoteBackground.top + stickyNoteBackground.height / 2,
            fill: '#000000',
            fontSize: stickyNoteBackground.height / 2, // Initial large font size
            fontFamily: 'Arial',
            originX: 'left',
            originY: 'center',
            hasControls: false,
            lockUniScaling: true,
            lockMovementX: true,
            lockMovementY: true,
            splitByGrapheme: false,
            hoverCursor: 'text'
        });

        let currentCursorStyle: string | null;

        stickyNoteBackground.on(
            'mouseover',
            function () {
                currentCursorStyle = this.getCurrentCursorStyle();
                //console.log('mouseon', currentCursorStyle);
            }.bind(this)
        );
        stickyNoteBackground.on(
            'mouseout',
            function () {
                // Return cursor back to original style
                this.setCursorStyle(currentCursorStyle);
                //console.log('mouseout', currentCursorStyle);
            }.bind(this)
        );

        stickyNoteText.on('changed', function () {
            const maxWidth = stickyNoteBackground.width - 20;
            const maxHeight = stickyNoteBackground.height - 20;
            let ctx = CanvasManagerService.canvas.getContext('2d');
            let text = stickyNoteText.text;
            let newText = '';
            let line = '';
            let lineWidth = 0;
            let linesCount = 1;
            let fontSize = stickyNoteText.fontSize;
            let textTotalHeight;
            let widestLineWidth = 0; // To keep track of the widest line

            if (text.length === 0) return;

            // Preserve the original selection before processing
            const originalSelectionStart = stickyNoteText.selectionStart;
            const originalSelectionEnd = stickyNoteText.selectionEnd;

            // Additional newlines added due to word wrap
            let additionalNewLines = 0;

            // decrease the font size until the total height of the text is within the sticky note's boundaries
            do {
                ctx.font = `${fontSize}px ${stickyNoteText.fontFamily}`;
                lineWidth = 0;
                newText = '';
                line = '';
                linesCount = 1;

                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    const charWidth = ctx.measureText(char).width;
                    lineWidth += charWidth;

                    if (lineWidth > maxWidth) {
                        if (i < originalSelectionStart) {
                            additionalNewLines++;
                        }
                        newText += '\n' + line.trim();
                        if (lineWidth > widestLineWidth) {
                            // Check if this line is the widest so far
                            widestLineWidth = lineWidth;
                        }
                        line = '';
                        lineWidth = charWidth;
                        linesCount++;
                    } else if (lineWidth > widestLineWidth) {
                        widestLineWidth = lineWidth;
                    }

                    line += char;
                }

                fontSize--;
                textTotalHeight = linesCount * (fontSize + stickyNoteText.lineHeight * fontSize); // account for line spacing
            } while (textTotalHeight > maxHeight && fontSize > 0);

            newText += '\n' + line.trim();
            stickyNoteText.text = newText.trim();
            stickyNoteText.selectionStart = originalSelectionStart + additionalNewLines;
            stickyNoteText.selectionEnd = originalSelectionEnd + additionalNewLines;

            stickyNoteText.set({ fontSize: fontSize + 1 }); // set the new font size
            stickyNoteText.width = widestLineWidth; // Set the width of the bounding box to the widest line's width

            stickyNoteText.top = stickyNoteBackground.top + stickyNoteBackground.height / 2; // always align text to center of stickyNoteBackground
            stickyNoteText.setCoords();

            CanvasManagerService.canvas.requestRenderAll();
        });

        CanvasManagerService.canvas.add(stickyNoteBackground, stickyNoteText);
        CanvasManagerService.canvas.setActiveObject(stickyNoteText);

        stickyNoteText.enterEditing();

        CanvasManagerService.canvas.renderAll();
    }
}
