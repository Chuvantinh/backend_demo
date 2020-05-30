
import { ScheduledTask, ScheduledTaskCreateInput, Prisma } from '../generated/prisma-client';
import {  taskScheduler } from './tasks';
import { ITaskOptions, TaskTimer } from 'tasktimer';
import { logT, logFormat } from '../logger';
import * as moment from "moment";
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { IScheduleTaskTimer } from './scheduleTaskTimer.interface';
import { toMomentDuration } from '../services/DateTimeHelper';

type ScheduledTaskCreateInputEx =
  Pick<ScheduledTaskCreateInput, 'taskType' | 'chatId'>
class RemindToChatTask implements IScheduleTaskTimer {

  public async setup(
    args: ScheduledTaskCreateInputEx,
    db: Prisma,
    timer: TaskTimer,
  ): Promise<ITaskOptions> {

    const settingsId = await getGlobalSettingsId(db);
    if (!args.chatId) {
      logT.error("Missing Argument in remindToChatSchedule", Error);
      return;
    }

    const botSettingsId = await db
      .globalSettings({ id: settingsId })
      .botSettings()
      .id();

    const delay = await db
      .botSettings({ id: botSettingsId })
      .botAskStartChatIntervall();
    const time = moment().add(toMomentDuration(delay));
    //const time = moment().add({ seconds: 30 });

    const [exitingTask] = await db.scheduledTasks({
      where: {
        chatId: args.chatId,
        taskType: "BOT_REMIND_TO_CHAT"
      }
    });
    let dbTask: ScheduledTask;
    const st: ScheduledTaskCreateInput = {
      taskType: args.taskType,
      chatId: args.chatId,
      scheduledFor: time.toDate()
    };

    if (!exitingTask) {
      dbTask = await db.createScheduledTask(st);
    } else {
      dbTask = await db.updateScheduledTask({
        where: { id: exitingTask.id },
        data: st
      });
    }

    logT.info(`Rescheduling BOT_REMIND_TO_CHAT message in ${logFormat(delay)}`);

    if (exitingTask && exitingTask.id && timer.get(exitingTask.id)) {
      timer.remove(exitingTask.id);
    }
    return this.schedule(dbTask, db);
  }

  public async schedule(dbTask: ScheduledTask, db: Prisma): Promise<ITaskOptions> {
    const t: ITaskOptions = {
      id: dbTask.id,
      removeOnCompleted: true,
      totalRuns: 1,
      startDate: moment(dbTask.scheduledFor).toDate(),
      async callback(task, done) {
        await remindToChatTask.execute(dbTask, db);
        done();
      }
    };
    return t;
  }

  public async condition(): Promise<boolean> {
    return true;
  }

  public async execute(task: ScheduledTask, db: Prisma): Promise<void> {
    logT.info(`Executing BOT_REMIND_TO_CHAT callback`);
    const settingsId = await getGlobalSettingsId(db);
    const botSettingsId = await db
      .globalSettings({ id: settingsId })
      .botSettings()
      .id();
    const chatText = await db
      .botSettings({ id: botSettingsId })
      .botAskStartChatMessage();
    const botId = await db
      .chat({ id: task.chatId })
      .bot()
      .id();

    await taskScheduler.sendScheduledBotMessage(
      {
        botId,
        chatId: task.chatId,
        msgText: chatText,
        taskId: task.id // don't delete Task - reused for next schedule
      },
      db
    );
  }
}
export const remindToChatTask = new RemindToChatTask();