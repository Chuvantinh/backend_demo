
import { QuestionnairesResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Questionnaires: QuestionnairesResolvers.Type = {
  ...QuestionnairesResolvers.defaultResolvers,

  phq9s: async (parent, _args, ctx: Context) => {
    return ctx.db.questionnaires({ id: parent.id }).phq9s();
  },
  ipaqs: async (parent, _args, ctx: Context) => {
    return ctx.db.questionnaires({ id: parent.id }).ipaqs();
  },
  patient: async (parent, _args, ctx: Context) => {
    return ctx.db.questionnaires({ id: parent.id }).patient();
  }
};
