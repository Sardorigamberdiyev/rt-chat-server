import { IDatabase } from '../database/database.interface';
import { IUsersModel } from './users.model';
import { IUsersRepository } from './users.repository.interface';

export class UsersRepository implements IUsersRepository {

    constructor(private readonly db: IDatabase) {}

    public async find() {
        const queryText = `SELECT * FROM users`;
        const result = await this.db.query<IUsersModel>(queryText);
        return result.rows;
    }

    public async findById(userId: number) {
        const queryText = `
        SELECT *
        FROM users
        WHERE id=$1`;
        const result = await this.db.query<IUsersModel>(queryText, [userId]);
        return result.rows[0] || null;
    }

    public async findByUsername(username: string) {
        const queryText = `
        SELECT *
        FROM users
        WHERE username=$1`;
        const result = await this.db.query<IUsersModel>(queryText, [username.trim().toLowerCase()]);
        return result.rows[0] || null;
    }

    public async create(username: string, isOnline: boolean) {
        const queryText = `
        INSERT INTO users(username, is_online)
        VALUES ($1, $2)
        RETURNING *`;
        const result = await this.db.query<IUsersModel>(queryText, [username.trim().toLowerCase(), isOnline]);
        return result.rows[0];
    }

    public async updateIsOnline(userId: number, isOnline: boolean) {
        const queryText = `
        UPDATE users
        SET is_online=$1
        WHERE id=$2
        RETURNING *`;
        const result = await this.db.query<IUsersModel>(queryText, [isOnline, userId]);
        return result.rows[0] || null;
    }
}