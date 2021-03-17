import {AnswerResolvers} from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Answer: AnswerResolvers.Type = {
  ...AnswerResolvers.defaultResolvers,

    questionID: async (parent, args, ctx: Context) => {
      return ctx.db.answer({
          id: parent.id
      }).questionID();
    },
    createdBy: async (parent, args, ctx: Context) => {
      return ctx.db.answer({
        id: parent.id
      }).createdBy();
    }
};
