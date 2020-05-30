
import { IpaqAnswersResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const IpaqAnswers: IpaqAnswersResolvers.Type = {
  ...IpaqAnswersResolvers.defaultResolvers,

  quest: async (parent, _args, ctx: Context) => {
    return ctx.db.ipaqAnswers({id: parent.id}).quest();
  }
};
