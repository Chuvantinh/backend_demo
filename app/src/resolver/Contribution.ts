import * as moment from 'moment';

import {QueryResolvers, MutationResolvers, SubscriptionResolvers} from '../generated/graphqlgen';
import {Context, AuthPayload} from '../types';

export const ContributionQueryResolver: Pick<QueryResolvers.Type
    , 'contributions'> = {
    ...QueryResolvers.defaultResolvers,

    contributions: async (root, args, ctx: Context) => {
        return await ctx.db.contributions({
            where: args.where
        });
    }
}

export const ContributionMutationResolver: Pick<MutationResolvers.Type
    , 'createContribution'
    > = {
    createContribution: async (root, {id, title, description, image, createdBy}, ctx: Context) => {
        return await ctx.db.createContribution({
            challengeID:{
                connect: {
                    id: id
                }
            },
            title: title,
            description: description,
            image: image,
            createdBy: {
                connect: createdBy
            }
        });
    }
}