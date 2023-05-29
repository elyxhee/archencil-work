import { TestBed } from '@angular/core/testing';

import { AlertToastrService } from './alert-toastr.service';

describe('AlertToastrService', () => {
    let service: AlertToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AlertToastrService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
