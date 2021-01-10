import * as moment from 'moment';

import {QueryResolvers, MutationResolvers, SubscriptionResolvers} from '../generated/graphqlgen';
import {Context, AuthPayload} from '../types';

export const AwardQueryResolver: Pick<QueryResolvers.Type
    , 'awards'> = {
    ...QueryResolvers.defaultResolvers,

    awards: async (root, args, ctx: Context) => {
        return await ctx.db.awards({
            where: args.where
        });
    }
}

export const AwardMutationResolver: Pick<MutationResolvers.Type
    , 'createAward'
    > = {
    createAward: async (root, {challengeID, contributionID, votingID, createdBy, status, winner}, ctx: Context) => {

        return await ctx.db.createAward({
            challengeID: {
                connect: challengeID
            },
            contributionID: {
                connect: {
                    id: contributionID
                }
            },
            votingID: {
                connect: {
                    id: votingID
                }
            },
            createdBy:{
                connect: createdBy
            },
            status: status,
            // winner:{
            //     connect: winner
            // }
        });
    }
}