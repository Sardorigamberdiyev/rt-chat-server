import { App } from './app';
import { ConfigService } from './config/config.service';
import { Database } from './database/database';
import { ExceptionFilterServer } from './errors/exception.filter.server';
import { NonExistentRoute } from './errors/non-existent.route';
import { LogService } from './log/log.service';
import { MessagesController } from './messages/messages.controller';
import { MessagesRepository } from './messages/messages.repository';
import { MessagesService } from './messages/messages.service';
import { RoomsController } from './rooms/rooms.controller';
import { RoomsRepository } from './rooms/rooms.repository';
import { RoomsService } from './rooms/rooms.service';
import { UsersController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';

function start() {
    const logService = new LogService();
    const configService = new ConfigService();
    // База данных
    const database = Database.getInstance(configService);
    // Обработчики ошибок
    const nonExistentRoute = new NonExistentRoute(logService);
    const exceptionFilterServer = new ExceptionFilterServer(logService);
    const exceptionFilters = [exceptionFilterServer];
    // Сущность rooms
    const roomsRepository = new RoomsRepository(database);
    const roomsService = new RoomsService(roomsRepository);
    const roomsController = new RoomsController(logService, roomsService);
    // Сущность users
    const usersRepository = new UsersRepository(database);
    const usersService = new UsersService(usersRepository, roomsRepository);
    const usersController = new UsersController(logService, usersService);
    // Сущность messages
    const messagesRepository = new MessagesRepository(database);
    const messagesService = new MessagesService(messagesRepository);
    const messagesController = new MessagesController(logService, messagesService);
    // Контроллеры
    const controllers = [roomsController, usersController, messagesController];
    // Корневой приложение внедрение зависимости (DI)
    const app = new App(
        configService, 
        logService, 
        nonExistentRoute, 
        exceptionFilters, 
        controllers
    );
    // Инициализация приложение
    app.init();
}

start();