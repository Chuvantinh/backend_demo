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
exports.taskScheduler = void 0;
var tasktimer_1 = require("tasktimer");
var moment = require("moment");
var logger_1 = require("../logger");
var env_config_1 = require("../config/env.config");
var NotificationService_1 = require("../services/notification/NotificationService");
var remindToChat_task_1 = require("./remindToChat.task");
var createActivitiesBotReminder_task_1 = require("./createActivitiesBotReminder.task");
var plannedActivitiesLowBotTask_task_1 = require("./plannedActivitiesLowBotTask.task");
var notEnoughActivitiesUserPush_task_1 = require("./notEnoughActivitiesUserPush.task");
var notEnoughActivitiesBuddyPush_task_1 = require("./notEnoughActivitiesBuddyPush.task");
var tooMuchActivitiesBuddyPush_task_1 = require("./tooMuchActivitiesBuddyPush.task");
var buddyRequestDestruction_task_1 = require("./buddyRequestDestruction.task");
var ipaqReminderPush_task_1 = require("./ipaqReminderPush.task");
var ipaqReminderFollowupPush_task_1 = require("./ipaqReminderFollowupPush.task");
var phqReminderPush_task_1 = require("./phqReminderPush.task");
var missedActivityBuddyPush_task_1 = require("./missedActivityBuddyPush.task");
var phqReminderFollowupPush_task_1 = require("./phqReminderFollowupPush.task");
var createActivitiesBotReminderCount_task_1 = require("./createActivitiesBotReminderCount.task");
var botWelcomeMessage_task_1 = require("./botWelcomeMessage.task");
var autoMatch_task_1 = require("./autoMatch.task");
var TaskScheduler = /** @class */ (function () {
    function TaskScheduler() {
        this.timer = new tasktimer_1.TaskTimer(env_config_1.TASK_TICK_INTERVAL_MS);
        this.timer.start();
        logger_1.logT.info("TASK timer Started!");
    }
    TaskScheduler.prototype.scheduleTask = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            var tsk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setupTasks(args, db)];
                    case 1:
                        tsk = _a.sent();
                        if (tsk) {
                            this.timer.add(tsk);
                        }
                        logger_1.logT.info("Task Count is now: " + this.timer.taskCount);
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskScheduler.prototype.restoreTasks = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            var tsk, _i, tsk_1, t, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.scheduledTasks()];
                    case 1:
                        tsk = _a.sent();
                        logger_1.logT.info("restoring " + tsk.length + " tasks");
                        _i = 0, tsk_1 = tsk;
                        _a.label = 2;
                    case 2:
                        if (!(_i < tsk_1.length)) return [3 /*break*/, 5];
                        t = tsk_1[_i];
                        return [4 /*yield*/, this.setupTasks(t, db)];
                    case 3:
                        task = _a.sent();
                        if (task) {
                            this.timer.add(task);
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TaskScheduler.prototype.setupTasks = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (args.taskType) {
                    // TODO Implement open request reminders
                    // PUSH_NOTIFY_INCOMING_BUDDY_REQUEST_REMINDER, //after 24h
                    // PUSH_NOTIFY_INCOMING_BUDDY_REQUEST_REMINDER_FOLLOWUP, //after 46h
                    case "SYSTEM_SCHEDULE_REQUEST_DESTRUCTION":
                        return [2 /*return*/, buddyRequestDestruction_task_1.buddyRequestDestruction.setup(args, db)];
                    case "SYSTEM_AUTO_MATCH":
                        return [2 /*return*/, autoMatch_task_1.autoMatch.setup(args, db)];
                    case "BOT_WELCOME_MESSAGE":
                        return [2 /*return*/, botWelcomeMessage_task_1.botWelcomeMessage.setup(args, db)];
                    case "BOT_REMIND_TO_CHAT":
                        return [2 /*return*/, remindToChat_task_1.remindToChatTask.setup(args, db, this.timer)];
                    case "BOT_INTRODUCTION_CREATE_ACTIVITIES_TIME":
                        return [2 /*return*/, createActivitiesBotReminder_task_1.createActivitiesBotReminder.setup(args, db)];
                    case "BOT_INTRODUCTION_CREATE_ACTIVITIES_COUNT":
                        // special case: needs no timed task
                        createActivitiesBotReminderCount_task_1.createActivitiesBotReminderCount.execute(args, db);
                    case "BOT_PLANNED_ACTIVITIES_LOW":
                        return [2 /*return*/, plannedActivitiesLowBotTask_task_1.plannedActivitiesLowBot.setup(args, db, this.timer)];
                    case "PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER":
                        return [2 /*return*/, notEnoughActivitiesUserPush_task_1.notEnoughActivitiesUserPush.setup(args, db)];
                    case "PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY":
                        return [2 /*return*/, notEnoughActivitiesBuddyPush_task_1.notEnoughActivitiesBuddyPush.setup(args, db)];
                    // case 'PUSH_NOTIFY_TO_MUCH_ACTIVITIES_USER':
                    //   return this.pushNotifyToMuchActivitiesUserSchedule(args, ctx);
                    case "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY":
                        return [2 /*return*/, tooMuchActivitiesBuddyPush_task_1.tooMuchActivitiesBuddy.setup(args, db, this.timer)];
                    case "PUSH_NOTIFY_IPAQ_REMINDER":
                        return [2 /*return*/, ipaqReminderPush_task_1.ipaqReminderPush.setup(args, db, this.timer)];
                    case "PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP":
                        return [2 /*return*/, ipaqReminderFollowupPush_task_1.ipaqReminderFollowupPush.setup(args, db, this.timer)];
                    case "PUSH_NOTIFY_PHQ_REMINDER":
                        return [2 /*return*/, phqReminderPush_task_1.phqReminderPush.setup(args, db, this.timer)];
                    case "PUSH_NOTIFY_PHQ_REMINDER_FOLLOWUP":
                        return [2 /*return*/, phqReminderFollowupPush_task_1.phqReminderPushFollowup.setup(args, db, this.timer)];
                    case "PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY":
                        return [2 /*return*/, missedActivityBuddyPush_task_1.missedActivityBuddyPush.setup(args, db, this.timer)];
                    default:
                        logger_1.logT.error("Unknown Task Type", Error);
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    // setup reoccurring tasks for user and buddy after matching
    TaskScheduler.prototype.setupAfterMatchTasks = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                            taskType: 'BOT_WELCOME_MESSAGE',
                            chatId: args.chatId
                        }, db)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'BOT_INTRODUCTION_CREATE_ACTIVITIES_TIME',
                                chatId: args.chatId
                            }, db)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'BOT_INTRODUCTION_CREATE_ACTIVITIES_COUNT',
                                chatId: args.chatId
                            }, db)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'BOT_REMIND_TO_CHAT',
                                chatId: args.chatId
                            }, db)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'BOT_PLANNED_ACTIVITIES_LOW',
                                chatId: args.chatId,
                                userId: args.userId
                            }, db)];
                    case 5:
                        _a.sent();
                        // remind this user about own activities
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER',
                                userId: args.userId
                            }, db)];
                    case 6:
                        // remind this user about own activities
                        _a.sent();
                        // remind this user about buddy activities
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY',
                                userId: args.userId
                            }, db)];
                    case 7:
                        // remind this user about buddy activities
                        _a.sent();
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY',
                                userId: args.userId
                            }, db)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.setupAfterMatchTasksBuddy(args, db)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskScheduler.prototype.setupAfterMatchTasksBuddy = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            var buddyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .user({ id: args.userId })
                            .patient()
                            .buddy()
                            .patient()
                            .user().id()];
                    case 1:
                        buddyId = _a.sent();
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY',
                                userId: buddyId
                            }, db)];
                    case 2:
                        _a.sent();
                        // remind this users buddy about buddys (this user) activities
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY',
                                userId: buddyId
                            }, db)];
                    case 3:
                        // remind this users buddy about buddys (this user) activities
                        _a.sent();
                        // remind this users buddy about own activities
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER',
                                userId: buddyId
                            }, db)];
                    case 4:
                        // remind this users buddy about own activities
                        _a.sent();
                        return [4 /*yield*/, exports.taskScheduler.scheduleTask({
                                taskType: 'BOT_PLANNED_ACTIVITIES_LOW',
                                chatId: args.chatId,
                                userId: buddyId
                            }, db)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskScheduler.prototype.deleteTasksAfterUnlink = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, ids_1, i;
            return __generator(this, function (_a) {
                for (_i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    i = ids_1[_i];
                    if (this.timer.get(i)) {
                        this.timer.remove(i);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    TaskScheduler.prototype.scheduleChatNotification = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!args.chatId) {
                            logger_1.logT.error("Missing ChatID in scheduleChatNotification", Error);
                            return [2 /*return*/];
                        }
                        if (!args.msgText) {
                            logger_1.logT.error("Missing MessageText in scheduleChatNotification", Error);
                            return [2 /*return*/];
                        }
                        _b = (_a = this.timer).add;
                        return [4 /*yield*/, this.scheduleChatMessagePush(args, db)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskScheduler.prototype.scheduleChatMessagePush = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            var chatUsers, sender, senderName, time, pushTasks, _loop_1, _i, chatUsers_1, receiver;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.users({
                            where: { patient: { buddy: { chat: { id: args.chatId } } } }
                        })];
                    case 1:
                        chatUsers = _a.sent();
                        sender = chatUsers.find(function (u) { return u.id === args.sendingUserId; });
                        chatUsers = chatUsers.filter(function (u) { return u.id !== args.sendingUserId; });
                        senderName = sender ? sender.username : undefined;
                        if (!!senderName) return [3 /*break*/, 3];
                        return [4 /*yield*/, db
                                .chat({ id: args.chatId })
                                .bot()
                                .name()];
                    case 2:
                        senderName = _a.sent();
                        _a.label = 3;
                    case 3:
                        logger_1.logT.info("Schedule ChatMessagePush from " + senderName);
                        time = moment().add({ seconds: 2 });
                        pushTasks = Array();
                        logger_1.logT.info("Schedule for " + chatUsers.length + " Users \n      - " + logger_1.logFormat(chatUsers.map(function (u) { return u.username; })));
                        _loop_1 = function (receiver) {
                            var st, tId, receiverPromise, t;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        st = {
                                            taskType: "PUSH_NOTIFY_NEW_CHAT_MESSAGE",
                                            chatId: args.chatId,
                                            userId: receiver.id
                                        };
                                        return [4 /*yield*/, db.createScheduledTask(st).id()];
                                    case 1:
                                        tId = _a.sent();
                                        receiverPromise = db.user({ id: receiver.id });
                                        t = {
                                            id: tId,
                                            removeOnCompleted: true,
                                            totalRuns: 1,
                                            startDate: time.toDate(),
                                            callback: function (task, done) {
                                                return __awaiter(this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                NotificationService_1.notification.sendChatNotificationToUser(senderName, receiverPromise, args.msgText);
                                                                return [4 /*yield*/, db.deleteScheduledTask({ id: tId })];
                                                            case 1:
                                                                _a.sent();
                                                                done();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                });
                                            }
                                        };
                                        pushTasks.push(t);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, chatUsers_1 = chatUsers;
                        _a.label = 4;
                    case 4:
                        if (!(_i < chatUsers_1.length)) return [3 /*break*/, 7];
                        receiver = chatUsers_1[_i];
                        return [5 /*yield**/, _loop_1(receiver)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, pushTasks];
                }
            });
        });
    };
    TaskScheduler.prototype.sendScheduledBotMessage = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            var chatExits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chatExits = db.$exists.chat({ id: args.chatId });
                        if (!chatExits) return [3 /*break*/, 2];
                        return [4 /*yield*/, db.updateChat({
                                where: { id: args.chatId },
                                data: {
                                    messages: {
                                        create: {
                                            text: args.msgText,
                                            authorBot: {
                                                connect: {
                                                    id: args.botId
                                                }
                                            }
                                        }
                                    }
                                }
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!args.taskId) return [3 /*break*/, 4];
                        return [4 /*yield*/, db.deleteScheduledTask({ id: args.taskId })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!chatExits) return [3 /*break*/, 6];
                        return [4 /*yield*/, exports.taskScheduler.scheduleChatNotification({
                                chatId: args.chatId,
                                sendingUserId: args.botId,
                                msgText: args.msgText
                            }, db)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return TaskScheduler;
}());
exports.taskScheduler = new TaskScheduler();
