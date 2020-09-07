
import { ChallengeResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Challenge: ChallengeResolvers.Type = {
  ...ChallengeResolvers.defaultResolvers,
  
  jury: async (parent, args, ctx: Context) => {
    return  ctx.db.challenge({
        id: parent.id
    }).jury();
  },
    category: async (parent, args, ctx: Context) => {
        return  ctx.db.challenge({
            id: parent.id
        }).category();
    },

    group: async (parent, args, ctx: Context) => {
        return  ctx.db.challenge({
            id: parent.id
        }).group();
    },
    createdBy: async (parent, args, ctx: Context) => {
      return ctx.db.challenge({
          id: parent.id
      }).createdBy();
    }
};
