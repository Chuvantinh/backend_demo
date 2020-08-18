"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.getUserRole = exports.operationAuthorized = exports.verifyAuthKey = void 0;
var jwt = require("jsonwebtoken");
var apollo_server_1 = require("apollo-server");
var logger_1 = require("../logger");
var apollo_server_2 = require("apollo-server");
var env_config_1 = require("../config/env.config");
// check token expiry date 
var assertAlive = function (decoded) {
    var now = Date.now().valueOf() / 1000;
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
        throw new Error("token expired: " + JSON.stringify(decoded));
    }
    if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
        throw new Error("token not yet valid: " + JSON.stringify(decoded));
    }
};
exports.verifyAuthKey = function (authHeader, tokenRequired) {
    if (tokenRequired === void 0) { tokenRequired = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var token, decoded;
        return __generator(this, function (_a) {
            // logA.info(`Token exists: ${(!!authHeader.authToken)}`);
            // logA.info(`Token required: ${(tokenRequired)}`);
            // console.log(`authHeader.authToken: ${JSON.stringify(authHeader.authToken)}`);
            if (authHeader.authToken) {
                token = authHeader.authToken.replace('Bearer ', '');
                // log.debug(`verify key: ${token}`);
                try {
                    decoded = jwt.verify(token, env_config_1.APP_PRIVATE_KEY);
                    // log.info(`decoded key: ${JSON.stringify(decoded)}`);
                    try {
                        assertAlive(token);
                    }
                    catch (error) {
                        logger_1.logA.error('Token expired', error);
                        throw new apollo_server_2.AuthenticationError('Token expired' + error);
                    }
                    return [2 /*return*/, decoded.userId];
                }
                catch (error) {
                    logger_1.logA.warn('Token verification failed ');
                    throw new apollo_server_2.AuthenticationError('Token verification failed');
                }
            }
            else {
                logger_1.logA.info('No Token found');
                if (tokenRequired) {
                    throw new apollo_server_2.AuthenticationError('Access Denied');
                }
                else {
                    logger_1.log.info('Anonymous Connection Allowed');
                }
                // log.info('Anonymous Connection Attempt?');
            }
            return [2 /*return*/];
        });
    });
};
// these Operations are permitted without valid jwt token
var WHITELIST = [
    'login',
    'registerUser',
];
// Parses request body to find operation definition name see: 
// https://stackoverflow.com/questions/57049366/get-query-mutation-operation-name and
// https://stackoverflow.com/questions/49047259/how-to-parse-graphql-request-string-into-an-object
exports.operationAuthorized = function (requestBody) { return __awaiter(void 0, void 0, void 0, function () {
    var authRequired, obj, def, sel, defName;
    return __generator(this, function (_a) {
        authRequired = true;
        obj = apollo_server_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), requestBody);
        def = obj.definitions;
        sel = def.length > 0 ? def[0].selectionSet.selections : undefined;
        defName = (def.length > 0) ? def[0].name.value : undefined;
        // logA.info(`Operation ${JSON.stringify(requestBody, null, ' ')}`);
        // logA.info(`Operation Def ${JSON.stringify(defName, null, ' ')}`);
        if (def.length === 1 && sel && sel.length === 1) {
            // logA.info(`Operation ${JSON.stringify(sel[0].name.value, null, ' ')}`);
            // if on Whitelist no auth required
            authRequired = !WHITELIST.includes(sel[0].name.value);
            // logA.info(`Auth Required: ${authRequired}`);
        }
        else {
            // logA.warn(`Operation Length: ${def.length} - ${sel.length}`);
        }
        // special case for Introspection Queries - allow them without token in Debug mode
        if (defName && defName === "IntrospectionQuery" && env_config_1.ALLOW_INTROSPECTION) {
            logger_1.logA.info("Definition " + JSON.stringify(defName, null, ' '));
            authRequired = false;
        }
        return [2 /*return*/, authRequired];
    });
}); };
exports.getUserRole = function (uid, prisma) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!uid) {
            // for introspection
            return [2 /*return*/, undefined];
        }
        // update user as seen now -> TODO: move somewhere else
        // await prisma.updateUser({
        //   where: { id: uid },
        //   data: { lastActive: moment().toDate() }
        // });
        return [2 /*return*/, prisma.user({ id: uid }).role()];
    });
}); };
var templateObject_1;
