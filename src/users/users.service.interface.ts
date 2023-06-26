import { IAddUserDTO } from './dto/add-user.dto';
import { IConnectUserDTO } from './dto/connect-user.dto';
import { IUsersModel } from './users.model';

export interface IUsersService {
    createUser(addUserDto: IAddUserDTO): Promise<IUsersModel | null>;
    getUserList(): Promise<IUsersModel[]>;
    getUserItem(id: number): Promise<IUsersModel | null>;
    connectUser(connectUserDTO: IConnectUserDTO): Promise<IUsersModel>;
}