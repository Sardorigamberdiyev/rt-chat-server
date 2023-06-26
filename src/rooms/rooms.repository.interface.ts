import { IAddRoomDTO } from './dto/add-room.dto';
import { IRoomsModel } from './rooms.model';

export interface IRoomsRepository {
    find(): Promise<IRoomsModel[]>;
    findById(id: number): Promise<IRoomsModel | null>;
    findByName(name: string): Promise<IRoomsModel | null>;
    create(addRoomDto: IAddRoomDTO): Promise<IRoomsModel | null>;
}