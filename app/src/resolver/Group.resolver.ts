import * as moment from 'moment';

import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context, AuthPayload } from '../types';
import { log, logA, logFormat } from '../logger';
import { APP_PRIVATE_KEY, TOKEN_EXPIRY_TIME, VAPID_PUBLIC_KEY } from '../config/env.config';
import { UserUpdateInput, UserCreateInput, UserRole, TaskTypes, Buddy, User, WebPushNotification } from '../generated/prisma-client';
// import { RegistrationError, LoginError } from '../errors/errors';
import { UserInputError } from 'apollo-server';

export const GroupQueryResolver: Pick<
  QueryResolvers.Type
  ,'groups' | 'group'
> = {
  ...QueryResolvers.defaultResolvers,

    groups: async (root, args, ctx: Context) => {
        return await ctx.db.groups();
    },

    group: async (root, args, ctx: Context) => {
      return await ctx.db.group(args.where);
    }
}