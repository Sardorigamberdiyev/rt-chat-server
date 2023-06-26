import { IAddRoomDTO } from './dto/add-room.dto';
import { IRoomsModel } from './rooms.model';

export interface IRoomsService {
    getRoomsList(): Promise<IRoomsModel[]>;
    getRoomsItem(roomId: number): Promise<IRoomsModel | null>;
    createRoom(addRoomDto: IAddRoomDTO): Promise<IRoomsModel | null>;
}