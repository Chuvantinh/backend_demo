
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
  'taskType' | 'userId'
>

class AutoMatch implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
  ): Promise<ITaskOptions> {
    if (!args.userId) {
      logT.error("Missing Argument in SYSTEM_AUTO_MATCH", Error);
      return;
    }

    const settingsId = await getGlobalSettingsId(db);
    const matchingTimeout = await db
      .globalSettings({ id: settingsId })
      .matchingTimeout();

    // !! Has to be larger than matching timeout !!
    let scheduleTime = moment().add(toMomentDuration(matchingTimeout)).add(5, 'seconds');

    // TESTING
    // let scheduleTime = moment().add(20,'seconds');
    
    let [dbTask] = await db.scheduledTasks({
      where: {
        taskType: args.taskType,
        userId: args.userId
      }
    })

    if (!dbTask) {
      const st: ScheduledTaskCreateInput = {
        taskType: args.taskType,
        scheduledFor: scheduleTime.toDate(),
        userId: args.userId,
      };
      dbTask = await db.createScheduledTask(st);
    }

    logT.info(
      `Scheduling SYSTEM_AUTO_MATCH for ${scheduleTime.toISOString()}`
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
        const shouldExecute = await autoMatch.condition(dbTask, db)
        if (shouldExecute) {
          await autoMatch.execute(dbTask, db);
        }
        done();
      }
    };
    return t;
  }

  public async condition(dbTask: ScheduledTask, db: Prisma): Promise<boolean> {
    const pid = await db.user({ id: dbTask.userId }).patient().id();
    const existingBuddy = await db.patient({ id: pid }).buddy();
    if (existingBuddy) {
      return false;
    }
    return true;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    logT.info(`Executing SYSTEM_AUTO_MATCH callback`);

    const [settings] = await db.globalSettingses();
    const matcher = new MatchingHelper(settings);
    await matcher.instantMatch(task.userId, db);

    await db.deleteScheduledTask({ id: task.id });
  }
}
export const autoMatch = new AutoMatch();