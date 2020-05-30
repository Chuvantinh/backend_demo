import * as moment from "moment";
import {
  QueryResolvers,
  MutationResolvers,
  SubscriptionResolvers
} from "../generated/graphqlgen";
import { Context } from "../types";
import { ChatMessage, Chat, CalendarEntryCreateWithoutPatientInput } from "../generated/prisma-client";
import { log } from "../logger";
import { taskScheduler } from "./../tasks/tasks";
import { notification } from "../services/notification/NotificationService";
import { createActivitiesBotReminderCount } from '../tasks/createActivitiesBotReminderCount.task';

// const REPLY_DAYS: number = Number(config.REPLY_TIME_DAYS);
// const REPLY_HOURS: number = Number(config.REPLY_TIME_HOURS);
// const REPLY_MINUTES: number = Number(config.REPLY_TIME_MINUTES);

type Attachment = Omit<CalendarEntryCreateWithoutPatientInput, 'sensorData'>;

export const ChatQueryResolver: Pick<
  QueryResolvers.Type,
  "getUsersChat" | "getUsersChatMessages"
> = {
  ...QueryResolvers.defaultResolvers,

  getUsersChat: async (root, args, ctx: Context) => {
    return ctx.db
      .user({ id: ctx.userId })
      .patient()
      .buddy()
      .chat();
  },

  getUsersChatMessages: async (root, { orderBy, last }, ctx: Context) => {
    const userId = ctx.userId;
    const myChat: Chat = await ctx.db
      .user({ id: userId })
      .patient()
      .buddy()
      .chat();
    return myChat
      ? ctx.db.chatMessages({
        where: { author: { id: userId } },
        orderBy,
        last
      })
      : [];
  }
};

export const ChatMutationResolver: Pick<
  MutationResolvers.Type,
  "sendChatMessage" |
  "setOnline" |
  "setOffline" |
  "deleteChat" |
  "sendCalendarEventAsChatAttachment"
// | 'botSendChatMessage'
> = {
  sendChatMessage: async (root, { text }, ctx: Context) => {
    const userId = ctx.userId;

    log.info("sendChatMessage " + text);
    const chatId = await ctx.db
      .user({ id: userId })
      .patient()
      .buddy()
      .chat()
      .id();
    await ctx.db.updateChat({
      where: { id: chatId },
      data: {
        messages: {
          create: {
            text,
            author: { connect: { id: userId } }
          }
        }
      }
    });

    // check if count for sending bot message is reached
    await createActivitiesBotReminderCount.execute({ chatId }, ctx.db);

    // reschedule reminder on every message send
    await taskScheduler.scheduleTask({ taskType: "BOT_REMIND_TO_CHAT", chatId }, ctx.db);

    // send notification with [X timespan] delay for each chat message
    await taskScheduler.scheduleChatNotification(
      {
        sendingUserId: userId,
        chatId,
        msgText: text
      },
      ctx.db
    );

    const msg = (await ctx.db.chat({ id: chatId }).messages({ last: 1 })).pop();
    // log.info(`Msg Date ${msg.createdAt}`);
    return msg;
  },

  sendCalendarEventAsChatAttachment: async (root, { originalId, createAttachment, ownerId }, ctx: Context) => {
    const userId = ctx.userId;
    const chatId = await ctx.db
      .user({ id: userId })
      .patient()
      .buddy()
      .chat()
      .id();

    log.info(`sendCalendarEventAsChatAttachment ${originalId}`);

    await ctx.db.updateChat({
      where: { id: chatId },
      data: {
        messages: {
          create: {
            author: { connect: { id: userId } },
            attachment: {
              create: {
                calendarEntry: { 
                  create: createAttachment as Attachment },
                originalCalendarEntryId: originalId,
                ownerId
              }
            }
          }
        }
      }
    });

    const msg = (await ctx.db.chat({ id: chatId }).messages({ last: 1 })).pop();
    // log.info(`Msg Date ${msg.createdAt}`);
    return msg;
  },

  setOnline: (root, args, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.updateUser({
      data: { patient: { update: { online: true } } },
      where: { id: userId }
    });
  },

  setOffline: (root, args, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.updateUser({
      data: { patient: { update: { online: false } } },
      where: { id: userId }
    });
  },

  deleteChat: (root, { id }, ctx: Context) => {
    return ctx.db.deleteChat({ id });
  }

  // botSendChatMessage: async (root, { text, userId }, ctx: Context) => {
  //   const chatId = await ctx.db.user({ id: userId }).buddy().chat().id();
  //   const botId = await ctx.db.user({ id: userId }).buddy().chat().bot().id();
  //   return (await ctx.db.updateChat({
  //     where: { id: chatId },
  //     data: {
  //       messages: {
  //         create: {
  //           text,
  //           authorBot: {
  //             connect: {
  //               id: botId,
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }).messages({ last: 1 })).pop();
  // },
};

export const ChatSubscriptionResolver: Pick<
  SubscriptionResolvers.Type,
  "watchChatMessages"
> = {
  ...SubscriptionResolvers.defaultResolvers,

  watchChatMessages: {
    subscribe: async (root, args, ctx: Context) => {
      const userId = ctx.userId;
      const myChatID = await ctx.db
        .user({ id: userId })
        .patient()
        .buddy()
        .chat()
        .id();

      return ctx.db.$subscribe
        .chatMessage({
          mutation_in: ["CREATED" /*, 'UPDATED'*/],
          node: {
            chat: { id: myChatID }
            // author: {id_not: userId}
          }
        })
        .node();
    },
    resolve: async (parent: ChatMessage, args, ctx: Context) => {
      // log.info('Chat Subscription triggered ' + parent.text);
      // const chatId = await ctx.db.chatMessage({ id: parent.id }).chat().id();
      // let authorId = await ctx.db.chatMessage({ id: parent.id }).author().id();
      // if (!authorId) {
      //   authorId = await ctx.db.chatMessage({ id: parent.id }).authorBot().id();
      // }
      // taskScheduler.scheduleChatNotification({
      //   type: 'PUSH_NEW_CHAT_MESSAGE',
      //   userId: authorId,
      //   chatId: chatId,
      // }, parent, ctx);

      return parent;
    }
  }
};
