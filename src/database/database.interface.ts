import type { QueryResult } from 'pg';

export interface IDatabase {
    query<T extends object>(queryText: string, values?: unknown[]): Promise<QueryResult<T>>;
}