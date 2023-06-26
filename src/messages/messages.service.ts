import { IMessagesRepository } from './messages.repository.interface';
import { IMessagesService } from './messages.service.interface';

export class MessagesService implements IMessagesService {

    constructor(private readonly messagesRepository: IMessagesRepository) {}

    public async getMessagesListByRoomId(roomId: number) {
        return this.messagesRepository.findByRoomId(roomId);        
    }
}