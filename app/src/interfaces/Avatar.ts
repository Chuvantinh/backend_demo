import { IUser } from "./User";

export interface IAvatar {
    id: string;
    picture: number;
    user: IUser;
}
