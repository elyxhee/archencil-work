import { TestBed } from '@angular/core/testing';
import { InputConfigStartupService } from './input-config-startup.service';

describe('InputConfigStartupService', () => {
    let service: InputConfigStartupService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InputConfigStartupService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Add more tests for your service methods here
});
