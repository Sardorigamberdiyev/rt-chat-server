import { Server, Socket } from 'socket.io';
import { BaseListener } from '../common/base.listener';
import { IRommsListener } from './rooms.listener.interface';
import { ILogService } from '../log/log.service.interface';
import { IRoomsRepository } from './rooms.repository.interface';
import { IUsersRepository } from '../users/users.repository.interface';

export class RoomsListener extends BaseListener implements IRommsListener {

    constructor(
        socket: Socket, 
        io: Server, 
        log: ILogService,
        private readonly roomsRepository: IRoomsRepository,
        private readonly usersRepository: IUsersRepository
    ) {
        super(socket, io, log)
    }

    public async joinRoom(roomId: number) {
        this.socket.join(roomId.toString());
        const user = await this.usersRepository.findById(this.userId);
        // Оповешаем всех пользователей о подключении
        this.socket.broadcast.to(roomId.toString()).emit('rooms:user-joined', user);
        this.log.info(`Пользователь ${this.userId} присоеденился в группу ${roomId}`);
    }

    public async leaveRoom(roomId: number) {
        this.socket.leave(roomId.toString());
        const user = await this.usersRepository.findById(this.userId);
        // Оповешаем всех пользователей об отключение
        this.socket.broadcast.to(roomId.toString()).emit('rooms:user-left', user);
        this.log.info(`Пользователь ${this.userId} покинул группу ${roomId}`);
    }

    public registerListeners() {
        this.attachListeners([
            {
                ev: 'rooms:join',
                listener: this.joinRoom
            },
            {
                ev: 'rooms:leave',
                listener: this.leaveRoom
            }
        ])
    }
}