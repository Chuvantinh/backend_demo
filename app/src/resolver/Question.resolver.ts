import * as moment from 'moment';
import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context, AuthPayload } from '../types';
export const QuestionQueryResolver:
    Pick<
    QueryResolvers.Type ,'questions'
    > = {
    ...QueryResolvers.defaultResolvers,

    // question: async (root, args, ctx: Context) => {
    //     return await ctx.db.question(args.where);
    // },
    questions: async (root, args, ctx: Context) => {
        return await ctx.db.questions({
            where: args.where,
            last: 1
        });
    },
}

export const QuestionMutationResolver: Pick<
    MutationResolvers.Type
    , 'createQuestion'
    > = {
    createQuestion: async (root,{ title, description, json_infor, createdBy}, ctx: Context) => {
        return await ctx.db.createQuestion({
            title: title,
            description: description,
            json_infor: json_infor,
            createdBy:{
                connect: createdBy
            }
        });
    }
}