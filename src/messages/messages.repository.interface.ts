import { IMessagesModel } from './messages.model';

export interface IMessagesRepository {
    create(msg: string, userId: number, roomId: number): Promise<IMessagesModel>;
    findByRoomId(roomId: number): Promise<IMessagesModel[]>;
}