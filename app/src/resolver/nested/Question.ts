import {ChallengeResolvers, QuestionResolvers} from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Question: QuestionResolvers.Type = {
  ...QuestionResolvers.defaultResolvers,

    createdBy: async (parent, args, ctx: Context) => {
      return ctx.db.question({
          id: parent.id
      }).createdBy();
    }
};
