import { SensorDataResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const SensorData: SensorDataResolvers.Type = {
  ...SensorDataResolvers.defaultResolvers,

  // removed activity -to> use relation
  // user: async (parent, _args, ctx: Context) => {
  //   return ctx.db.activity({ id: parent.id }).user();
  // },
};