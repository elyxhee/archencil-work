import { Injectable } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { Database } from 'sqlite3';
import { Tables } from '../../../../../server/tables';
import * as path from 'path';
import { APP_CONFIG } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SqliteServiceElectron {
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
        if (this.sqlite) {
            return new Promise((resolve, reject) => {
                // Check if running in production mode
                const isProd = APP_CONFIG.production;

                // Get the 'userData' path from the main process
                const userDataPath = this.electronService.ipcRenderer.sendSync('get-user-data-path');

                // Ensure the userDataPath is a string
                if (typeof userDataPath !== 'string') {
                    reject(new Error('The userData path is not a string.'));
                    return;
                }

                // Set the database path depending on the mode
                const dbPath = isProd
                    ? path.join(userDataPath, 'database.db')
                    : path.join(__dirname, '../server/database.db');

                this.db = new this.sqlite.Database(dbPath, (err: Error | null) => {
                    if (err) {
                        console.log('Error opening the database:', dbPath);
                        reject(err);
                    } else {
                        console.log('Database opened successfully');
                        this.tables = new Tables(this.db);
                        resolve();
                    }
                });
            });
        }
    }

    async initTables(): Promise<void> {
        if (this.tables) {
            await this.tables.initTables();
        } else {
            throw new Error('Tables instance not initialized');
        }
    }

    async closeDatabase(): Promise<void> {
        if (this.db) {
            return new Promise((resolve, reject) => {
                this.db.close((err: Error | null) => {
                    if (err) {
                        console.log('Error closing the database:', err);
                        reject(err);
                    } else {
                        console.log('Database closed successfully');
                        resolve();
                    }
                });
            });
        }
    }

    async cleanHitsTable(): Promise<boolean> {
        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run('DELETE FROM hits', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async insertHitsFromTextarea(parsedMessages: any[]): Promise<boolean> {
        if (!this.db) return false;

        const insertHit = (hit: any): Promise<boolean> => {
            return new Promise((resolve, reject) => {
                const { type, number, title, color, text, tension, flag } = hit;

                // Set original to false if type is 'custom', otherwise set to true
                const isOriginal = type === 'custom' ? false : true;

                let query;
                if (type === 'custom') {
                    query = `
                        INSERT INTO hits (type, text, original)
                        VALUES (?, ?, ?);
                    `;
                } else {
                    query = `
                        INSERT INTO hits (type, original_index, number, title, color, text, tension, flag, original)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                    `;
                }

                const params =
                    type === 'custom'
                        ? [type, text, isOriginal]
                        : [type, hit.original_index, number, title, color, text, tension, flag || null, isOriginal];

                this.db.run(query, params, (err: Error | null) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            });
        };

        let success = true;
        let originalIndex = 0;
        for (const message of parsedMessages) {
            if (message.type !== 'custom') {
                message.original_index = originalIndex;
                originalIndex++;
            } else {
                message.original_index = null;
            }

            try {
                await insertHit(message);
            } catch (err) {
                console.error('Error while inserting hit:', err);
                success = false;
                // You can break here if you don't want to continue inserting the remaining hits
                // break;
            }
        }

        return success;
    }

    async insertHitsFromHitsDisplay(parsedMessages: any[]): Promise<boolean> {
        try {
            if (!this.db) return false;

            const query = `
                INSERT INTO hits (type, original_index, number, title, color, text, tension, flag, icon, original, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
            `;

            const insertHit = (hit) => {
                return new Promise((resolve, reject) => {
                    const { type, original_index, number, title, color, text, tension, flag, icon, original } = hit;
                    this.db.run(
                        query,
                        [type, original_index, number, title, color, text, tension, flag, icon, original],
                        (err: Error | null) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(true);
                            }
                        }
                    );
                });
            };

            let success = true;
            for (const hit of parsedMessages) {
                try {
                    await insertHit(hit);
                } catch (err) {
                    console.error('Error while inserting hit:', err);
                    success = false;
                    break;
                }
            }

            return success;
        } catch (err) {
            console.error('Error while inserting hits in Electron environment:', err);
            return false;
        }
    }

    async getHits(): Promise<any[]> {
        if (!this.db) return [];

        const query = `
            SELECT type, original_index, number, title, color, text, tension, flag, icon, original
            FROM hits;
        `;

        return new Promise((resolve, reject) => {
            this.db.all(query, [], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}
