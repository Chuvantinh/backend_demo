
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import { taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { toMomentDuration } from '../services/DateTimeHelper';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'chatId'>

class BotWelcomeMessage implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
  ): Promise<ITaskOptions> {

    if (!args.chatId) {
      logT.error("Missing Argument in createBotWelcomeMessage", Error);
      return;
    }

    // aggregate data
    const botSettingsId = await db
      .globalSettings({ id: await getGlobalSettingsId(db) })
      .botSettings()
      .id();

    const delay = await db
      .botSettings({ id: botSettingsId })
      .botFirstGreetingTextDelay();
    const time = moment().add(toMomentDuration(delay));


    // create db entry
    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      chatId: args.chatId,
      scheduledFor: time.toDate()
    };
    const task = await db.createScheduledTask(st);

    logT.info(`Scheduling BOT_WELCOME_MESSAGE in ${logFormat(delay)}`);

    return this.schedule(task, db);
  }

  public async schedule(dbTask: ScheduledTask, db: Prisma): Promise<ITaskOptions> {
    const t: ITaskOptions = {
      id: dbTask.id,
      removeOnCompleted: true,
      totalRuns: 1,
      startDate: moment(dbTask.scheduledFor).toDate(),
      async callback(task, done) {
        await botWelcomeMessage.execute(dbTask, db);
        done();
      }
    };
    return t;
  }

  public async condition(): Promise<boolean> {
    return true;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    const botId = await db
      .chat({ id: task.chatId })
      .bot()
      .id();
    const botSettingsId = await db
      .globalSettings({ id: await getGlobalSettingsId(db) })
      .botSettings()
      .id();
    const chatText = await db
      .botSettings({ id: botSettingsId })
      .botFirstGreetingText();

    await taskScheduler.sendScheduledBotMessage(
      {
        botId,
        chatId: task.chatId as string,
        msgText: chatText,
        taskId: task.id
      },
      db
    );
  }
}
export const botWelcomeMessage = new BotWelcomeMessage();