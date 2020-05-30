import { QueryResolvers, MutationResolvers } from '../generated/graphqlgen';
import { Context } from '../types';

export const SensorDataQueryResolver: Pick<
  QueryResolvers.Type
  , 'getAllSensors'
> = {
  ...QueryResolvers.defaultResolvers,

  getAllSensors: async (root,args,ctx: Context) => {
    return ctx.db.sensorDatas();
  }
}

export const SensorDataMutationResolver: Pick<
  MutationResolvers.Type
  , 'createSensorData'
> = {
  ...MutationResolvers.defaultResolvers,

  createSensorData:async (root, {type, x, y ,z}, ctx: Context) => {
    const sensorReturn = await ctx.db.createSensorData({
      type, x, y, z})
    return sensorReturn;
  } 
}