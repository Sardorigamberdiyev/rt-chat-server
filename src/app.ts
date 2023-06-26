import express, { Express } from 'express';
import { json } from 'body-parser';
import cors from 'cors';

import { createServer, Server as HTTPServer } from 'http';
import { IConfigService } from './config/config.service.interface';
import { ILogService } from './log/log.service.interface';
import { ISocketIO } from './socket/socket.io.interface';
import { SocketIO } from './socket/socket.io';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IMiddleware } from './common/middleware.interface';
import { BaseController } from './common/base.controller';

export class App {
    private app: Express;
    private httpServer: HTTPServer;
    private socketIO: ISocketIO;

    constructor(
        private readonly cfg: IConfigService, 
        private readonly log: ILogService,
        private readonly nonExistentRoute: IMiddleware,
        private readonly exceptionFilters: IExceptionFilter[],
        private readonly controllers: BaseController[]
    ) {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.socketIO = new SocketIO(this.httpServer);
    }

    private useGlobalMiddlewares() {
        this.app.use(cors());
        this.app.use(json());
    }

    private useRoutes() {
        for (const controller of this.controllers) {
            this.app.use('/api/', controller.router);
        }
        this.app.use(this.nonExistentRoute.execute.bind(this.nonExistentRoute));
    }

    private useExceptionFilters() {
        for (const exceptionFilter of this.exceptionFilters) {
            this.app.use(exceptionFilter.catch.bind(exceptionFilter));
        }
    }

    private listenServer() {
        const PORT = this.cfg.get('PORT');
        this.httpServer.listen(PORT, () => (
            this.log.info(`Сервер запустился на ${PORT} порте`)
        ));
    }

    public init() {
        this.useGlobalMiddlewares();
        this.useRoutes();
        this.useExceptionFilters();
        this.listenServer();
        this.socketIO.init();
    }
}