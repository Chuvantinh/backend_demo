
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import {  taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';


type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId'>

class BuddyRequestReminderPush implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {

    const settingsId = await getGlobalSettingsId(db);
    if (!args.userId) {
      logT.error("Missing Argument in BuddyRequestReminderPush", Error);
      return;
    }

    const time = moment().add({ seconds: 30 });

    let dbTask: ScheduledTask;
    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      userId: args.userId,
      scheduledFor: time.toDate()
    };

    dbTask = await db.createScheduledTask(st);

    return this.schedule(dbTask, db);
  }

  public async schedule(dbTask: ScheduledTask, db: Prisma): Promise<ITaskOptions> {
    const t: ITaskOptions = {
      id: dbTask.id,
      removeOnCompleted: true,
      totalRuns: 1,
      startDate: moment(dbTask.scheduledFor).toDate(),
      async callback(task, done) {
        await buddyRequestReminderPush.execute(dbTask, db);
        done();
      }
    };
    return t;
  }

  public async condition(): Promise<boolean> {
    return true;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
   
  }
}
export const buddyRequestReminderPush = new BuddyRequestReminderPush();