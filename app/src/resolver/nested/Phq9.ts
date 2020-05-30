import { Phq9Resolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Phq9: Phq9Resolvers.Type = {
  ...Phq9Resolvers.defaultResolvers,

  // reminder(parent, args, ctx: Context) {
  //   return ctx.db.phq9({ id: parent.id }).reminder();
  // },
  quests: async (parent, _args, ctx: Context) => {
    return ctx.db.phq9({ id: parent.id }).quests();
  }
};
