import * as moment from 'moment';

import {QueryResolvers, MutationResolvers, SubscriptionResolvers} from '../generated/graphqlgen';
import {Context, AuthPayload} from '../types';
import {ID_Input} from "../generated/prisma-client";

export const VotingQueryResolver: Pick<QueryResolvers.Type
    , 'votings'> = {
    ...QueryResolvers.defaultResolvers,

    votings: async (root, args, ctx: Context) => {
        return await ctx.db.votings({
            where: args.where,
            orderBy: args.orderBy
        });
    }
}

export const VotingMutationResolver: Pick<MutationResolvers.Type
    , 'createVoting'
    > = {
    createVoting: async (root, {title, description, votedPoint, challengeID, contributionID, createdBy}, ctx: Context) => {
        return await ctx.db.createVoting({
            title: title,
            description: description,
            votedPoint: votedPoint,
            challengeID:{
                connect: challengeID
            },
            contributionID:{
                connect: {
                    id: contributionID
                }
            },
            createdBy: {
                connect: createdBy
            }
        });
    }
}