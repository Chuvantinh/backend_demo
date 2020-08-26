import { ApolloServer, gql, ValidationError } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { getOperationAST } from 'graphql';
// import { schema } from './schema/Schema'; // prisma nexus schema
import { verifyAuthKey, operationAuthorized, getUserRole } from './authorization/Authorization';
import { prisma, GlobalSettings, Prisma } from './generated/prisma-client';
import { resolvers as importResolvers } from './resolver';
import { log, logT } from './logger';
import { ENDPOINT,PORT, TOKEN_EXPIRY_TIME, DEBUG, PLAYGROUND, ALLOW_INTROSPECTION, CORS_ORIGIN, TASK_TICK_INTERVAL_MS, SERVER_PROXY } from './config/env.config';
import { Context } from './types';
import { getGlobalSettings, getGlobalSettingsId } from './global_settings/global.settings';
import { taskScheduler } from './tasks/tasks';
import {typeDefs} from "./generated/prisma-client/prisma-schema";

import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
    mergeSchemas,
}from 'graphql-tools';

// const typeDefs = gql(importSchema('./src/schema/schema.graphql'));
// const resolvers = importResolvers as any;
// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
//   resolverValidationOptions: { requireResolversForResolveType: false },
// });

// mock 2 schema together one
// https://www.apollographql.com/docs/apollo-server/features/schema-stitching/
const shema1 = makeExecutableSchema({
    typeDefs : gql(importSchema('./src/schema/schema.graphql'))
})

const shema2 = makeExecutableSchema({
    typeDefs : gql(importSchema('./src/generated/schema/prisma.graphql'))
})

addMockFunctionsToSchema({ schema: shema1 });
addMockFunctionsToSchema({ schema: shema2 });

const mergedSchema = mergeSchemas({
    schemas: [
        shema1,
        shema2
    ],
    resolvers: importResolvers
});

// let CONFIG_DEPLOYED: boolean = false;

export async function main() {

  const tasker = taskScheduler;
  await tasker.restoreTasks(prisma);
  // see https://github.com/apollographql/apollo-server/issues/2315 for sample

  let server: ApolloServer = new ApolloServer({
      schema: mergedSchema,
    //typeDefs: gql(importSchema('./src/schema/schema.graphql')),
    context: async ({ req, connection }: any): Promise<Context> => {
      let header = { authToken: '' };
      if (connection) {
        header = connection.context;
      } else {
        header.authToken = req.headers.authorization
      }

      let uid;
      if(header.authToken != undefined){
          // check if operation is excepted from auth
          let authRequired = true;
          if (req && req.body && req.body.query) {
              // function is wrong cho nay bi sai
              authRequired = await operationAuthorized(req.body.query);
              //console.log("authRequired" + authRequired);
          }
            console.log(authRequired)
           uid = await verifyAuthKey(header, authRequired);
          // const uid = "ckcys3hcg001v0719yxusdh52";
          //log.info(`user role : ${uid}`);
      }else{
           uid = undefined;
      }


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
    log.info(`Port of server is ${PORT}`);
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



