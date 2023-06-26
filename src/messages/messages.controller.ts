import { Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IMessagesController } from './messages.controller.interface';
import { IMessagesService } from './messages.service.interface';
import { IGetMessagesDTO } from './dto/get-messages.dto';
import { ILogService } from '../log/log.service.interface';


export class MessagesController extends BaseController implements IMessagesController {
    constructor(
        log: ILogService,
        private readonly messagesService: IMessagesService
    ) {
        super(log);
        this.attachControllers([
            {
                method: 'get',
                path: '/messages/',
                description: 'Получить все сообщение комната',
                controller: this.getMessages
            }
        ])
    }

    public async getMessages(req: Request<{}, any, {}, IGetMessagesDTO & qs.ParsedQs>, res: Response) {
        const messages = await this.messagesService.getMessagesListByRoomId(+req.query.roomId);
        this.ok(res, messages);
    }
}