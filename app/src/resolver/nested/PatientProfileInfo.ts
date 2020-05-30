import { PatientProfileInfoResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const PatientProfileInfo: PatientProfileInfoResolvers.Type = {
  ...PatientProfileInfoResolvers.defaultResolvers,

  profileActivities: async (parent, _args, ctx: Context) => {
    return ctx.db.patientProfileInfo({ id: parent.id }).profileActivities();
  },
};
