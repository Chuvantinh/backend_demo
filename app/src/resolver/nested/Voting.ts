import { VotingResolvers } from '../../generated/graphqlgen';
import {Context} from '../../types';

export const Voting: VotingResolvers.Type = {
    ...VotingResolvers.defaultResolvers,

    challengeID: async (parent, args, ctx: Context) => {
        return await ctx.db.voting({
            id: parent.id
        }).challengeID();
    },
    contributionID: async (parent, args, ctx: Context) =>{
        return await ctx.db.voting({
            id:  parent.id
        }).contributionID();
    },
    createdBy: async (parent, args, ctx: Context) => {
        return await ctx.db.voting({
            id: parent.id
        }).createdBy();
    }
};
