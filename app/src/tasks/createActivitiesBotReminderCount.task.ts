import { taskScheduler } from './tasks';
import { ScheduledTask, Prisma, ScheduledTaskCreateInput } from '../generated/prisma-client';
import { logT } from '../logger';
import { getGlobalSettingsId } from '../global_settings/global.settings';


type ScheduledTaskCreateInputEx = Pick<
  ScheduledTaskCreateInput, 'chatId'
>

class CreateActivitiesBotReminderCount {

  public async execute(
    task: ScheduledTaskCreateInputEx,
    db: Prisma
  ): Promise<boolean> {
    const allChatMessages = await db.chatMessages({
      where: {
        AND: [
          { chat: { id: task.chatId } },
          { author: { id_not: null } } // not a bot message
        ]
      }
    });
    logT.info(
      `activitiesIntroductionCountCondition -- Found ${allChatMessages.length} Chat messages`
    );

    const users = await db.users({
      where: {
        patient: { buddy: { chat: { id: task.chatId } } }
      }
    });

    const activityCount = await db
      .calendarEntriesConnection({
        where: {
          patient: { user: { id_in: users.map(u => u.id) } }
        }
      })
      .aggregate()
      .count();
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

    // TODO chat message length & activity count as global settings var

    // users have more than X messages => execute task
    if (allChatMessages.length === 20 && activityCount <= 0) {
      // await db.deleteScheduledTask({ id: taskId })
      await taskScheduler.sendScheduledBotMessage(
        {
          botId,
          msgText: chatText,
          chatId: task.chatId as string,
          taskId: undefined
        },
        db
      );
      return false;
    }
    return true;
  }
}

export const createActivitiesBotReminderCount = new CreateActivitiesBotReminderCount()