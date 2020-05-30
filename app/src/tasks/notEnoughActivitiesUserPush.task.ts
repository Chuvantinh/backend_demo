
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import { taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { getUsersActiveMinutesInWeek } from '../services/ActivitiesHelper';
import { notification } from '../services/notification/NotificationService';
import { notEnoughActivitiesPlannedCondition } from './sharedConditions';


type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId'>

class NotEnoughActivitiesUserPush implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
  ): Promise<ITaskOptions> {
    if (!args.userId) {
      logT.error("Missing Argument in pushNotifyNotEnoughActivitiesUserSchedule",Error);
      return;
    }

    let [dbTask] = await db.scheduledTasks({
      where: {
        taskType: args.taskType,
        userId: args.userId
      }
    });
    if (!dbTask) {
      const st: ScheduledTaskCreateInput = {
        taskType: args.taskType,
        userId: args.userId
      };
      dbTask = await db.createScheduledTask(st);
    }

    // const taskId = await db.createScheduledTask(st).id();
    const settingsId = await getGlobalSettingsId(db);
    const pushSettingsId = await db
      .globalSettings({ id: settingsId })
      .webPushSettings()
      .id();

    const weekday = await db
      .webPushSettings({ id: pushSettingsId })
      .webPushNotEnoughActivitiesWeekday();
    // this week on specified day (default Thursday)
    let scheduleTime = moment().startOf("week").add(weekday, "days");
    // not specified but schedule message for 18:00h
    scheduleTime.set({ hour: 18, minute: 0 });
    // check if specified time and weekday has passed -> next week same day
    const now = moment();
    if (now > moment().startOf("week").add(weekday, "days").set({ hour: 18, minute: 0 })) {
      scheduleTime.add(1, "week");
    }

    logT.info(
      `Scheduling PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER message for ${scheduleTime.toISOString()}`
    );

    // const buddy = await db.user({ id: args.userId }).patient().buddy().patient().user();

    dbTask = await db.updateScheduledTask({
      where: { id: dbTask.id },
      data: { scheduledFor: scheduleTime.toDate() }
    });

    return this.schedule(dbTask, db);
  }

  public async schedule(dbTask: ScheduledTask, db: Prisma): Promise<ITaskOptions> {
    const t: ITaskOptions = {
      id: dbTask.id,
      removeOnCompleted: true,
      totalRuns: 1,
      startDate: moment(dbTask.scheduledFor).toDate(),
      async callback(task, done) {
        const shouldExecute = await notEnoughActivitiesUserPush.condition(
          dbTask,
          db
        );
        logT.info(`pushNotifyNotEnoughActivitiesUserSchedule is ${shouldExecute}`);
        if (shouldExecute) {
          notEnoughActivitiesUserPush.execute(dbTask, db);
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
    const user = db.user({ id: task.userId });
    notification.sendPushNotification({
      type: "PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER",
      receiver: user,
      sender: "SYSTEM"
    });
  }
}
export const notEnoughActivitiesUserPush = new NotEnoughActivitiesUserPush();