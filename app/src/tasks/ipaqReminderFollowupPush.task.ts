
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

class IpaqReminderFollowupPush implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {

    if (!args.userId) {
      logT.error(
        "Missing Argument in scheduleNotifyIpaqReminderFollowup",
        Error
      );
      return;
    }

    const oldTasks = await db.scheduledTasks({
      where: { taskType: args.taskType, userId: args.userId }
    });
    for (const t of oldTasks) {
      if (timer.get(t.id)) {
        timer.remove(t.id);
      }
    }
    // cancel reminder / scheduler after 2 runs
    if (oldTasks.length >= 2) {
      await db.deleteManyScheduledTasks({ id_in: oldTasks.map(t => t.id) });
      return undefined;
    }

    let scheduleTime = moment().add(23, "hours");

    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      userId: args.userId,
      scheduledFor: scheduleTime.toDate()
    };
    const dbTask = await db.createScheduledTask(st);


    logT.info(
      `Scheduling PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP for ${scheduleTime.toISOString()}`
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
        ipaqReminderFollowupPush.execute(dbTask, db);
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
    // schedule next reminder in 23h
    taskScheduler.scheduleTask(task, db);
  }
}
export const ipaqReminderFollowupPush = new IpaqReminderFollowupPush();