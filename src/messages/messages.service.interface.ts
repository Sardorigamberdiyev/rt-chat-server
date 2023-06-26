import { IMessagesModel } from './messages.model';

export interface IMessagesService {
    getMessagesListByRoomId(roomId: number): Promise<IMessagesModel[]>
}