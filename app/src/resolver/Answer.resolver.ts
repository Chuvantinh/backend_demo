import * as moment from 'moment';
import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context, AuthPayload } from '../types';

export const AnswerQueryResolver:
    Pick<
        QueryResolvers.Type,'getanswer'
        > = {
    ...QueryResolvers.defaultResolvers,

    // question: async (root, args, ctx: Context) => {
    //     return await ctx.db.question(args.where);
    // },
    getanswer: async (root, args, ctx: Context) => {
        return await ctx.db.answers({
            where: args.where,
            last: 1
        });
    },
}

export const AnswerMutationResolver: Pick<
    MutationResolvers.Type
    , 'createAnswer'
    > = {
    createAnswer: async (root,{ questionID, json_infor, createdBy, totalPoint}, ctx: Context) => {
        return await ctx.db.createAnswer({
            questionID: {
                connect:{
                    id: questionID
                }
            },
            json_infor: json_infor,
            createdBy: {
                connect: {
                    id: createdBy
                }
            },
            totalPoint : totalPoint
        });
    }
}
