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
exports.MatchingSubscriptionResolver = exports.MatchingMutationResolver = exports.MatchingQueryResolver = void 0;
var graphqlgen_1 = require("../generated/graphqlgen");
var logger_1 = require("../logger");
var MatchingHelper_1 = require("../services/MatchingHelper");
var NotificationService_1 = require("../services/notification/NotificationService");
var apollo_server_1 = require("apollo-server");
var tasks_1 = require("../tasks/tasks");
exports.MatchingQueryResolver = __assign(__assign({}, graphqlgen_1.QueryResolvers.defaultResolvers), { getMatchingBuddies: function (root, _a, ctx) {
        var userId = _a.userId, percentageCap = _a.percentageCap, limit = _a.limit;
        return __awaiter(void 0, void 0, void 0, function () {
            var settings, matcher, matchingResults, matchingResultLimited;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (ctx.role !== 'ADMIN' && userId) {
                            throw new apollo_server_1.ForbiddenError('Not Authorized');
                        }
                        if (!userId) {
                            userId = ctx.userId;
                        }
                        return [4 /*yield*/, ctx.db.globalSettings({ id: ctx.settingsId })];
                    case 1:
                        settings = _b.sent();
                        matcher = new MatchingHelper_1.MatchingHelper(settings);
                        return [4 /*yield*/, matcher.findMatches(userId, ctx.db)];
                    case 2:
                        matchingResults = _b.sent();
                        logger_1.log.info('MATCHING - matchingResults ' + matchingResults.length);
                        matchingResultLimited = matchingResults.slice(0, matchingResults.length < 9 ? matchingResults.length : 9);
                        return [2 /*return*/, matchingResultLimited];
                }
            });
        });
    }, getAllBuddyRequests: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, pId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = ctx.userId;
                    return [4 /*yield*/, ctx.db.user({ id: userId }).patient().id()];
                case 1:
                    pId = _a.sent();
                    // return await ctx.db.user({ id: userId }).patient().buddyRequests();
                    logger_1.log.info('getAllBuddyRequests ' + pId);
                    return [4 /*yield*/, ctx.db.buddyRequests({
                            where: {
                                OR: [
                                    { from: { id: pId } },
                                    { to: { id: pId } }
                                ]
                            }
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, getBuddyRequestsCount: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, pId, requests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = ctx.userId;
                    return [4 /*yield*/, ctx.db.user({ id: userId }).patient().id()];
                case 1:
                    pId = _a.sent();
                    return [4 /*yield*/, ctx.db.buddyRequests({
                            where: {
                                OR: [
                                    { from: { id: pId } },
                                    { to: { id: pId } }
                                ],
                                state_not: "REMOVED"
                            }
                        })];
                case 2:
                    requests = _a.sent();
                    return [2 /*return*/, requests.length];
            }
        });
    }); } });
