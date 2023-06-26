import { IUsersModel } from './users.model';

export interface IUsersRepository {
    find(): Promise<IUsersModel[]>;
    findById(userId: number): Promise<IUsersModel | null>;
    findByUsername(username: string): Promise<IUsersModel | null>;
    create(username: string, isOnline: boolean): Promise<IUsersModel>;
    updateIsOnline(userId: number, isOnline: boolean): Promise<IUsersModel | null>;
}