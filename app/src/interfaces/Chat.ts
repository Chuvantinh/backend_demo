import { IUser } from './User';

export interface IChat {
    id: string;
    users: IUser[];
}
