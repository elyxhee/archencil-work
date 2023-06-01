import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputConfigStartupService } from '~components/canvas/services/input-config-startup.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    title = 'archencil';
    state: any = null;

    constructor(
        private electronService: ElectronService,
        // eslint-disable-next-line no-unused-vars
        private translate: TranslateService,
        // eslint-disable-next-line no-unused-vars
        private route: ActivatedRoute,
        // eslint-disable-next-line no-unused-vars
        private router: Router,
        // eslint-disable-next-line no-unused-vars
        private inputConfigStartupService: InputConfigStartupService
    ) {
        this.translate.setDefaultLang('pt-BR');
        //this.translate.use('pt-BR');

        if (electronService.isElectron) {
            console.log(process.env);
            console.log('Run in electron');
            console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
            console.log('NodeJS childProcess', this.electronService.childProcess);
        } else {
            console.log('Run in browser');
        }
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit');
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit() {}

    // Disable default context menu globally
    @HostListener('document:contextmenu', ['$event'])
    onDocumentRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnDestroy() {}
}
