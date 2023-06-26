import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ISocketIO } from './socket.io.interface';
import { MessagesListener } from '../messages/messages.listener';
import { ILogService } from '../log/log.service.interface';
import { BaseListener } from '../common/base.listener';
import { RoomsListener } from '../rooms/rooms.listener';
import { UsersListener } from '../users/users.listener';
import { Database } from '../database/database';
import { ConfigService } from '../config/config.service';
import { UsersRepository } from '../users/users.repository';
import { RoomsRepository } from '../rooms/rooms.repository';
import { IUsersRepository } from '../users/users.repository.interface';
import { IRoomsRepository } from '../rooms/rooms.repository.interface';
import { LogService } from '../log/log.service';
import { IMessagesRepository } from '../messages/messages.repository.interface';
import { MessagesRepository } from '../messages/messages.repository';

export class SocketIO implements ISocketIO {
    private io: Server;
    private readonly log: ILogService;
    private readonly usersRepository: IUsersRepository;
    private readonly roomsRepository: IRoomsRepository;
    private readonly messagesRepository: IMessagesRepository;

    constructor(httpServer: HTTPServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*'
            }
        });
        const configService = new ConfigService();
        const database = Database.getInstance(configService);
        this.log = new LogService();
        // Репозотории сущностей
        this.roomsRepository = new RoomsRepository(database);
        this.usersRepository = new UsersRepository(database);
        this.messagesRepository = new MessagesRepository(database);
    }

    private getListeners(socket: Socket): BaseListener[] {
        return [
            new MessagesListener(socket, this.io, this.log, this.messagesRepository),
            new RoomsListener(socket, this.io, this.log, this.roomsRepository, this.usersRepository),
            new UsersListener(socket, this.io, this.log, this.usersRepository)
        ]
    }

    private disconnect(socket: Socket) {
        const { userId } = socket.handshake.auth;
        return async () => {
            // При разрыве соеденение с пользователем, сделаем его офлайн 
            await this.usersRepository.updateIsOnline(userId, false);
            // Каждый раз когда пользователь отключается, 
            // получаем список пользователей из БД и отправляем всем подключенных socket
            const users = await this.usersRepository.find();
            this.io.emit('refresh:users', users);
            // Логируем сервера о подключении пользователя
            this.log.info(`Пользовтель ${userId} отключился`);
        }
    }

    private async connection(socket: Socket) {
        const { userId } = socket.handshake.auth;
        await this.usersRepository.updateIsOnline(userId, true);
        // Каждый раз когда пользователь подключается, 
        // получаем пользователей из БД и отправляем всем подключенных socket
        const users = await this.usersRepository.find();
        this.io.emit('refresh:users', users);
        // Логируем сервера о подключении пользователя
        this.log.info(`Пользователь ${userId} подключился`);
        // Получаем список listeners
        const listeners = this.getListeners(socket);
        // Регистрируем listeners
        for (const listener of listeners) {
            listener.registerListeners();
        }
        // Обработка при отключение
        socket.on('disconnect', this.disconnect(socket).bind(this));
    }

    public init() {
        this.io.on('connection', this.connection.bind(this));
    }
}