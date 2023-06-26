import { Request, Response, NextFunction, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IRoute {
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
    path: string;
    description?: string;
    middlewares?: IMiddleware[];
    controller(req: Request, res: Response, next: NextFunction): Promise<void>;
}