import { Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IUsersController } from './users.controller.interface';
import { IAddUserDTO } from './dto/add-user.dto';
import { IUsersService } from './users.service.interface';
import { ILogService } from '../log/log.service.interface';
import { HTTPError } from '../errors/http-error';
import { IConnectUserDTO } from './dto/connect-user.dto';

export class UsersController extends BaseController implements IUsersController {
    constructor(
        log: ILogService, 
        private readonly usersService: IUsersService
    ) {
        super(log);
        this.attachControllers([
            {
                method: 'get',
                path: '/users/',
                description: 'Получить список пользователей',
                controller: this.getUsers
            },
            {
                method: 'get',
                path: '/users/:id',
                description: 'Получить пользователя по идентификатору',
                controller: this.getUser
            },
            {
                method: 'post',
                path: '/users/',
                description: 'Добавить пользователя',
                controller: this.addUser
            },
            {
                method: 'post',
                path: '/users/connect',
                description: 'Присоеденится к чату',
                controller: this.connectUser
            },
        ])
    }
    
    public async getUsers(req: Request, res: Response) {
        const users = await this.usersService.getUserList();
        this.ok(res, users);
    }

    public async getUser(req: Request<{id: string}>, res: Response) {
        const user = await this.usersService.getUserItem(+req.params.id);
        if (!user)
            throw new HTTPError('Такой пользователь не сущ.', 404);
        this.ok(res, user);
    }
    
    public async addUser(req: Request<{}, any, IAddUserDTO>, res: Response) {
        const user = await this.usersService.createUser(req.body);
        if (!user)
            throw new HTTPError('Пользовтель с таким именем уже сущ.', 400);
        this.created(res, user);
    }

    public async connectUser(req: Request<{}, any, IConnectUserDTO>, res: Response): Promise<void> {
        // Простое проверка на валидность наз. пользователя
        if (req.body.username.length < 3)
            throw new HTTPError('Введите коректное наз. пользователя (мин. 3 символа)');

        const user = await this.usersService.connectUser(req.body);
        this.ok(res, user);
    }
}