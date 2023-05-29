import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor() {}

    showSuccess(title: string, message: string, subtitle?: string) {
        Swal.fire({
            title: title,
            html: `${message}${subtitle ? '<br><small>' + subtitle + '</small>' : ''}`,
            icon: 'success'
        });
    }

    showError(title: string, message: string, subtitle?: string) {
        Swal.fire({
            title: title,
            html: `${message}${subtitle ? '<br><small>' + subtitle + '</small>' : ''}`,
            icon: 'error'
        });
    }

    showInfo(title: string, message: string, subtitle?: string) {
        Swal.fire({
            title: title,
            html: `${message}${subtitle ? '<br><small>' + subtitle + '</small>' : ''}`,
            icon: 'info'
        });
    }

    showWarning(title: string, message: string, subtitle?: string) {
        Swal.fire({
            title: title,
            html: `${message}${subtitle ? '<br><small>' + subtitle + '</small>' : ''}`,
            icon: 'warning'
        });
    }

    showConfirm(message: string, title: string) {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });
    }

    showInput(
        title: string,
        message: string,
        placeholder: string,
        confirmBtn: string,
        cancelBtn: string
    ): Promise<any> {
        return Swal.fire({
            title: title,
            text: message,
            input: 'text',
            inputPlaceholder: placeholder,
            showCancelButton: true,
            confirmButtonText: confirmBtn,
            cancelButtonText: cancelBtn,
            allowOutsideClick: false
        });
    }

    showSelect(
        title: string,
        message: string,
        selectOptions: { [label: string]: string },
        confirmBtn: string,
        cancelBtn: string
    ): Promise<any> {
        return Swal.fire({
            title: title,
            text: message,
            input: 'select',
            inputOptions: selectOptions,
            showCancelButton: true,
            confirmButtonText: confirmBtn,
            cancelButtonText: cancelBtn,
            allowOutsideClick: false
        });
    }
}