exports.MatchingMutationResolver = {
    // old matching system - buddy has to actively confirm request
    sendBuddyRequest: function (root, _a, ctx) {
        var requestToUserId = _a.requestToUserId;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, user, pid, existingReq, buddy, buddyPatId, buddyRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId })];
                    case 1:
                        user = _b.sent();
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().id()];
                    case 2:
                        pid = _b.sent();
                        return [4 /*yield*/, ctx.db.buddyRequests({ where: { from: { id: pid } } })];
                    case 3:
                        existingReq = _b.sent();
                        // // Abort if user has is existing request
                        if (existingReq.some(function (e) { return e.state === 'SEND'; })) {
                            throw new apollo_server_1.UserInputError('Existing Open Buddy Request found');
                        }
                        buddy = ctx.db.user({ id: requestToUserId });
                        return [4 /*yield*/, ctx.db.user({ id: requestToUserId }).patient().id()];
                    case 4:
                        buddyPatId = _b.sent();
                        // request now occur between patients - NOT users
                        logger_1.log.info('Buddy Request from ' + pid + ' to ' + buddyPatId);
                        return [4 /*yield*/, ctx.db.createBuddyRequest({
                                from: { connect: { id: pid } },
                                to: { connect: { id: buddyPatId } },
                                state: 'SEND'
                            })];
                    case 5:
                        buddyRequest = _b.sent();
                        NotificationService_1.notification.sendPushNotification({
                            type: 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST',
                            receiver: buddy,
                            sender: user
                        });
                        // destroy request after 48h
                        tasks_1.taskScheduler.scheduleTask({
                            taskType: 'SYSTEM_SCHEDULE_REQUEST_DESTRUCTION',
                            buddyRequestId: buddyRequest.id,
                            userId: userId
                        }, ctx.db);
                        // send to notification to Potential Buddy
                        // NOT Implemented because of upcoming changes in Buddy Matching
                        // taskScheduler.scheduleTask({
                        //   taskType: 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST',
                        //   buddyRequestId: buddyRequest.id,
                        //   userId
                        // }, ctx.db);
                        return [2 /*return*/, buddyRequest.id];
                }
            });
        });
    },
    // new matching system - buddy auto confirms request if there is an existing request
    sendBuddyRequests: function (root, _a, ctx) {
        var requestToUserIds = _a.requestToUserIds;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, user, pid, settings, matcher, match, patientBuddy, chat, requestedBuddys, _i, requestToUserIds_1, id, buddy, buddyPatId, buddyRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId })];
                    case 1:
                        user = _b.sent();
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().id()];
                    case 2:
                        pid = _b.sent();
                        return [4 /*yield*/, ctx.db.globalSettings({ id: ctx.settingsId })];
                    case 3:
                        settings = _b.sent();
                        matcher = new MatchingHelper_1.MatchingHelper(settings);
                        return [4 /*yield*/, matcher.getOverlapMatch(userId, requestToUserIds, ctx.db)];
                    case 4:
                        match = _b.sent();
                        if (!match) return [3 /*break*/, 7];
                        return [4 /*yield*/, ctx.db.user({ id: match.user.id }).patient()];
                    case 5:
                        patientBuddy = _b.sent();
                        return [4 /*yield*/, MatchingHelper_1.matchUp(true, pid, patientBuddy.id, ctx.db)];
                    case 6:
                        chat = _b.sent();
                        return [2 /*return*/, true];
                    case 7:
                        requestedBuddys = new Array();
                        _i = 0, requestToUserIds_1 = requestToUserIds;
                        _b.label = 8;
                    case 8:
                        if (!(_i < requestToUserIds_1.length)) return [3 /*break*/, 13];
                        id = requestToUserIds_1[_i];
                        return [4 /*yield*/, ctx.db.user({ id: id })];
                    case 9:
                        buddy = _b.sent();
                        return [4 /*yield*/, ctx.db.user({ id: id }).patient().id()];
                    case 10:
                        buddyPatId = _b.sent();
                        // request now occur between patients - NOT users
                        logger_1.log.info('Buddy Request from ' + pid + ' to ' + buddyPatId);
                        return [4 /*yield*/, ctx.db.createBuddyRequest({
                                from: { connect: { id: pid } },
                                to: { connect: { id: buddyPatId } },
                                state: 'SEND'
                            })];
                    case 11:
                        buddyRequest = _b.sent();
                        requestedBuddys.push(buddyRequest);
                        // notification.sendPushNotification({
                        //   type: 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST',
                        //   receiver: buddy,
                        //   sender: user,
                        // });
                        // destroy request after 48h
                        tasks_1.taskScheduler.scheduleTask({
                            taskType: 'SYSTEM_SCHEDULE_REQUEST_DESTRUCTION',
                            buddyRequestId: buddyRequest.id,
                            userId: userId
                        }, ctx.db);
                        _b.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 8];
                    case 13:
                        // auto match if no user generated match is possible
                        tasks_1.taskScheduler.scheduleTask({
                            taskType: 'SYSTEM_AUTO_MATCH',
                            userId: userId
                        }, ctx.db);
                        return [2 /*return*/, false];
                }
            });
        });
    },
    // old request system - no response needed in new system
    sendBuddyResponse: function (root, _a, ctx) {
        var accepted = _a.accepted, newBuddyPatientId = _a.newBuddyPatientId;
        return __awaiter(void 0, void 0, void 0, function () {
            var patientId, req, chat, usersBuddy, buddiesBuddy;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ctx.db.user({ id: ctx.userId }).patient().id()];
                    case 1:
                        patientId = _b.sent();
                        return [4 /*yield*/, ctx.db.buddyRequests({
                                where: {
                                    from: { id: newBuddyPatientId },
                                    to: { id: patientId }
                                }
                            })];
                    case 2:
                        req = (_b.sent()).pop();
                        if (!!accepted) return [3 /*break*/, 4];
                        return [4 /*yield*/, ctx.db.updateBuddyRequest({
                                where: { id: req.id },
                                data: { state: 'DENIED' }
                            })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, ctx.db.updateBuddyRequest({
                            where: { id: req.id },
                            data: { state: 'CONFIRMED' }
                        })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, ctx.db.createChat({
                                bot: { create: { name: 'roBot' } }
                            })];
                    case 6:
                        chat = _b.sent();
                        return [4 /*yield*/, ctx.db.createBuddy({
                                patient: { connect: { id: newBuddyPatientId } },
                                chat: { connect: chat }
                            })
                            // link this users buddy with other users buddy
                        ];
                    case 7:
                        usersBuddy = _b.sent();
                        // link this users buddy with other users buddy
                        return [4 /*yield*/, ctx.db.updatePatient({
                                where: { id: patientId },
                                data: { buddy: { connect: usersBuddy } }
                            })
                            // create buddy for requesting user
                        ];
                    case 8:
                        // link this users buddy with other users buddy
                        _b.sent();
                        return [4 /*yield*/, ctx.db.createBuddy({
                                patient: { connect: { id: patientId } },
                                chat: { connect: chat }
                            })
                            // link others users buddy with this users buddy 
                        ];
                    case 9:
                        buddiesBuddy = _b.sent();
                        // link others users buddy with this users buddy 
                        return [4 /*yield*/, ctx.db.updatePatient({
                                where: { id: newBuddyPatientId },
                                data: { buddy: { connect: buddiesBuddy } }
                            })
                            // create tasks
                        ];
                    case 10:
                        // link others users buddy with this users buddy 
                        _b.sent();
                        // create tasks
                        tasks_1.taskScheduler.setupAfterMatchTasks({
                            chatId: chat.id,
                            userId: ctx.userId
                        }, ctx.db);
                        return [2 /*return*/, chat];
                }
            });
        });
    },
    removeBuddyRequest: function (root, _a, ctx) {
        var reqId = _a.reqId;
        return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ctx.db.updateBuddyRequest({
                            where: { id: reqId },
                            data: { state: 'REMOVED' }
                        }).id()];
                    case 1:
                        id = _b.sent();
                        return [2 /*return*/, id];
                }
            });
        });
    },
    adminLinkBuddies: function (root, _a, ctx) {
        var userId = _a.userId, buddyId = _a.buddyId;
        return __awaiter(void 0, void 0, void 0, function () {
            var patientHasBuddy, buddyHasBuddy, patientId, buddyPatientId, buddyRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (ctx.role !== 'ADMIN') {
                            throw new apollo_server_1.ForbiddenError('Not Authorized');
                        }
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().buddy()];
                    case 1:
                        patientHasBuddy = _b.sent();
                        return [4 /*yield*/, ctx.db.user({ id: buddyId }).patient().buddy()];
                    case 2:
                        buddyHasBuddy = _b.sent();
                        if (patientHasBuddy || buddyHasBuddy) {
                            throw new apollo_server_1.ValidationError('Unable to Link users - one already has buddy');
                        }
                        return [4 /*yield*/, ctx.db.user({ id: buddyId }).patient().id()];
                    case 3:
                        patientId = _b.sent();
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().id()];
                    case 4:
                        buddyPatientId = _b.sent();
                        return [4 /*yield*/, ctx.db.createBuddyRequest({
                                from: { connect: { id: patientId } },
                                to: { connect: { id: buddyPatientId } },
                                state: 'SEND'
                            })];
                    case 5:
                        buddyRequest = _b.sent();
                        return [4 /*yield*/, MatchingHelper_1.matchUp(true, patientId, buddyPatientId, ctx.db)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    }
};
exports.MatchingSubscriptionResolver = __assign(__assign({}, graphqlgen_1.SubscriptionResolvers.defaultResolvers), { watchBuddyRequests: {
        subscribe: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var pId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.db.user({ id: ctx.userId }).patient().id()];
                    case 1:
                        pId = _a.sent();
                        return [2 /*return*/, ctx.db.$subscribe.buddyRequest({
                                mutation_in: ['CREATED', 'UPDATED'],
                                node: {
                                    OR: [
                                        { from: { id: pId } },
                                        { to: { id: pId } }
                                    ]
                                }
                            }).node()];
                }
            });
        }); },
        resolve: function (root) { return root; }
    } });
