import { Request, Response, NextFunction } from 'express';

export interface IRoomsController {
    getRooms(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRoom(req: Request, res: Response, next: NextFunction): Promise<void>;
    addRoom(req: Request, res: Response, next: NextFunction): Promise<void>;
}