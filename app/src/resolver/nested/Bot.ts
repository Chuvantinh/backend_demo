import { BotResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Bot: BotResolvers.Type = {
  ...BotResolvers.defaultResolvers,

  chat: async (parent, _args, ctx: Context) => {
    return ctx.db.bot({ id: parent.id }).chat();
  },
};
