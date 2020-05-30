import { IUser } from "./User";

export interface ISport {
    id: string;
    type: number;
    active: boolean;
    user: IUser;
}
