import { UserActivityResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const UserActivity: UserActivityResolvers.Type = {
  ...UserActivityResolvers.defaultResolvers,

  grade: async (parent, _args, ctx: Context) => {
    return ctx.db.activity({ id: parent.id }).grade();
  },
};
