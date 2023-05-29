import { TestBed } from '@angular/core/testing';
import { EntityHandlerService } from './entity-handler.service';
import { fabric } from 'fabric';

describe('EntityHandlerService', () => {
    let service: EntityHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EntityHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add a text entity to the canvas', () => {
        const canvas = new fabric.Canvas(null);
        const initialCount = canvas.getObjects().length;

        service.addEntityText(canvas, 'Test', 10, 10);
        const newCount = canvas.getObjects().length;

        expect(newCount).toBe(initialCount + 1);

        const addedText = canvas.getObjects()[0] as fabric.Text;
        expect(addedText.text).toBe('Test');
        expect(addedText.left).toBe(10);
        expect(addedText.top).toBe(10);
        expect(addedText.fontSize).toBe(24);
        expect(addedText.fontFamily).toBe('Arial');
        expect(addedText.lockScalingFlip).toEqual({ direction: 'both' });
    });
});
