import { IWeeklyActivity } from './WeeklyActivity';

export class IActivity {
    id: string;
    illustration: number;
    description: string;
    activity_date: Date | string;
    duration: number;
    activity_done: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    week: IWeeklyActivity;
}
