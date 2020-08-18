"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.main = void 0;
var apollo_server_1 = require("apollo-server");
var graphql_import_1 = require("graphql-import");
// import { schema } from './schema/Schema'; // prisma nexus schema
var Authorization_1 = require("./authorization/Authorization");
var prisma_client_1 = require("./generated/prisma-client");
var resolver_1 = require("./resolver");
var logger_1 = require("./logger");
var env_config_1 = require("./config/env.config");
var global_settings_1 = require("./global_settings/global.settings");
var tasks_1 = require("./tasks/tasks");
// const typeDefs = gql(importSchema('./src/schema/schema.graphql'));
// const resolvers = importResolvers as any;
// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
//   resolverValidationOptions: { requireResolversForResolveType: false },
// });
// let CONFIG_DEPLOYED: boolean = false;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tasker, server;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tasker = tasks_1.taskScheduler;
                    return [4 /*yield*/, tasker.restoreTasks(prisma_client_1.prisma)];
                case 1:
                    _a.sent();
                    console.log(env_config_1.ENDPOINT);
                    server = new apollo_server_1.ApolloServer({
                        // schema,
                        typeDefs: apollo_server_1.gql(graphql_import_1.importSchema('./src/schema/schema.graphql')),
                        resolvers: resolver_1.resolvers,
                        context: function (_a) {
                            var req = _a.req, connection = _a.connection;
                            return __awaiter(_this, void 0, void 0, function () {
                                var header, authRequired, uid, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            header = { authToken: '' };
                                            if (connection) {
                                                header = connection.context;
                                            }
                                            else {
                                                header.authToken = req.headers.authorization;
                                            }
                                            authRequired = true;
                                            if (!(req && req.body && req.body.query)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, Authorization_1.operationAuthorized(req.body.query)];
                                        case 1:
                                            authRequired = _c.sent();
                                            _c.label = 2;
                                        case 2: return [4 /*yield*/, Authorization_1.verifyAuthKey(header, authRequired)];
                                        case 3:
                                            uid = _c.sent();
                                            _b = {
                                                db: prisma_client_1.prisma,
                                                userId: uid
                                            };
                                            return [4 /*yield*/, Authorization_1.getUserRole(uid, prisma_client_1.prisma)];
                                        case 4:
                                            _b.role = _c.sent();
                                            return [4 /*yield*/, global_settings_1.getGlobalSettingsId(prisma_client_1.prisma)];
                                        case 5: return [2 /*return*/, (_b.settingsId = _c.sent(),
                                                _b)];
                                    }
                                });
                            });
                        },
                        subscriptions: {
                            onConnect: function (connectionParams) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    logger_1.log.info("Web Socket connection initiated");
                                    return [2 /*return*/, { authToken: connectionParams.Authorization }];
                                });
                            }); },
                            onDisconnect: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    logger_1.log.info("Web Socket Disconnected");
                                    return [2 /*return*/];
                                });
                            }); }
                        },
                        cors: {
                            origin: env_config_1.CORS_ORIGIN,
                            credentials: true
                        },
                        // rootValue: (documentNode) => {
                        //   const op = getOperationAST(documentNode);
                        //   if (op) {
                        //     // log.info(`Operation Value ${JSON.stringify(op.name.value, null, ' ')}`);
                        //   }
                        // },
                        debug: env_config_1.DEBUG,
                        playground: env_config_1.PLAYGROUND,
                        introspection: env_config_1.ALLOW_INTROSPECTION
                    });
                    return [2 /*return*/, server.listen({ port: env_config_1.PORT || 4000 }).then(function (s) {
                            logger_1.log.info("GraphQL endpoint ready at " + s.url);
                            logger_1.log.info("Subscriptions ready at " + s.subscriptionsUrl);
                            logger_1.log.info("DEBUG Mode " + env_config_1.DEBUG);
                            logger_1.log.info("Introspection  " + env_config_1.ALLOW_INTROSPECTION);
                            logger_1.log.info("Playground  " + env_config_1.PLAYGROUND);
                            logger_1.log.info("TOKEN Expiry " + env_config_1.TOKEN_EXPIRY_TIME);
                            logger_1.log.info("CORS_ORIGIN " + env_config_1.CORS_ORIGIN);
                            logger_1.log.info("Task Ticks " + env_config_1.TASK_TICK_INTERVAL_MS);
                            logger_1.log.info("Using Proxy " + env_config_1.SERVER_PROXY);
                        })["catch"](function (e) { return logger_1.log.error("ERROR Starting Server", e); })];
            }
        });
    });
}
exports.main = main;
// ==> run main
main();
