import { ChatResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Chat: ChatResolvers.Type = {
  ...ChatResolvers.defaultResolvers,

  // buddies: async (parent, _args, ctx: Context) => {
  //   return ctx.db.chat({ id: parent.id }).buddies();
  // },
  messages: async (parent, _args, ctx: Context) => {
    return ctx.db.chat({ id: parent.id }).messages();
  },
  bot: async (parent, _args, ctx: Context) => {
    return ctx.db.chat({ id: parent.id }).bot();
  }
};
