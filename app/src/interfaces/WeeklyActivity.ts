import { IActivity } from './Activity';
import { IUser } from './User';

export class IWeeklyActivity {
    id: string;
    total_time: number;
    start: Date | string;
    end: Date | string;
    activities: IActivity[];
    user: IUser;
}
