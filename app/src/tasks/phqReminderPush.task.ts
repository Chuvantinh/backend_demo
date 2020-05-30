
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import {  taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { notification } from '../services/notification/NotificationService';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId'>

class PhqReminderPush implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {

    if (!args.userId) {
      logT.error("Missing Argument in PhqReminderPush", Error);
      return;
    }

    const [oldTask] = await db.scheduledTasks({
      where: {
        taskType: args.taskType,
        userId: args.userId
      }
    });
    if (oldTask) {
      await db.deleteScheduledTask({ id: oldTask.id });
      if (timer.get(oldTask.id)) {
        try {
          timer.remove(oldTask.id);
        } catch (error) {
          logT.error("Can not remove non existing Task: PhqReminderPush", error);
        }
      }
    }

    // TODO use config values
    const scheduleTime = moment().add(2, "weeks");

    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      userId: args.userId,
      scheduledFor: scheduleTime.toDate()
    };
    const dbTask = await db.createScheduledTask(st);

    logT.info(
      `Scheduling PUSH_NOTIFY_PHQ_REMINDER for ${scheduleTime.toISOString()}`
    );

    return this.schedule(dbTask, db);
  }

  public async schedule(dbTask: ScheduledTask, db: Prisma): Promise<ITaskOptions> {
    const t: ITaskOptions = {
      id: dbTask.id,
      removeOnCompleted: true,
      totalRuns: 1,
      startDate: moment(dbTask.scheduledFor).toDate(),
      async callback(task, done) {
        phqReminderPush.execute(dbTask,db);
        done();
      }
    };
    return t;
  }

  public async condition(): Promise<boolean> {
    return true;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    const user = db.user({ id: task.userId });

    notification.sendPushNotification({
      type: task.taskType,
      receiver: user,
      sender: "SYSTEM"
    });
    await taskScheduler.scheduleTask(
      { taskType: "PUSH_NOTIFY_PHQ_REMINDER_FOLLOWUP", ...task },
      db
    );
  }
}
export const phqReminderPush = new PhqReminderPush();