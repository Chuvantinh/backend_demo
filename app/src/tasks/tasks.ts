import {
  Prisma,
  ScheduledTaskCreateInput,
  ScheduledTask
} from "../generated/prisma-client";
import { TaskTimer, Task, ITaskOptions } from "tasktimer";
import * as moment from "moment";
import { logT, logFormat } from "../logger";
import { emojis } from "../services/EmojiList";
import { TASK_TICK_INTERVAL_MS } from "../config/env.config";
import { Context } from "../types";
import {
  notification
} from "../services/notification/NotificationService";
import { getUsersActiveMinutesInWeek } from "../services/ActivitiesHelper";
import { remindToChatTask } from './remindToChat.task';
import { getGlobalSettingsId } from '../global_settings/global.settings';
import { createActivitiesBotReminder } from './createActivitiesBotReminder.task';
import { plannedActivitiesLowBot } from './plannedActivitiesLowBotTask.task';
import { notEnoughActivitiesUserPush } from './notEnoughActivitiesUserPush.task';
import { notEnoughActivitiesBuddyPush } from './notEnoughActivitiesBuddyPush.task';
import { tooMuchActivitiesBuddy } from './tooMuchActivitiesBuddyPush.task';
import { buddyRequestDestruction } from './buddyRequestDestruction.task';
import { ipaqReminderPush } from './ipaqReminderPush.task';
import { ipaqReminderFollowupPush } from './ipaqReminderFollowupPush.task';
import { phqReminderPush } from './phqReminderPush.task';
import { missedActivityBuddyPush } from './missedActivityBuddyPush.task';
import { phqReminderPushFollowup } from './phqReminderFollowupPush.task';
import { createActivitiesBotReminderCount } from './createActivitiesBotReminderCount.task'
import { botWelcomeMessage } from './botWelcomeMessage.task'
import { autoMatch } from './autoMatch.task';


export interface ChatNotificationArgs {
  sendingUserId: string;
  chatId: string;
  msgText: string;
}

export interface ScheduledBotMessageArgs {
  botId: string;
  chatId: string;
  msgText: string;
  taskId: string;
}

class TaskScheduler {

  private timer: TaskTimer;
  constructor() {
    this.timer = new TaskTimer(TASK_TICK_INTERVAL_MS);
    this.timer.start();
    logT.info(`TASK timer Started!`);
  }

  public async scheduleTask(args: ScheduledTaskCreateInput, db: Prisma) {
    const tsk = await this.setupTasks(args, db);
    if (tsk) {
      this.timer.add(tsk);
    }
    logT.info(`Task Count is now: ${this.timer.taskCount}`);
  }

  public async restoreTasks(db: Prisma) {
    // restore Tasks from DB after restart / rebuild of Server / Docker Container
    const tsk = await db.scheduledTasks();
    logT.info(`restoring ${tsk.length} tasks`)
    for (const t of tsk) {
      // logT.info(`restoring ${t.taskType}`)
      const task = await this.setupTasks(t, db)
      if (task) {
        this.timer.add(task);
      }
    }
  }

  private async setupTasks(
    args: ScheduledTaskCreateInput,
    db: Prisma
  ): Promise<ITaskOptions> {
    switch (args.taskType) {
      // TODO Implement open request reminders
      // PUSH_NOTIFY_INCOMING_BUDDY_REQUEST_REMINDER, //after 24h
      // PUSH_NOTIFY_INCOMING_BUDDY_REQUEST_REMINDER_FOLLOWUP, //after 46h
      case "SYSTEM_SCHEDULE_REQUEST_DESTRUCTION":
        return buddyRequestDestruction.setup(args, db);
      case "SYSTEM_AUTO_MATCH":
        return autoMatch.setup(args, db);
      case "BOT_WELCOME_MESSAGE":
        return botWelcomeMessage.setup(args, db);
      case "BOT_REMIND_TO_CHAT":
        return remindToChatTask.setup(args, db, this.timer);
      case "BOT_INTRODUCTION_CREATE_ACTIVITIES_TIME":
        return createActivitiesBotReminder.setup(args, db);
      case "BOT_INTRODUCTION_CREATE_ACTIVITIES_COUNT":
        // special case: needs no timed task
        createActivitiesBotReminderCount.execute(args, db);
      case "BOT_PLANNED_ACTIVITIES_LOW":
        return plannedActivitiesLowBot.setup(args, db, this.timer);
      case "PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER":
        return notEnoughActivitiesUserPush.setup(args, db);
      case "PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY":
        return notEnoughActivitiesBuddyPush.setup(args, db);
      // case 'PUSH_NOTIFY_TO_MUCH_ACTIVITIES_USER':
      //   return this.pushNotifyToMuchActivitiesUserSchedule(args, ctx);
      case "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY":
        return tooMuchActivitiesBuddy.setup(args, db, this.timer);
      case "PUSH_NOTIFY_IPAQ_REMINDER":
        return ipaqReminderPush.setup(args, db, this.timer);
      case "PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP":
        return ipaqReminderFollowupPush.setup(args, db, this.timer);
      case "PUSH_NOTIFY_PHQ_REMINDER":
        return phqReminderPush.setup(args, db, this.timer);
      case "PUSH_NOTIFY_PHQ_REMINDER_FOLLOWUP":
        return phqReminderPushFollowup.setup(args, db, this.timer);
      case "PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY":
        return missedActivityBuddyPush.setup(args, db, this.timer);
      default:
        logT.error("Unknown Task Type", Error);
        break;
    }
  }

