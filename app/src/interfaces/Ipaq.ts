import { IUser } from "./User";
import { IReminder } from "./Reminder";

export interface IIpaq {
    id: string;
    question_1_day: number;
    question_1_hour: number;
    question_1_minute: number;
    question_2_day: number;
    question_2_hour: number;
    question_2_minute: number;
    question_3_day: number;
    question_3_hour: number;
    question_3_minute: number;
    question_4_hour: number;
    question_4_minute: number;
    score: number;
    sitting_score: number;
    createdAt: Date | string;
    expiryDate: Date | string;
    reminder: IReminder;
    user: IUser;
}
