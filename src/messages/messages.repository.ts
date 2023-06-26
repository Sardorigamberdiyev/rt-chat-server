import { IDatabase } from '../database/database.interface';
import { IMessagesModel } from './messages.model';
import { IMessagesRepository } from './messages.repository.interface';

export class MessagesRepository implements IMessagesRepository {
    constructor(private readonly db: IDatabase) {}

    public async findByRoomId(roomId: number) {
        const queryText = `
        SELECT messages.id, messages.msg, messages.create_at, messages.room_id, messages.user_id, users.username
        FROM messages
        INNER JOIN users ON users.id=messages.user_id
        WHERE room_id=$1
        ORDER BY messages.create_at ASC`;
        const result = await this.db.query<IMessagesModel>(queryText, [roomId]);
        return result.rows;
    }

    public async create(msg: string, userId: number, roomId: number) {
        const queryText = `
        INSERT INTO messages(msg, user_id, room_id)
        VALUES ($1, $2, $3)
        RETURNING *`;
        const result = await this.db.query<IMessagesModel>(queryText, [msg, userId, roomId]);
        return result.rows[0];
    }
}