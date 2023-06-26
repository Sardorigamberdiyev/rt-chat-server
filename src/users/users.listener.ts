import { Server, Socket } from 'socket.io';
import { BaseListener } from '../common/base.listener';
import { IUsersListener } from './users.listener.interface';
import { ILogService } from '../log/log.service.interface';
import { IUsersRepository } from './users.repository.interface';

export class UsersListener extends BaseListener implements IUsersListener {

    constructor(
        socket: Socket, 
        io: Server, 
        log: ILogService,
        private readonly usersRepository: IUsersRepository
    ) {
        super(socket, io, log)
    }

    public async userState(state: boolean) {
        await this.usersRepository.updateIsOnline(this.userId, state);
    }

    public registerListeners(): void {
        this.attachListeners([
            {
                ev: 'users:state',
                listener: this.userState
            }
        ])
    }
}