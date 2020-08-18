"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.QuestSubscriptionResolver = exports.QuestMutationsResolver = exports.QuestQueryResolver = void 0;
var graphqlgen_1 = require("../generated/graphqlgen");
var logger_1 = require("../logger");
var questionnaires_1 = require("../services/questionnaires");
var moment = require("moment");
var tasks_1 = require("../tasks/tasks");
var apollo_server_1 = require("apollo-server");
;
exports.QuestQueryResolver = __assign(__assign({}, graphqlgen_1.QueryResolvers.defaultResolvers), { getUserQuests: function (root, _a, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_b) {
            userId = ctx.userId;
            // const ipaq = ctx.db.user({ id: userId }).quests().ipaqs({ first: 1 });
            // const phq = ctx.db.user({ id: userId }).quests().phq9s({ first: 1 });
            return [2 /*return*/, ctx.db.user({ id: userId }).patient().quests()];
        });
    }); }, getUsersLastPhqQuest: function (root, _a, ctx) {
        var userID = _a.userID;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, phq;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (userID && ctx.role === 'PATIENT') {
                            throw new apollo_server_1.ForbiddenError('Not Authorized');
                        }
                        userId = userID ? userID : ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().quests().phq9s({ first: 1 })];
                    case 1:
                        phq = _b.sent();
                        return [2 /*return*/, phq.pop()];
                }
            });
        });
    }, getUserLastIpaqQuest: function (root, _a, ctx) {
        var userID = _a.userID;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, ipaq;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (userID && ctx.role === 'PATIENT') {
                            throw new apollo_server_1.ForbiddenError('Not Authorized');
                        }
                        userId = userID ? userID : ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().quests().ipaqs({ first: 1 })];
                    case 1:
                        ipaq = _b.sent();
                        return [2 /*return*/, ipaq.pop()];
                }
            });
        });
    } });
exports.QuestMutationsResolver = __assign(__assign({}, graphqlgen_1.MutationResolvers.defaultResolvers), { createPhq9Quest: function (root, _a, ctx) {
        var phq9Input = _a.phq9Input;
        return __awaiter(void 0, void 0, void 0, function () {
            var PHQ_LENGTH, userId, usersQuests, twoWeeks, score, isComplete, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        PHQ_LENGTH = 9;
                        userId = ctx.userId;
                        usersQuests = ctx.db.user({ id: userId }).patient().quests();
                        twoWeeks = moment().add(2, 'weeks');
                        score = questionnaires_1.QuestionnaireHelper.calculateScorePhq(phq9Input.answers.set);
                        isComplete = phq9Input.answers.set.filter(function (a) { return a > 0; }).length === PHQ_LENGTH;
                        tasks_1.taskScheduler.scheduleTask({
                            taskType: 'PUSH_NOTIFY_PHQ_REMINDER',
                            userId: userId
                        }, ctx.db);
                        _c = (_b = ctx.db).createPhq9;
                        _d = {
                            answers: phq9Input.answers,
                            score: score,
                            expiryDate: twoWeeks.toDate(),
                            isComplete: isComplete
                        };
                        _e = {};
                        _f = {};
                        return [4 /*yield*/, usersQuests.id()];
                    case 1: return [2 /*return*/, _c.apply(_b, [(_d.quests = (_e.connect = (_f.id = _g.sent(), _f), _e),
                                _d)])];
                }
            });
        });
    }, createIpaqQuest: function (root, _a, ctx) {
        var ipaqInput = _a.ipaqInput;
        return __awaiter(void 0, void 0, void 0, function () {
            var IPAQ_LENGTH, userId, usersQuests, isComplete, twoWeeks, score, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        IPAQ_LENGTH = 4;
                        userId = ctx.userId;
                        usersQuests = ctx.db.user({ id: userId }).patient().quests();
                        isComplete = ipaqInput.answers.create.filter(function (a) {
                            return a.numDays > 0 || a.numHours > 0 || a.numMinutes > 0;
                        }).length
                            === IPAQ_LENGTH;
                        twoWeeks = moment().add(2, 'weeks');
                        score = questionnaires_1.QuestionnaireHelper.calculateScoreIpaq(ipaqInput.answers.create);
                        logger_1.log.info('ipaq score: ' + score);
                        tasks_1.taskScheduler.scheduleTask({
                            taskType: 'PUSH_NOTIFY_IPAQ_REMINDER',
                            userId: userId
                        }, ctx.db);
                        logger_1.log.info('ipaq score ' + score);
                        _c = (_b = ctx.db).createIpaq;
                        _d = {
                            answers: { create: ipaqInput.answers.create },
                            score: score,
                            isComplete: isComplete,
                            expiryDate: twoWeeks.toDate()
                        };
                        _e = {};
                        _f = {};
                        return [4 /*yield*/, usersQuests.id()];
                    case 1: return [2 /*return*/, _c.apply(_b, [(_d.quests = (_e.connect = (_f.id = _g.sent(), _f), _e),
                                _d)])];
                }
            });
        });
    } });
exports.QuestSubscriptionResolver = __assign(__assign({}, graphqlgen_1.SubscriptionResolvers.defaultResolvers), { watchPhq9s: {
        subscribe: function (root, args, ctx) {
            var userId = ctx.userId;
            return ctx.db.$subscribe.phq9({
                mutation_in: ['CREATED', 'UPDATED'],
                node: { quests: { patient: { user: { id: userId } } } }
            }).node().quests().patient().user();
        },
        resolve: function (root) { return root; }
    }, watchIpaqs: {
        subscribe: function (root, args, ctx) {
            var userId = ctx.userId;
            return ctx.db.$subscribe.ipaq({
                mutation_in: ['CREATED', 'UPDATED'],
                node: { quests: { patient: { user: { id: userId } } } }
            }).node().quests().patient().user();
        },
        resolve: function (root) { return root; }
    } });
