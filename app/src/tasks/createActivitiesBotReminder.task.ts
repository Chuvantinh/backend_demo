
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import { taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { toMomentDuration } from '../services/DateTimeHelper';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'userId' | 'chatId'>
class CreateActivitiesBotReminder implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
  ): Promise<ITaskOptions> {

    if (!args.chatId) {
      logT.error(
        "Missing Argument in createActivitiesIntroductionScheduled",
        Error
      );
      return;
    }
    const settingsId = await getGlobalSettingsId(db);
    const botSettingsId = await db
      .globalSettings({ id: settingsId })
      .botSettings()
      .id();

    const delay = await db
      .botSettings({ id: botSettingsId })
      .botAskCreateActivitiesTime();
    const time = moment().add(toMomentDuration(delay));
    // const time = moment().add({ seconds: 10 });

    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      chatId: args.chatId,
      scheduledFor: time.toDate(),
    };
    const dbTask = await db.createScheduledTask(st);

    logT.info(
      `Scheduling BOT_INTRODUCTION_CREATE_ACTIVITIES message in ${logFormat(
        delay
      )}`
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
        const condition = await createActivitiesBotReminder.condition(
          dbTask,
          db
        );
        logT.info(`activitiesIntroductionCondition is ${condition}`);
        if (condition) {
          await createActivitiesBotReminder.execute(
            dbTask,
            db
          );
        }
        done();
      }
    };
    return t;
  }

  public async condition(task: ScheduledTask, db: Prisma): Promise<boolean> {
    const allChatMessages = await db.chatMessages({
      where: {
        AND: [
          { chat: { id: task.chatId } },
          { author: { id_not: null } } // not a bot message
        ]
      }
    });
    logT.info(
      `activitiesIntroductionCondition -- Found ${allChatMessages.length} Chat messages`
    );

    // users have chatted => abort task
    if (allChatMessages.length > 0) {
      await db.deleteScheduledTask({ id: task.id });
      return false;
    }
    return true;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    logT.info(`Executing BOT_INTRODUCTION_CREATE_ACTIVITIES callback`);
    const settingsId = await getGlobalSettingsId(db);
    const botSettingsId = await db
      .globalSettings({ id: settingsId })
      .botSettings()
      .id();
    const chatText = await db
      .botSettings({ id: botSettingsId })
      .botAskCreateActivitiesMessage();
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
export const createActivitiesBotReminder = new CreateActivitiesBotReminder();