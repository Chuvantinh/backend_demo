import { BuddyRequestResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';


export const BuddyRequest: BuddyRequestResolvers.Type = {
  ...BuddyRequestResolvers.defaultResolvers,

  from: async (parent, _args, ctx: Context) => {
    return ctx.db.buddyRequest({ id: parent.id }).from();
  },
  to: async (parent, _args, ctx: Context) => {
    return ctx.db.buddyRequest({ id: parent.id }).to();
  }
};
