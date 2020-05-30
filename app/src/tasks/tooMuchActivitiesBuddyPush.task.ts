
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import { taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { getUsersActiveMinutesInWeek } from '../services/ActivitiesHelper';
import { notification } from '../services/notification/NotificationService';
import { toMomentDuration } from '../services/DateTimeHelper';
import { plannedActivityToHighCondition } from './sharedConditions';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId'>

class TooMuchActivitiesBuddy implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {
    if (!args.userId) {
      logT.error(
        "Missing Argument in pushNotifyToMuchActivitiesBuddySchedule",
        new Error()
      );
      return;
    }

    // retrieve previously scheduled Tasks
    const oldTasks = await db.scheduledTasks({
      where: {
        taskType: args.taskType,
        userId: args.userId
      }
    });

    const toHigh = await plannedActivityToHighCondition(
      { userId: args.userId as string },
      db
    );
    logT.info(`plannedActivityToHigh ${toHigh}`);
    if (!toHigh) {
      if (oldTasks.length > 0) {
        await db.deleteManyScheduledTasks({
          id_in: oldTasks.map(t => t.id)
        });
      }
      for (const t of oldTasks) {
        if (timer.get(t.id)) {
          timer.remove(t.id);
        }
      }
      return undefined;
    } else {
      // condition is true => schedule task for in 2 days
      let dbTask: ScheduledTask;
      logT.info(`oldTasks ${oldTasks.length}`);
      // if there is no previous task create one
      if (oldTasks.length === 0) {
        const st: ScheduledTaskCreateInput = {
          taskType: args.taskType,
          userId: args.userId
        };
        dbTask = await db.createScheduledTask(st);
      } else {
        // if there is a previous task leave it as it is
        // => notification will be send 2 days after user first set planned higher than target
        // let ot = oldTasks.pop();
        return undefined;
      }

      const settingsId = await getGlobalSettingsId(db);
      const pushSettingsId = await db
        .globalSettings({ id: settingsId })
        .webPushSettings()
        .id();

      const delay = await db
        .webPushSettings({ id: pushSettingsId })
        .webPushToManyActivitiesBuddyDelay();
      // this week on specified day (default Thursday)
      let scheduleTime = moment().add(toMomentDuration(delay));

      dbTask = await db.updateScheduledTask({
        where: { id: dbTask.id },
        data: { scheduledFor: scheduleTime.toDate() }
      });

      logT.info(
        `Scheduling PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY message for ${scheduleTime.toISOString()}`
      );

      return this.schedule(dbTask, db);
    }
  }

  public async schedule(dbTask: ScheduledTask, db: Prisma): Promise<ITaskOptions> {
    const t: ITaskOptions = {
      id: dbTask.id,
      removeOnCompleted: true,
      totalRuns: 1,
      startDate: moment(dbTask.scheduledFor).toDate(),
      async callback(task, done) {
        const condition = await tooMuchActivitiesBuddy.condition(dbTask, db);
        logT.info(`plannedActivityToHighCondition is ${condition}`);
        if (condition) {
          tooMuchActivitiesBuddy.execute(dbTask, db);
        }
        done();
      }
    };
    return t;
  }

  public async condition(task: Partial<ScheduledTask>,
    db: Prisma
  ): Promise<boolean> {
    return plannedActivityToHighCondition(task, db);
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    const buddy = db
      .user({ id: task.userId })
      .patient()
      .buddy()
      .patient()
      .user();

    notification.sendPushNotification({
      type: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
      receiver: buddy,
      sender: "SYSTEM"
    });
  }
}
export const tooMuchActivitiesBuddy = new TooMuchActivitiesBuddy();