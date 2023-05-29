import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AlertToastrService {
    // eslint-disable-next-line no-unused-vars
    constructor(private toastr: ToastrService) {}

    showSuccess(message: string, title: string) {
        this.toastr.success(message, title);
    }

    showError(message: string, title: string) {
        this.toastr.error(message, title);
    }

    showInfo(message: string, title: string) {
        this.toastr.info(message, title);
    }

    showWarning(message: string, title: string) {
        this.toastr.warning(message, title);
    }
}
