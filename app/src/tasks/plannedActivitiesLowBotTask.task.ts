
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import { taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { getUsersActiveMinutesInWeek } from '../services/ActivitiesHelper';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId' | 'chatId'>

class PlannedActivitiesLowBot implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {
    if (!args.userId || !args.chatId) {
      logT.error("Missing Argument in plannedActivityLowSchedule", Error);
      return;
    }
    const settingsId = await getGlobalSettingsId(db);
    const botSettingsId = await db
      .globalSettings({ id: settingsId })
      .botSettings()
      .id();

    const weekday = await db
      .botSettings({ id: botSettingsId })
      .botActivityLessThanPlannedWeekday();
    // this week on specified day (default Thursday)
    let scheduleTime = moment()
      .startOf("week")
      .add(weekday, "days");
    // not specified but schedule message for 18:00h
    scheduleTime.set({ hour: 18, minute: 0 });
    // check if specified time and weekday has passed -> next week same day
    const now = moment();
    if (now > moment().startOf("week").add(weekday, "days")) {
      scheduleTime.add(1, "week");
    }

    const taskExists = await db.$exists.scheduledTask({
      taskType: args.taskType,
      userId: args.userId
    });
    if (taskExists) {
      await db.deleteManyScheduledTasks({ taskType: args.taskType, userId: args.userId });
    }

    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      userId: args.userId,
      chatId: args.chatId,
      scheduledFor: scheduleTime.toDate()
    };
    const dbTask = await db.createScheduledTask(st);


    logT.info(
      `Scheduling BOT_PLANNED_ACTIVITIES_LOW message for ${scheduleTime.toISOString()}`
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
        const condition = await plannedActivitiesLowBot.condition(
          dbTask,
          db
        );
        logT.info(`plannedActivityLowCondition is ${condition}`);
        if (condition) {
          await plannedActivitiesLowBot.execute(dbTask, db);
        }
        // recursively schedule new task for next week
        taskScheduler.scheduleTask(dbTask, db);
        done();
      }
    };
    return t;
  }

  public async condition(
    task: ScheduledTask,
    db: Prisma
  ): Promise<boolean> {
    const targetMinutes = await db
      .user({ id: task.userId })
      .patient()
      .activeMinutesPerWeek();

    const plannedMinutes = await getUsersActiveMinutesInWeek(
      task.userId,
      moment().toISOString(),
      db
    );

    return plannedMinutes < targetMinutes;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    logT.info(`Executing BOT_PLANNED_ACTIVITIES_LOW callback`);

    const settingsId = await getGlobalSettingsId(db);
    const botSettingsId = await db
      .globalSettings({ id: settingsId })
      .botSettings()
      .id();
    const chatText = await db
      .botSettings({ id: botSettingsId })
      .botActivityLessThanPlannedMessage();
    const botId = await db
      .chat({ id: task.chatId })
      .bot()
      .id();

    await taskScheduler.sendScheduledBotMessage(
      {
        botId,
        chatId: task.chatId,
        msgText: chatText,
        taskId: task.id
      },
      db
    );
  }
}
export const plannedActivitiesLowBot = new PlannedActivitiesLowBot();