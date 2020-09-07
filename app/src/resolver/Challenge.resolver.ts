import * as moment from 'moment';

import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context, AuthPayload } from '../types';
import { log, logA, logFormat } from '../logger';
import { APP_PRIVATE_KEY, TOKEN_EXPIRY_TIME, VAPID_PUBLIC_KEY } from '../config/env.config';
import { UserUpdateInput, UserCreateInput, UserRole, TaskTypes, Buddy, User, WebPushNotification } from '../generated/prisma-client';
// import { RegistrationError, LoginError } from '../errors/errors';
import { UserInputError } from 'apollo-server';

export const ChallengeQueryResolver: Pick<
  QueryResolvers.Type
  , 'challenge' | 'challenges'
> = {
  ...QueryResolvers.defaultResolvers,

    challenge: async (root, args, ctx: Context) => {
        return await ctx.db.challenge(args.where);
    },
    challenges: async (root, args, ctx: Context) => {
        return await ctx.db.challenges({
            where: args.where
        });
    },
}

export const ChallengeMutationResolver: Pick<
    MutationResolvers.Type
    , 'createChallenge'
    // | 'updateAppUser'
    > = {
    createChallenge: async (root,{ title, description, image, premium, timeEnd, emailSend,status, initiator, jury, category, group, createdBy}, ctx: Context) => {
        return await ctx.db.createChallenge({
            title: title,
            description: description,
            image: image,
            premium: premium,
            timeEnd: timeEnd,
            emailSend: emailSend,
            status: status,
            initiator: initiator,
            jury: {
                connect: jury
            },
            category:{
                connect: category
            },
            group:{
                connect: group
            },
            createdBy:{
                connect: createdBy
            }
        });
    }
}