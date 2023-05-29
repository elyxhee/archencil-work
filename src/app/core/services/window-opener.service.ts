import { Injectable } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../environments/environment';
import { ipcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class WindowOpenerService {
    ipcRenderer: typeof ipcRenderer;

    // eslint-disable-next-line no-unused-vars
    constructor(private electronService: ElectronService, private router: Router) {
        if (this.electronService.isElectron) {
            this.ipcRenderer = this.electronService.ipcRenderer;
            this.handleIpcNavigation();
        }
    }

    openNewComponent(componentName: string, data?: any): void {
        const windowFeatures = 'width=800,height=600';

        // Encode the data as a query parameter if it's not null or undefined
        const encodedData = data != null ? encodeURIComponent(JSON.stringify(data)) : null;
        //TODO This function must also take into account two variables:
        // If windows or not
        // if development mode or not

        if (this.electronService.isElectron) {
            const win = new this.electronService.remote.BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    webSecurity: false // Disable CORS checks
                }
            });

            const path = require('path');
            const distPath = '/home/matheus/development/archencil/dist/';
            const indexPath = path.join(distPath, 'index.html');
            // Add the encoded data as a query parameter to the URL, if it's not null or undefined
            const fileUrl = `file://${indexPath}#${componentName}${encodedData ? `?data=${encodedData}` : ''}`;

            win.loadURL(fileUrl);

            win.on('ready-to-show', () => {
                win.show();
            });
        } else {
            const url = APP_CONFIG.production ? 'http://localhost:4200' : 'http://localhost:4200';
            // Add the encoded data as a query parameter to the URL, if it's not null or undefined
            const componentUrl = `${url}/#${componentName}${encodedData ? `?data=${encodedData}` : ''}`;
            window.open(componentUrl, '_blank', windowFeatures);
        }
    }

    handleIpcNavigation(): void {
        if (this.electronService.isElectron && this.ipcRenderer) {
            this.ipcRenderer.on('navigate', (_event, componentName: string) => {
                this.router.navigate([componentName]);
            });
        }
    }
}
