import { AuthPayloadResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const AuthPayload: AuthPayloadResolvers.Type = {
  ...AuthPayloadResolvers.defaultResolvers
};
