import { Router, Request, Response, NextFunction } from 'express';
import { IRoute } from './route.interface';
import { ILogService } from '../log/log.service.interface';

export abstract class BaseController {
    private _router: Router;

    constructor(protected readonly log: ILogService) {
        this._router = Router();
    }

    public get router(): Router {
        return this._router;
    }

    protected ok(res: Response, data: unknown) {
        this.send(res, 200, data);
    }

    protected created(res: Response, data: unknown) {
        this.send(res, 201, data);
    }

    protected send(res: Response, status: number, data: unknown) {
        res.status(status).json(data);
    }

    protected attachControllers(routes: IRoute[]) {
        for (const route of routes) {
            const { method, path, description, middlewares, controller } = route;
            const middlewaresExecute = middlewares?.map((m) => m.execute.bind(m)) || [];
            // Логируем роутов
            this.log.info(`[${method.toUpperCase()}]: ${path} (${description || ''} | ПО: ${middlewaresExecute.length})`);
            this._router[method](path, middlewaresExecute, this.catchHandler(controller.bind(this)));
        }
    }

    private catchHandler(controller: IRoute['controller']) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try  {
                await controller(req, res, next);   
            } catch (e) {
                next(e);
            }
        }
    }
}