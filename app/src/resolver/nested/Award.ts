import {AwardResolvers} from '../../generated/graphqlgen';
import {Context} from '../../types';

export const Award: AwardResolvers.Type = {
    ...AwardResolvers.defaultResolvers,

    challengeID: async (parent, args, ctx: Context) => {
        return ctx.db.award({
            id: parent.id
        }).challengeID();
    },
    contributionID: async (parent, args, ctx: Context) => {
        return ctx.db.award({
            id: parent.id
        }).contributionID();
    },
    votingID: async (parent, args, ctx: Context) => {
        return ctx.db.award({
            id: parent.id
        }).votingID();
    },
    createdBy: async (parent, args, ctx: Context) => {
        return ctx.db.award({
            id: parent.id
        }).createdBy();
    },
    // winneruser: async (parent, args, ctx: Context) => {
    //     return ctx.db.award({
    //         id: parent.id
    //     }).winneruser();
    // }
    // winner: async (parent, args, ctx: Context) => {
    //     return ctx.db.award({
    //         id: parent.id
    //     }).createdBy();
    // },
};
