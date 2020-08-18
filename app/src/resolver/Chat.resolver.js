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
exports.ChatSubscriptionResolver = exports.ChatMutationResolver = exports.ChatQueryResolver = void 0;
var graphqlgen_1 = require("../generated/graphqlgen");
var logger_1 = require("../logger");
var tasks_1 = require("./../tasks/tasks");
var createActivitiesBotReminderCount_task_1 = require("../tasks/createActivitiesBotReminderCount.task");
exports.ChatQueryResolver = __assign(__assign({}, graphqlgen_1.QueryResolvers.defaultResolvers), { getUsersChat: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ctx.db
                    .user({ id: ctx.userId })
                    .patient()
                    .buddy()
                    .chat()];
        });
    }); }, getUsersChatMessages: function (root, _a, ctx) {
        var orderBy = _a.orderBy, last = _a.last;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, myChat;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db
                                .user({ id: userId })
                                .patient()
                                .buddy()
                                .chat()];
                    case 1:
                        myChat = _b.sent();
                        return [2 /*return*/, myChat
                                ? ctx.db.chatMessages({
                                    where: { author: { id: userId } },
                                    orderBy: orderBy,
                                    last: last
                                })
                                : []];
                }
            });
        });
    } });
exports.ChatMutationResolver = {
    sendChatMessage: function (root, _a, ctx) {
        var text = _a.text;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, chatId, msg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        logger_1.log.info("sendChatMessage " + text);
                        return [4 /*yield*/, ctx.db
                                .user({ id: userId })
                                .patient()
                                .buddy()
                                .chat()
                                .id()];
                    case 1:
                        chatId = _b.sent();
                        return [4 /*yield*/, ctx.db.updateChat({
                                where: { id: chatId },
                                data: {
                                    messages: {
                                        create: {
                                            text: text,
                                            author: { connect: { id: userId } }
                                        }
                                    }
                                }
                            })];
                    case 2:
                        _b.sent();
                        // check if count for sending bot message is reached
                        return [4 /*yield*/, createActivitiesBotReminderCount_task_1.createActivitiesBotReminderCount.execute({ chatId: chatId }, ctx.db)];
                    case 3:
                        // check if count for sending bot message is reached
                        _b.sent();
                        // reschedule reminder on every message send
                        return [4 /*yield*/, tasks_1.taskScheduler.scheduleTask({ taskType: "BOT_REMIND_TO_CHAT", chatId: chatId }, ctx.db)];
                    case 4:
                        // reschedule reminder on every message send
                        _b.sent();
                        // send notification with [X timespan] delay for each chat message
                        return [4 /*yield*/, tasks_1.taskScheduler.scheduleChatNotification({
                                sendingUserId: userId,
                                chatId: chatId,
                                msgText: text
                            }, ctx.db)];
                    case 5:
                        // send notification with [X timespan] delay for each chat message
                        _b.sent();
                        return [4 /*yield*/, ctx.db.chat({ id: chatId }).messages({ last: 1 })];
                    case 6:
                        msg = (_b.sent()).pop();
                        // log.info(`Msg Date ${msg.createdAt}`);
                        return [2 /*return*/, msg];
                }
            });
        });
    },
    sendCalendarEventAsChatAttachment: function (root, _a, ctx) {
        var originalId = _a.originalId, createAttachment = _a.createAttachment, ownerId = _a.ownerId;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, chatId, msg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db
                                .user({ id: userId })
                                .patient()
                                .buddy()
                                .chat()
                                .id()];
                    case 1:
                        chatId = _b.sent();
                        logger_1.log.info("sendCalendarEventAsChatAttachment " + originalId);
                        return [4 /*yield*/, ctx.db.updateChat({
                                where: { id: chatId },
                                data: {
                                    messages: {
                                        create: {
                                            author: { connect: { id: userId } },
                                            attachment: {
                                                create: {
                                                    calendarEntry: {
                                                        create: createAttachment
                                                    },
                                                    originalCalendarEntryId: originalId,
                                                    ownerId: ownerId
                                                }
                                            }
                                        }
                                    }
                                }
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, ctx.db.chat({ id: chatId }).messages({ last: 1 })];
                    case 3:
                        msg = (_b.sent()).pop();
                        // log.info(`Msg Date ${msg.createdAt}`);
                        return [2 /*return*/, msg];
                }
            });
        });
    },
    setOnline: function (root, args, ctx) {
        var userId = ctx.userId;
        return ctx.db.updateUser({
            data: { patient: { update: { online: true } } },
            where: { id: userId }
        });
    },
    setOffline: function (root, args, ctx) {
        var userId = ctx.userId;
        return ctx.db.updateUser({
            data: { patient: { update: { online: false } } },
            where: { id: userId }
        });
    },
    deleteChat: function (root, _a, ctx) {
        var id = _a.id;
        return ctx.db.deleteChat({ id: id });
    }
    // botSendChatMessage: async (root, { text, userId }, ctx: Context) => {
    //   const chatId = await ctx.db.user({ id: userId }).buddy().chat().id();
    //   const botId = await ctx.db.user({ id: userId }).buddy().chat().bot().id();
    //   return (await ctx.db.updateChat({
    //     where: { id: chatId },
    //     data: {
    //       messages: {
    //         create: {
    //           text,
    //           authorBot: {
    //             connect: {
    //               id: botId,
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }).messages({ last: 1 })).pop();
    // },
};
exports.ChatSubscriptionResolver = __assign(__assign({}, graphqlgen_1.SubscriptionResolvers.defaultResolvers), { watchChatMessages: {
        subscribe: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var userId, myChatID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db
                                .user({ id: userId })
                                .patient()
                                .buddy()
                                .chat()
                                .id()];
                    case 1:
                        myChatID = _a.sent();
                        return [2 /*return*/, ctx.db.$subscribe
                                .chatMessage({
                                mutation_in: ["CREATED" /*, 'UPDATED'*/],
                                node: {
                                    chat: { id: myChatID }
                                    // author: {id_not: userId}
                                }
                            })
                                .node()];
                }
            });
        }); },
        resolve: function (parent, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // log.info('Chat Subscription triggered ' + parent.text);
                // const chatId = await ctx.db.chatMessage({ id: parent.id }).chat().id();
                // let authorId = await ctx.db.chatMessage({ id: parent.id }).author().id();
                // if (!authorId) {
                //   authorId = await ctx.db.chatMessage({ id: parent.id }).authorBot().id();
                // }
                // taskScheduler.scheduleChatNotification({
                //   type: 'PUSH_NEW_CHAT_MESSAGE',
                //   userId: authorId,
                //   chatId: chatId,
                // }, parent, ctx);
                return [2 /*return*/, parent];
            });
        }); }
    } });
