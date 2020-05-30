
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import {  taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';

class ScheduleTaskTimerTemplate implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInput,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {

    const settingsId = await getGlobalSettingsId(db);
    if (!args.chatId) {
      logT.error("Missing Argument in remindToChatSchedule", Error);
      return;
    }

    const time = moment().add({ seconds: 30 });

    let dbTask: ScheduledTask;
    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      chatId: args.chatId,
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
        await scheduleTaskTimerTemplate.execute(dbTask, db);
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
export const scheduleTaskTimerTemplate = new ScheduleTaskTimerTemplate();