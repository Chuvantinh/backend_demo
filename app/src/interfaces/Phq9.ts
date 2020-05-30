import { IUser } from './User';
import { IReminder } from './Reminder';

export interface IPhq9 {
    id: string;
    question_1: number;
    question_2: number;
    question_3: number;
    question_4: number;
    question_5: number;
    question_6: number;
    question_7: number;
    question_8: number;
    question_9: number;
    score: number;
    createdAt: Date | string;
    expiryDate: Date | string;
    reminder: IReminder;
    user: IUser;
}
