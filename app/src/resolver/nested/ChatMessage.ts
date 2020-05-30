
import { ChatMessageResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const ChatMessage: ChatMessageResolvers.Type = {
  ...ChatMessageResolvers.defaultResolvers,

  author: async (parent, _args, ctx: Context) => {
    return ctx.db.chatMessage({ id: parent.id }).author();
  },
  attachment: async (parent, _args, ctx: Context) => {
    return ctx.db.chatMessage({ id: parent.id }).attachment();
  },
  authorBot: async (parent, _args, ctx: Context) => {
    return ctx.db.chatMessage({ id: parent.id }).authorBot();
  },
  chat: async (parent, _args, ctx: Context) => {
    return ctx.db.chatMessage({ id: parent.id }).chat();
  },
};
