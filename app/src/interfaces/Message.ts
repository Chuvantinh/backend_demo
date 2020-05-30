import { IUser} from "./User";

export interface IMessage {
    id: string;
    text: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    author: IUser;
}
