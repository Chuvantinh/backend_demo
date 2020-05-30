import { IUser } from './User';

export interface IPotentialBuddy {
    id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    potential_buddy: IUser;
    user: IUser
}
