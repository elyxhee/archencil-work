import { TestBed } from '@angular/core/testing';
import { MouseCursorService } from './mouse-cursor.service';

describe('MouseCursorService', () => {
    let service: MouseCursorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseCursorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
