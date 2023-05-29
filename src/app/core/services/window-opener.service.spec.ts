import { TestBed } from '@angular/core/testing';

import { WindowOpenerService } from './window-opener.service';

describe('WindowOpenerService', () => {
    let service: WindowOpenerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WindowOpenerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
