import { IDatabase } from '../database/database.interface';
import { IAddRoomDTO } from './dto/add-room.dto';
import { IRoomsModel } from './rooms.model';
import { IRoomsRepository } from './rooms.repository.interface';

export class RoomsRepository implements IRoomsRepository {
    constructor(private readonly db: IDatabase) {}

    public async find() {
        const queryText = `SELECT * FROM rooms`;
        const result = await this.db.query<IRoomsModel>(queryText);
        return result.rows;
    }

    public async findById(id: number) {
        const queryText = `
        SELECT * 
        FROM rooms 
        WHERE id=${id}`;
        const result = await this.db.query<IRoomsModel>(queryText);
        return result.rows[0] || null;
    }

    public async findByName(name: string) {
        const queryText = `
        SELECT *
        FROM rooms
        WHERE room_name=$1`;
        const result = await this.db.query<IRoomsModel>(queryText, [name]);
        return result.rows[0] || null;
    }

    public async create(addRoomDto: IAddRoomDTO) {
        const queryText = `
        INSERT INTO rooms(room_name) 
        VALUES ($1) 
        RETURNING *`;
        const reslt = await this.db.query<IRoomsModel>(queryText, [addRoomDto.roomName]);
        return reslt.rows[0] || null;
    }
}