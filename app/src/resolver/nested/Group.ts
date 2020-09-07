
import {GroupResolvers} from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Group: GroupResolvers.Type = {
  ...GroupResolvers.defaultResolvers,
  
    challenge: async (parent, args, ctx: Context) => {
        return  ctx.db.group({
            id: parent.id
        }).challenge();
    },
    createdBy: async (parent, args, ctx: Context) => {
        return ctx.db.group({
            id: parent.id
        }).createdBy();
    }
};
