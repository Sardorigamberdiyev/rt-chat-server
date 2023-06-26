import { Pool } from 'pg';
import { IDatabase } from './database.interface';
import { IConfigService } from '../config/config.service.interface';

export class Database implements IDatabase {
    static instance: Database | undefined;
    private pool: Pool;

    private constructor(cfg: IConfigService) {
        this.pool = new Pool({
            host: cfg.get('DB_HOST'),
            port: +cfg.get('DB_PORT'),
            user: cfg.get('DB_USERNAME'),
            password: cfg.get('DB_PASSWORD'),
            database: cfg.get('DB_NAME'),
        })
    }

    public async query(queryText: string, values: unknown[]) {
        return this.pool.query(queryText, values);
    }

    public static getInstance(cfg: IConfigService): Database {
        return this.instance || new Database(cfg);
    }
}