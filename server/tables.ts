import { Database } from 'sqlite3';

export class Tables {
    // eslint-disable-next-line no-unused-vars
    constructor(private db: Database) {}

    async initTables(): Promise<void> {
        // Call methods to create/check required tables
        await this.createTable1();
        // Add more tables as needed
    }

    private createTable1(): Promise<void> {
        return new Promise((resolve, reject) => {
            const query = `
            `;

            this.db.run(query, (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
