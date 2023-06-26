import { Request, Response, NextFunction } from 'express';

export interface IMessagesController {
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
}