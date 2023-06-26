import { HTTPError } from '../errors/http-error';
import { IRoomsRepository } from '../rooms/rooms.repository.interface';
import { IAddUserDTO } from './dto/add-user.dto';
import { IConnectUserDTO } from './dto/connect-user.dto';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';


export class UsersService implements IUsersService {
    constructor(
        private readonly usersRepository: IUsersRepository,
        private readonly roomsRepository: IRoomsRepository
    ) {}

    public async getUserList() {
        return this.usersRepository.find();
    }

    public async getUserItem(id: number) {
        return this.usersRepository.findById(id);
    }

    public async createUser({ username }: IAddUserDTO) {
        const candidate = await this.usersRepository.findByUsername(username);

        if (candidate)
            return null;

        return this.usersRepository.create(username, false);
    }


    public async connectUser({ username }: IConnectUserDTO) {
        let user = await this.usersRepository.findByUsername(username);
        // Если не сущ. пользователь то добавляем на БД
        if (!user)
            user = await this.usersRepository.create(username, false);
        // Проверка на онлайн пользователя
        if (user.is_online)
            throw new HTTPError('Пользователь с таким именем на онлайне', 400);
        
        return user;
    }
}