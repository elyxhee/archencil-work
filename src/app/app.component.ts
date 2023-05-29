import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { SqliteService } from './core/services/sqlite.service';
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
        private sqliteService: SqliteService,
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

    async ngOnInit(): Promise<void> {
        // When running in web, the database is opened and initialized in the Express server from package.json
        if (this.electronService.isElectron) {
            try {
                await this.sqliteService.openDatabase();
                console.log('Database opened');
                await this.sqliteService.initTables();
                console.log('Tables checked and created');
            } catch (err) {
                console.error('Error while opening the database or initializing tables:', err);
                // Handle the error, e.g., show a message to the user or exit the application
            }
        }
    }

    // Disable default context menu globally
    @HostListener('document:contextmenu', ['$event'])
    onDocumentRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    async ngOnDestroy(): Promise<void> {
        if (this.electronService.isElectron) {
            try {
                console.log('ngOnDestroy');
                await this.sqliteService.closeDatabase();
            } catch (err) {
                console.error('Error while closing the database:', err);
                // Handle the error, e.g., show a message to the user or exit the application
            }
        }
    }
}
