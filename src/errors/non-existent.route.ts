import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../common/middleware.interface';
import { ILogService } from '../log/log.service.interface';

export class NonExistentRoute implements IMiddleware {
    constructor(private readonly log: ILogService) {}

    async execute(req: Request, res: Response, next: NextFunction) {
        const message = 'Не сущ. маршрут';
        const code = 404;
        this.log.error(`[NOT-FOUND-ROUTE]: ${message}`);
        res.status(code).json({ code, message });
    }
}