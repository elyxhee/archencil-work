import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services';
import { SqliteServiceElectron } from '../services/sqlite_service/sqlite_electron.service';
import { SqliteServiceWeb } from '../services/sqlite_service/sqlite_web.service';

@Injectable({
    providedIn: 'root'
})
export class SqliteService {
    private serviceInstance: SqliteServiceElectron | SqliteServiceWeb;

    // eslint-disable-next-line no-unused-vars
    constructor(private electronService: ElectronService) {
        if (this.electronService.isElectron) {
            this.serviceInstance = new SqliteServiceElectron(electronService);
        } else {
            this.serviceInstance = new SqliteServiceWeb(electronService);
        }
    }

    getSqlite() {
        return this.serviceInstance.getSqlite();
    }

    async openDatabase(): Promise<void> {
        return await this.serviceInstance.openDatabase();
    }

    async initTables(): Promise<void> {
        return await this.serviceInstance.initTables();
    }

    async closeDatabase(): Promise<void> {
        return await this.serviceInstance.closeDatabase();
    }

    async cleanHits(): Promise<Boolean> {
        return await this.serviceInstance.cleanHitsTable();
    }

    async insertHitsFromTextarea(parsedMessages: string[]): Promise<boolean> {
        return await this.serviceInstance.insertHitsFromTextarea(parsedMessages);
    }

    async insertHitsFromHitsDisplay(parsedMessages: any[]): Promise<boolean> {
        return await this.serviceInstance.insertHitsFromHitsDisplay(parsedMessages);
    }

    async getHits(): Promise<any[]> {
        return await this.serviceInstance.getHits();
    }
}
