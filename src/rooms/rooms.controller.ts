import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { IRoomsController } from './rooms.controller.interface';
import { ILogService } from '../log/log.service.interface';
import { IAddRoomDTO } from './dto/add-room.dto';
import { IRoomsService } from './rooms.service.interface';
import { HTTPError } from '../errors/http-error';

export class RoomsController extends BaseController implements IRoomsController {

    constructor(
        log: ILogService,
        private readonly roomsService: IRoomsService
    ) {
        super(log);
        this.attachControllers([
            {
                method: 'get',
                path: '/rooms/',
                description: 'Получить список rooms',
                controller: this.getRooms
            },
            {
                method: 'get',
                path: '/rooms/:id',
                description: 'Получить room по id',
                controller: this.getRoom
            },
            {
                method: 'post',
                path: '/rooms/',
                description: 'Добавить комнату',
                controller: this.addRoom
            }
        ])
    }

    public async getRoom(req: Request<{id: string}>, res: Response) {
        const room = await this.roomsService.getRoomsItem(+req.params.id);

        if (!room)
            throw new HTTPError('Не сущ. комната', 404);

        this.ok(res, room);
    }

    public async getRooms(req: Request, res: Response) {
        const rooms = await this.roomsService.getRoomsList();
        this.ok(res, rooms);
    }

    public async addRoom(req: Request<{}, any, IAddRoomDTO>, res: Response, next: NextFunction) {
        // Простое проверка на валидность наз. комнат
        if (req.body.roomName.length < 3)
            throw new HTTPError('Имя группы должен быть неменее 3 символов', 422);
        // Добавляем в базу данных комнату
        const room = await this.roomsService.createRoom(req.body);

        if (!room)
            return next(new HTTPError('Комната с таким название уже сущ.', 400));

        this.created(res, room);
    }
}