
import { IpaqResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Ipaq: IpaqResolvers.Type = {
  ...IpaqResolvers.defaultResolvers,

  // reminder(parent, args, ctx: Context) {
  //   return ctx.db.ipaq({ id: parent.id }).reminder();
  // },
  answers: async (parent, _args, ctx: Context) => {
    return ctx.db.ipaq({ id: parent.id }).answers();
  },
  quests: async (parent, _args, ctx: Context) => {
    return ctx.db.ipaq({ id: parent.id }).quests();
  }
};
