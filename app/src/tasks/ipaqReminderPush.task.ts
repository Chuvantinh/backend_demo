
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import { taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { notification } from '../services/notification/NotificationService';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId'>

class IpaqReminderPush implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {

    if (!args.userId) {
      logT.error("Missing Argument in IpaqReminderPush", Error);
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
          logT.error("Can not remove non existing Task: IpaqReminderPush", error);
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
      `Scheduling PUSH_NOTIFY_IPAQ_REMINDER for ${scheduleTime.toISOString()}`
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
        ipaqReminderPush.execute(dbTask, db);
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
    // schedule followup => 2 x 23h later
    await taskScheduler.scheduleTask(
      { taskType: "PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP", ...task },
      db
    );
  }
}
export const ipaqReminderPush = new IpaqReminderPush();