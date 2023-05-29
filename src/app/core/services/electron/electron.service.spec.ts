import { ElectronService } from './electron.service';
import { TestBed } from '@angular/core/testing';

describe('ElectronService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ElectronService = TestBed.get(ElectronService);
        expect(service).toBeTruthy();
    });
});
