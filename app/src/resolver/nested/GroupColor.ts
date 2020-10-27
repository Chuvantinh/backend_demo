import {GroupColorResolvers} from '../../generated/graphqlgen';
import { Context } from '../../types';

export const GroupColor: GroupColorResolvers.Type = {
  ...GroupColorResolvers.defaultResolvers,
  
  group: async (parent, args, ctx: Context) => {
    return  ctx.db.groupColor({
        id: parent.id
    }).group();
  },
};
