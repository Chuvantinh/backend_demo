import { PatientResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const Patient: PatientResolvers.Type = {
  ...PatientResolvers.defaultResolvers,

  profile: async (parent, _args, ctx: Context) => {
    return ctx.db.patient({ id: parent.id }).profile();
  },
  buddy: async (parent, _args, ctx: Context) => {
    return ctx.db.patient({ id: parent.id }).buddy();
  },
  // buddyRequests: async (parent, _args, ctx: Context) => {
  //   return ctx.db.patient({ id: parent.id }).buddyRequests();
  // },
  quests: async (parent, _args, ctx: Context) => {
    return ctx.db.patient({ id: parent.id }).quests();
  },
  activities: async (parent, _args, ctx: Context) => {
    return ctx.db.patient({ id: parent.id }).activities();
  },
  calendarEntries: async (parent, _args, ctx: Context) => {
    return ctx.db.patient({ id: parent.id }).calendarEntries();
  },
  user: async (parent, _args, ctx: Context) => {
    return ctx.db.patient({ id: parent.id }).user();
  },
  favoriteActivities: async (parent, _args, ctx: Context) => {
    return ctx.db.patient({ id: parent.id }).favoriteActivities();
  },
};
