
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import { taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { notification } from '../services/notification/NotificationService';
import { notEnoughActivitiesPlannedCondition } from './sharedConditions';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId'>

class NotEnoughActivitiesBuddyPush implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
  ): Promise<ITaskOptions> {
    if (!args.userId) {
      logT.error(
        "Missing Argument in pushNotifyNotEnoughActivitiesBuddySchedule",
        Error
      );
      return;
    }

    const oldTasks = await db.scheduledTasks({
      where: {
        taskType: args.taskType,
        userId: args.userId
      }
    });
    if (oldTasks.length > 0) {
      await db.deleteManyScheduledTasks({ id_in: oldTasks.map(t => t.id) });
    }
    const settingsId = await getGlobalSettingsId(db);
    const pushSettingsId = await db
      .globalSettings({ id: settingsId })
      .webPushSettings()
      .id();

    const weekday = await db
      .webPushSettings({ id: pushSettingsId })
      .webPushNotEnoughActivitiesBuddyWeekday();
    // this week on specified day (default Thursday)
    let scheduleTime = moment()
      .startOf("week")
      .add(weekday, "days");
    // not specified but schedule message for 18:00h
    scheduleTime.set({ hour: 18, minute: 0 });
    // check if specified time and weekday has passed -> next week same day
    const now = moment();
    if (
      now >
      moment()
        .startOf("week")
        .add(weekday, "days")
    ) {
      scheduleTime.add(1, "week");
    }

    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      userId: args.userId,
      scheduledFor: scheduleTime.toDate()
    };
    const dbTask = await db.createScheduledTask(st);
    logT.info(
      `Scheduling PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY message for ${scheduleTime.toISOString()}`
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
        const condition = await notEnoughActivitiesBuddyPush.condition(
          dbTask,
          db
        );
        logT.info(`plannedActivityLowNextWeekCondition is ${condition}`);
        if (condition) {
          notEnoughActivitiesBuddyPush.execute(dbTask, db);
        }
        // recursively schedule new task for next week
        taskScheduler.scheduleTask(dbTask, db);
        done();
      }
    };
    return t;
  }

  public async condition(task: ScheduledTask, db: Prisma): Promise<boolean> {
    return notEnoughActivitiesPlannedCondition(task, db);
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    const buddy = db
      .user({ id: task.userId })
      .patient()
      .buddy()
      .patient()
      .user();
    notification.sendPushNotification({
      type: "PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY",
      receiver: buddy,
      sender: "SYSTEM"
    });
  }
}
export const notEnoughActivitiesBuddyPush = new NotEnoughActivitiesBuddyPush();