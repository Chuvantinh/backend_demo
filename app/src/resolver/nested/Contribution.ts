import {ContributionResolvers} from '../../generated/graphqlgen';
import {Context} from '../../types';

export const Contribution: ContributionResolvers.Type = {
    ...ContributionResolvers.defaultResolvers,

    challengeID: async (parent, args, ctx: Context) => {
        return ctx.db.contribution({
            id: parent.id
        }).challengeID();
    },
    createdBy: async (parent, args, ctx: Context) => {
        return ctx.db.contribution({
            id: parent.id
        }).createdBy();
    }
};
