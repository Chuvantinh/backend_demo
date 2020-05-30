
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import * as moment from "moment";
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { notification } from '../services/notification/NotificationService';
import { toMomentDuration } from '../services/DateTimeHelper';
import { MatchingHelper } from '../services/MatchingHelper';

type ScheduledTaskCreateInputEx = Pick<
  ScheduledTaskCreateInput,
  'taskType' | 'buddyRequestId' | 'userId'
>

class BuddyRequestDestruction implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
  ): Promise<ITaskOptions> {
    if (!args.buddyRequestId || !args.userId) {
      logT.error("Missing Argument in scheduleBuddyRequestDestruction", Error);
      return;
    }

    const settingsId = await getGlobalSettingsId(db);
    const matchingTimeout = await db
      .globalSettings({ id: settingsId })
      .matchingTimeout();

    let scheduleTime = moment().add(toMomentDuration(matchingTimeout));

    // TESTING
    // let scheduleTime = moment().add(15, 'seconds');

    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      scheduledFor: scheduleTime.toDate(),
      buddyRequestId: args.buddyRequestId,
      userId: args.userId,
    };

    const dbTask = await db.createScheduledTask(st);

    logT.info(
      `Scheduling SYSTEM_SCHEDULE_REQUEST_DESTRUCTION for ${scheduleTime.toISOString()}`
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
        await buddyRequestDestruction.execute(dbTask, db);
        done();
      }
    };
    return t;
  }

  public async condition(): Promise<boolean> {
    return true;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    logT.info(`Executing SYSTEM_SCHEDULE_REQUEST_DESTRUCTION callback`);
    const req = await db.buddyRequest({ id: task.buddyRequestId });

    const reqState = req.state;
    // must be still in send mode
    if (reqState === "SEND") {
      await db.updateBuddyRequest({
        where: { id: task.buddyRequestId },
        data: { state: "REMOVED" }
      });

      // const userFrom = await db
      //   .buddyRequest({ id: task.buddyRequestId })
      //   .from()
      //   .user();
      // const userTo = await db
      //   .buddyRequest({ id: task.buddyRequestId })
      //   .to()
      //   .user();
      // notification.sendPushNotification({
      //   type: "PUSH_NOTIFY_BUDDY_REQUEST_DENIED",
      //   receiver: userFrom,
      //   sender: userTo
      // });
    }
    const taskExists = await db.$exists.scheduledTask({ id: task.id });
    if (taskExists) {
      await db.deleteScheduledTask({ id: task.id });
    }
  }
}
export const buddyRequestDestruction = new BuddyRequestDestruction();