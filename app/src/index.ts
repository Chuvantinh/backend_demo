import { ApolloServer, gql, ValidationError } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { getOperationAST } from 'graphql';
// import { schema } from './schema/Schema'; // prisma nexus schema
import { verifyAuthKey, operationAuthorized, getUserRole } from './authorization/Authorization';
import { prisma, GlobalSettings, Prisma } from './generated/prisma-client';
import { resolvers as importResolvers } from './resolver';
import { log, logT } from './logger';
import { PORT, TOKEN_EXPIRY_TIME, DEBUG, PLAYGROUND, ALLOW_INTROSPECTION, CORS_ORIGIN, TASK_TICK_INTERVAL_MS, SERVER_PROXY } from './config/env.config';
import { Context } from './types';
import { getGlobalSettings, getGlobalSettingsId } from './global_settings/global.settings';
import { taskScheduler } from './tasks/tasks';


// const typeDefs = gql(importSchema('./src/schema/schema.graphql'));
// const resolvers = importResolvers as any;
// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
//   resolverValidationOptions: { requireResolversForResolveType: false },
// });
// let CONFIG_DEPLOYED: boolean = false;

export async function main() {

  const tasker = taskScheduler;
  await tasker.restoreTasks(prisma);

  // see https://github.com/apollographql/apollo-server/issues/2315 for sample
  const server: ApolloServer = new ApolloServer({
    // schema,
    typeDefs: gql(importSchema('./src/schema/schema.graphql')),
    resolvers: importResolvers as any,
    context: async ({ req, connection }: any): Promise<Context> => {
      let header = { authToken: '' };
      if (connection) {
        header = connection.context;
      } else {
        header.authToken = req.headers.authorization
      }

      // check if operation is excepted from auth
      let authRequired = true;
      if (req && req.body && req.body.query) {
        authRequired = await operationAuthorized(req.body.query);
      }

      const uid = await verifyAuthKey(header, authRequired);
      return {
        db: prisma,
        userId: uid,
        role: await getUserRole(uid, prisma),
        settingsId: await getGlobalSettingsId(prisma),
      };
    },
    subscriptions: {
      onConnect: async (connectionParams: any) => {
        log.info(`Web Socket connection initiated`);
        return { authToken: connectionParams.Authorization };
      },
      onDisconnect: async () => {
        log.info(`Web Socket Disconnected`);
      }
    },
    cors: {
      origin: CORS_ORIGIN,
      credentials: true
    },
    // rootValue: (documentNode) => {
    //   const op = getOperationAST(documentNode);
    //   if (op) {
    //     // log.info(`Operation Value ${JSON.stringify(op.name.value, null, ' ')}`);
    //   }
    // },
    debug: DEBUG,
    playground: PLAYGROUND, // only affects serving web playground?
    introspection: ALLOW_INTROSPECTION,
  });

  return server.listen({ port: PORT || 4000 }).then((s) => {
    log.info(`GraphQL endpoint ready at ${s.url}`);
    log.info(`Subscriptions ready at ${s.subscriptionsUrl}`);
    log.info(`DEBUG Mode ${DEBUG}`);
    log.info(`Introspection  ${ALLOW_INTROSPECTION}`);
    log.info(`Playground  ${PLAYGROUND}`);
    log.info(`TOKEN Expiry ${TOKEN_EXPIRY_TIME}`);
    log.info(`CORS_ORIGIN ${CORS_ORIGIN}`);
    log.info(`Task Ticks ${TASK_TICK_INTERVAL_MS}`);
    log.info(`Using Proxy ${SERVER_PROXY}`);
  }).catch((e) => log.error(`ERROR Starting Server`, e));
}

// ==> run main
main();



