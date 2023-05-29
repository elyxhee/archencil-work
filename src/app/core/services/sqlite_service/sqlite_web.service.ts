import { Injectable } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { Database } from 'sqlite3';
import { Tables } from '../../../../../server/tables';
import axiosInstance from './axiosConfig';

@Injectable({
    providedIn: 'root'
})
export class SqliteServiceWeb {
    private sqlite: any;
    private db: Database | null = null;
    private tables: Tables;

    // eslint-disable-next-line no-unused-vars
    constructor(private electronService: ElectronService) {
        if (this.electronService.isElectron) {
            this.sqlite = window.require('sqlite3').verbose();
        } else {
            // Use Express server for the web
            this.sqlite = null;
        }
    }

    getSqlite() {
        return this.sqlite;
    }

    async openDatabase(): Promise<void> {
        return null; // no needed for web
    }

    async closeDatabase(): Promise<void> {
        return null; // no needed for web
    }

    async initTables(): Promise<void> {
        return null; // no needed for web
    }

    debugParsedMessages(parsedMessages: string[]): void {
        parsedMessages.forEach((message, index) => {
            const [number, title, color, text] = message.split(/\[(.*?)\]/).filter((_, idx) => idx % 2 === 1);
            console.log(`Parsed message #${index + 1}:`);
            console.log(`  Number: ${number}`);
            console.log(`  Title: ${title}`);
            console.log(`  Color: ${color}`);
            console.log(`  Text: ${text}`);
        });
    }

    async insertHitsFromTextarea(parsedMessages: any[]): Promise<boolean> {
        try {
            console.log('Sending hitsData to server:', parsedMessages);
            const response = await axiosInstance.post<{ success: boolean }>('/api/insertHitsFromTextarea', {
                hits: parsedMessages
            });
            return response.data.success;
        } catch (error) {
            console.error('Error while inserting hits in web environment:', error);
            return false;
        }
    }

    async insertHitsFromHitsDisplay(parsedMessages: string[]): Promise<boolean> {
        try {
            const response = await axiosInstance.post<{ success: boolean }>('/api/insertHitsFromHitsList', {
                hits: parsedMessages
            });
            return response.data.success;
        } catch (err) {
            console.error('Error while inserting hits in web environment:', err);
            return false;
        }
    }

    async getHits(): Promise<any[]> {
        try {
            const response = await axiosInstance.get<{ hits: any[] }>('/api/getHits');
            return response.data.hits;
        } catch (err) {
            console.error('Error while fetching hits in web environment:', err);
            return [];
        }
    }

    async cleanHitsTable(): Promise<boolean> {
        try {
            const response = await axiosInstance.delete<{ success: boolean }>('/api/cleanHits');
            return response.data.success;
        } catch (err) {
            console.error('Error while cleaning hits in web environment:', err);
            return false;
        }
    }

    getData() {
        return null;
    }
}