  // setup reoccurring tasks for user and buddy after matching
  public async setupAfterMatchTasks(args: Partial<ScheduledTaskCreateInput>, db: Prisma) {
    await taskScheduler.scheduleTask({
      taskType: 'BOT_WELCOME_MESSAGE',
      chatId: args.chatId,
    }, db);

    await taskScheduler.scheduleTask({
      taskType: 'BOT_INTRODUCTION_CREATE_ACTIVITIES_TIME',
      chatId: args.chatId,
    }, db);

    await taskScheduler.scheduleTask({
      taskType: 'BOT_INTRODUCTION_CREATE_ACTIVITIES_COUNT',
      chatId: args.chatId,
    }, db);

    await taskScheduler.scheduleTask({
      taskType: 'BOT_REMIND_TO_CHAT',
      chatId: args.chatId,
    }, db);

    await taskScheduler.scheduleTask({
      taskType: 'BOT_PLANNED_ACTIVITIES_LOW',
      chatId: args.chatId,
      userId: args.userId,
    }, db);

    // remind this user about own activities
    await taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER',
      userId: args.userId,
    }, db);

    // remind this user about buddy activities
    await taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY',
      userId: args.userId,
    }, db);

    await taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY',
      userId: args.userId,
    }, db);

    await this.setupAfterMatchTasksBuddy(args, db);
  }

  public async setupAfterMatchTasksBuddy(args: Partial<ScheduledTaskCreateInput>, db: Prisma) {
    const buddyId = await db
      .user({ id: args.userId })
      .patient()
      .buddy()
      .patient()
      .user().id();

    await taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY',
      userId: buddyId,
    }, db);

    // remind this users buddy about buddys (this user) activities
    await taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY',
      userId: buddyId,
    }, db);

    // remind this users buddy about own activities
    await taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER',
      userId: buddyId,
    }, db);

    await taskScheduler.scheduleTask({
      taskType: 'BOT_PLANNED_ACTIVITIES_LOW',
      chatId: args.chatId,
      userId: buddyId,
    }, db);
  }

  public async deleteTasksAfterUnlink(ids: string[]) {
    for (const i of ids) {
      if (this.timer.get(i)) {
        this.timer.remove(i);
      }
    }
  }


  public async scheduleChatNotification(
    args: ChatNotificationArgs,
    db: Prisma
  ) {
    if (!args.chatId) {
      logT.error("Missing ChatID in scheduleChatNotification", Error);
      return;
    }

    if (!args.msgText) {
      logT.error("Missing MessageText in scheduleChatNotification", Error);
      return;
    }
    this.timer.add(await this.scheduleChatMessagePush(args, db));
  }

  public async scheduleChatMessagePush(
    args: ChatNotificationArgs,
    db: Prisma
  ): Promise<Array<ITaskOptions>> {
    // aggregate data
    let chatUsers = await db.users({
      where: { patient: { buddy: { chat: { id: args.chatId } } } }
    });
    const sender = chatUsers.find(u => u.id === args.sendingUserId);
    chatUsers = chatUsers.filter(u => u.id !== args.sendingUserId);

    let senderName = sender ? sender.username : undefined;
    // if no sender name is found message has to be from bot
    if (!senderName) {
      senderName = await db
        .chat({ id: args.chatId })
        .bot()
        .name();
    }
    logT.info(`Schedule ChatMessagePush from ${senderName}`);
    const time = moment().add({ seconds: 2 });

    const pushTasks = Array<ITaskOptions>();
    logT.info(`Schedule for ${chatUsers.length} Users 
      - ${logFormat(chatUsers.map(u => u.username))}`);
    for (const receiver of chatUsers) {
      // schedule for all users -> maybe they add notification infos later

      // save Task to DB also generates unique task id
      const st: ScheduledTaskCreateInput = {
        taskType: "PUSH_NOTIFY_NEW_CHAT_MESSAGE",
        chatId: args.chatId,
        userId: receiver.id, // add user to whom notification should be send
      };
      const tId = await db.createScheduledTask(st).id();
      const receiverPromise = db.user({id:receiver.id});

      const t: ITaskOptions = {
        id: tId,
        removeOnCompleted: true,
        totalRuns: 1,
        startDate: time.toDate(),
        async callback(task, done) {
          notification.sendChatNotificationToUser(
            senderName,
            receiverPromise,
            args.msgText
          );
          await db.deleteScheduledTask({ id: tId });
          done();
        }
      };
      pushTasks.push(t);
    }
    return pushTasks;
  }

  public async sendScheduledBotMessage(
    args: ScheduledBotMessageArgs,
    db: Prisma
  ) {
    // chat could be deleted by unlinking buddys
    const chatExits = db.$exists.chat({ id: args.chatId });
    if (chatExits) {
      await db.updateChat({
        where: { id: args.chatId },
        data: {
          messages: {
            create: {
              text: args.msgText,
              authorBot: {
                connect: {
                  id: args.botId
                }
              }
            }
          }
        }
      });
    }
    if (args.taskId) {
      await db.deleteScheduledTask({ id: args.taskId });
    }
    if (chatExits) {
      await taskScheduler.scheduleChatNotification(
        {
          chatId: args.chatId,
          sendingUserId: args.botId,
          msgText: args.msgText
        },
        db
      );
    }
  }

}

export const taskScheduler = new TaskScheduler();
