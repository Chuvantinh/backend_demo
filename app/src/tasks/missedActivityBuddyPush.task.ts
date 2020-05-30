
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
class MissedActivityBuddyPush implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {
    if (!args.userId) {
      logT.error("Missing Argument in scheduleNotifyMissedActivity", Error);
      return;
    }

    let taskId;
    let [dbTask] = await db.scheduledTasks({
      where: {
        taskType: args.taskType,
        userId: args.userId
      }
    });
    if (dbTask) {
      if (timer.get(dbTask.id)) {
        timer.remove(dbTask.id);
      }
      taskId = dbTask.id;
    }

    const settingsId = await getGlobalSettingsId(db);
    const pushSettingsId = await db
      .globalSettings({ id: settingsId })
      .webPushSettings()
      .id();

    const time = await db
      .webPushSettings({ id: pushSettingsId })
      .webPushActivityMissedBuddyDelay();
    // TODO get delay from DB

    // every day on specific time (23:50)
    let scheduleTime = moment()
      .startOf("day")
      .add({
        hours: time.hours,
        minutes: time.minutes
      });
    const now = moment();
    if (now > scheduleTime) {
      scheduleTime.add(1, "day");
    }

    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      userId: args.userId,
      scheduledFor: scheduleTime.toDate()
    };
    if (!dbTask) {
      dbTask = await db.createScheduledTask(st);
    } else {
      await db.updateScheduledTask({
        where: { id: dbTask.id },
        data: st
      });
    }

    logT.info(
      `Scheduling PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY for ${scheduleTime.toISOString()}`
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
        const condition = missedActivityBuddyPush.condition(dbTask, db);
        if (condition) {
          missedActivityBuddyPush.execute(dbTask, db);
        }
        // recursively schedule for next day at (23:50)
        taskScheduler.scheduleTask(dbTask, db);
        done();
      }
    };
    return t;
  }

  public async condition(task: ScheduledTask, db: Prisma): Promise<boolean> {
    const start = moment()
      .startOf("day")
      .toDate();
    const end = moment()
      .startOf("day")
      .set({ hours: 23, minutes: 50 })
      .toDate();
    const ce = await db
      .user({ id: task.userId })
      .patient()
      .calendarEntries({
        where: {
          AND: [
            { startTime_gte: start },
            { startTime_lte: end },
            { isDone: false }
          ]
        }
      });
    return (ce && ce.length > 0);
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    const buddy = db
      .user({ id: task.userId })
      .patient()
      .buddy()
      .patient()
      .user();
    notification.sendPushNotification({
      type: task.taskType,
      receiver: buddy,
      sender: "SYSTEM"
    });
  }
}
export const missedActivityBuddyPush = new MissedActivityBuddyPush();