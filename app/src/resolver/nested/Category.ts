
import {CategoryResolvers} from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Category: CategoryResolvers.Type = {
  ...CategoryResolvers.defaultResolvers,

  challenge: async (parent, args, ctx: Context) => {
    return  ctx.db.category({
        id: parent.id
    }).challenge();
  },
};
