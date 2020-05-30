
import { UserResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,
  
  patient: async (parent, _args, ctx: Context) => {
    return ctx.db.user({ id: parent.id }).patient();
  },

  notifications: async (parent, _args, ctx: Context) => {
    return ctx.db.user({ id: parent.id }).notifications();
  },

  settings: async (parent, _args, ctx: Context) => {
    return ctx.db.user({ id: parent.id }).settings();
  },
};
