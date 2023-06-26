import { Request, Response, NextFunction } from 'express';

export interface IUsersController {
    getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    addUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    connectUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}