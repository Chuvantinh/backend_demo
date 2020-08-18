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
exports.phqReminderPush = void 0;
var tasks_1 = require("./tasks");
var logger_1 = require("../logger");
var moment = require("moment");
var NotificationService_1 = require("../services/notification/NotificationService");
var PhqReminderPush = /** @class */ (function () {
    function PhqReminderPush() {
    }
    PhqReminderPush.prototype.setup = function (args, db, timer) {
        return __awaiter(this, void 0, void 0, function () {
            var oldTask, scheduleTime, st, dbTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args.userId) {
                            logger_1.logT.error("Missing Argument in PhqReminderPush", Error);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, db.scheduledTasks({
                                where: {
                                    taskType: args.taskType,
                                    userId: args.userId
                                }
                            })];
                    case 1:
                        oldTask = (_a.sent())[0];
                        if (!oldTask) return [3 /*break*/, 3];
                        return [4 /*yield*/, db.deleteScheduledTask({ id: oldTask.id })];
                    case 2:
                        _a.sent();
                        if (timer.get(oldTask.id)) {
                            try {
                                timer.remove(oldTask.id);
                            }
                            catch (error) {
                                logger_1.logT.error("Can not remove non existing Task: PhqReminderPush", error);
                            }
                        }
                        _a.label = 3;
                    case 3:
                        scheduleTime = moment().add(2, "weeks");
                        st = {
                            taskType: args.taskType,
                            userId: args.userId,
                            scheduledFor: scheduleTime.toDate()
                        };
                        return [4 /*yield*/, db.createScheduledTask(st)];
                    case 4:
                        dbTask = _a.sent();
                        logger_1.logT.info("Scheduling PUSH_NOTIFY_PHQ_REMINDER for " + scheduleTime.toISOString());
                        return [2 /*return*/, this.schedule(dbTask, db)];
                }
            });
        });
    };
    PhqReminderPush.prototype.schedule = function (dbTask, db) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                t = {
                    id: dbTask.id,
                    removeOnCompleted: true,
                    totalRuns: 1,
                    startDate: moment(dbTask.scheduledFor).toDate(),
                    callback: function (task, done) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                exports.phqReminderPush.execute(dbTask, db);
                                done();
                                return [2 /*return*/];
                            });
                        });
                    }
                };
                return [2 /*return*/, t];
            });
        });
    };
    PhqReminderPush.prototype.condition = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    PhqReminderPush.prototype.execute = function (task, db) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = db.user({ id: task.userId });
                        NotificationService_1.notification.sendPushNotification({
                            type: task.taskType,
                            receiver: user,
                            sender: "SYSTEM"
                        });
                        return [4 /*yield*/, tasks_1.taskScheduler.scheduleTask(__assign({ taskType: "PUSH_NOTIFY_PHQ_REMINDER_FOLLOWUP" }, task), db)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PhqReminderPush;
}());
exports.phqReminderPush = new PhqReminderPush();
