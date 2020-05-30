
import { BuddyResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Buddy: BuddyResolvers.Type = {
  ...BuddyResolvers.defaultResolvers,

  patient: async (parent, _args, ctx: Context) => {
    return ctx.db.buddy({ id: parent.id }).patient();
  },
  chat: async (parent, _args, ctx: Context) => {
    return ctx.db.buddy({ id: parent.id }).chat();
  },
};
