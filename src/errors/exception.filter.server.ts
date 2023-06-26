import { Request, Response, NextFunction } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { ILogService } from '../log/log.service.interface';
import { HTTPError } from './http-error';

export class ExceptionFilterServer implements IExceptionFilter {
    constructor(private readonly log: ILogService) {}

    catch(error: Error | HTTPError, req: Request, res: Response, _: NextFunction) {
        const { message } = error;
        let statusCode = 500;
        let data = null;
        if (error instanceof HTTPError) {
            statusCode = error.code;
            data = error.data;
        }
        this.log.error(`[${statusCode}]: ${message}`);
        res.status(statusCode).json({
            message,
            data,
            code: statusCode,
        });
    }
}