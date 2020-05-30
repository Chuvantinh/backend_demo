import * as jwt from 'jsonwebtoken';
import { gql } from 'apollo-server';
import { log, logA } from '../logger';
import { AuthenticationError } from 'apollo-server';
import { APP_PRIVATE_KEY, DEBUG, ALLOW_INTROSPECTION } from '../config/env.config';
import { Prisma, UserRole } from '../generated/prisma-client';
import * as moment from 'moment';

// check token expiry date 
const assertAlive = (decoded: any) => {
  const now = Date.now().valueOf() / 1000
  if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
    throw new Error(`token expired: ${JSON.stringify(decoded)}`)
  }
  if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
    throw new Error(`token not yet valid: ${JSON.stringify(decoded)}`)
  }
}

export const verifyAuthKey = async (authHeader: { authToken: string }, tokenRequired = true) => {
  // logA.info(`Token exists: ${(!!authHeader.authToken)}`);
  // logA.info(`Token required: ${(tokenRequired)}`);
  // console.log(`authHeader.authToken: ${JSON.stringify(authHeader.authToken)}`);

  if (authHeader.authToken) {
    const token = authHeader.authToken.replace('Bearer ', '');
    // log.debug(`verify key: ${token}`);
    try {
      const decoded = jwt.verify(
        token,
        APP_PRIVATE_KEY);
      // log.info(`decoded key: ${JSON.stringify(decoded)}`);
      try {
        assertAlive(token)
      } catch (error) {
        logA.error('Token expired', error);
        throw new AuthenticationError('Token expired' + error);
      }
      return (decoded as any).userId;
    } catch (error) {
      logA.warn('Token verification failed ');
      throw new AuthenticationError('Token verification failed');
    }
  } else {
    logA.info('No Token found');
    if (tokenRequired) {
      throw new AuthenticationError('Access Denied');
    } else {
      log.info('Anonymous Connection Allowed');
    }

    // log.info('Anonymous Connection Attempt?');
  }
}

// these Operations are permitted without valid jwt token
const WHITELIST = [
  'login',
  'registerUser',
  // 'createAppPatient' // - temporary - remove later
]


// Parses request body to find operation definition name see: 
// https://stackoverflow.com/questions/57049366/get-query-mutation-operation-name and
// https://stackoverflow.com/questions/49047259/how-to-parse-graphql-request-string-into-an-object
export const operationAuthorized = async (requestBody: any): Promise<boolean> => {
  // check if operation is excepted from auth
  let authRequired = true;

  const obj = gql`${requestBody}`;
  const def = (obj.definitions as any[]);
  const sel = (def as any[]).length > 0 ? (def as any[])[0].selectionSet.selections as any[] : undefined;

  // used to check if is introspection
  let defName: string;
  defName = (def.length > 0) ? def[0].name.value : undefined

  // logA.info(`Operation ${JSON.stringify(requestBody, null, ' ')}`);
  // logA.info(`Operation Def ${JSON.stringify(defName, null, ' ')}`);

  if (def.length === 1 && sel && sel.length === 1) {
    // logA.info(`Operation ${JSON.stringify(sel[0].name.value, null, ' ')}`);
    // if on Whitelist no auth required
    authRequired = !WHITELIST.includes(sel[0].name.value);
    // logA.info(`Auth Required: ${authRequired}`);
  } else {
    // logA.warn(`Operation Length: ${def.length} - ${sel.length}`);
  }

  // special case for Introspection Queries - allow them without token in Debug mode
  if (defName && defName === "IntrospectionQuery" && ALLOW_INTROSPECTION) {
    logA.info(`Definition ${JSON.stringify(defName, null, ' ')}`);
    authRequired = false;
  }
  return authRequired;
}

export const getUserRole = async (uid: string, prisma: Prisma): Promise<UserRole> => {
  if (!uid) {
    // for introspection
    return undefined;
  }
  // update user as seen now -> TODO: move somewhere else
  // await prisma.updateUser({
  //   where: { id: uid },
  //   data: { lastActive: moment().toDate() }
  // });
  return prisma.user({ id: uid }).role();
}
