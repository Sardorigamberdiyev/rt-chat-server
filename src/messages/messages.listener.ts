import { Server, Socket } from 'socket.io';
import { BaseListener } from '../common/base.listener';
import { IMessagesListener } from './messages.listener.interface';
import { ILogService } from '../log/log.service.interface';
import { IMessagesRepository } from './messages.repository.interface';

export class MessagesListener extends BaseListener implements IMessagesListener {
    constructor(
        socket: Socket,
        io: Server,
        log: ILogService,
        private readonly messagesRepository: IMessagesRepository
    ) {
        super(socket, io, log);
    }

    public async newMessage(msg: string, roomId: number, username: string) {
        // Добавляем новое сообщение на БД
        const message = await this.messagesRepository.create(msg, this.userId, roomId);
        // Отправляем новое сообщение всем пользователя которые находятся на том же комнате
        this.io.to(roomId.toString()).emit('message:get', { ...message, username });
    }

    public registerListeners() {
        this.attachListeners([
            {
                ev: 'message:new',
                description: 'Отправка сообщение',
                listener: this.newMessage
            },
        ]);
    }
}