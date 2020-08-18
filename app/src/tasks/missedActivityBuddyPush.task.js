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
exports.missedActivityBuddyPush = void 0;
var tasks_1 = require("./tasks");
var logger_1 = require("../logger");
var moment = require("moment");
var global_settings_1 = require("../global_settings/global.settings");
var NotificationService_1 = require("../services/notification/NotificationService");
var MissedActivityBuddyPush = /** @class */ (function () {
    function MissedActivityBuddyPush() {
    }
    MissedActivityBuddyPush.prototype.setup = function (args, db, timer) {
        return __awaiter(this, void 0, void 0, function () {
            var taskId, dbTask, settingsId, pushSettingsId, time, scheduleTime, now, st;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args.userId) {
                            logger_1.logT.error("Missing Argument in scheduleNotifyMissedActivity", Error);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, db.scheduledTasks({
                                where: {
                                    taskType: args.taskType,
                                    userId: args.userId
                                }
                            })];
                    case 1:
                        dbTask = (_a.sent())[0];
                        if (dbTask) {
                            if (timer.get(dbTask.id)) {
                                timer.remove(dbTask.id);
                            }
                            taskId = dbTask.id;
                        }
                        return [4 /*yield*/, global_settings_1.getGlobalSettingsId(db)];
                    case 2:
                        settingsId = _a.sent();
                        return [4 /*yield*/, db
                                .globalSettings({ id: settingsId })
                                .webPushSettings()
                                .id()];
                    case 3:
                        pushSettingsId = _a.sent();
                        return [4 /*yield*/, db
                                .webPushSettings({ id: pushSettingsId })
                                .webPushActivityMissedBuddyDelay()];
                    case 4:
                        time = _a.sent();
                        scheduleTime = moment()
                            .startOf("day")
                            .add({
                            hours: time.hours,
                            minutes: time.minutes
                        });
                        now = moment();
                        if (now > scheduleTime) {
                            scheduleTime.add(1, "day");
                        }
                        st = {
                            taskType: args.taskType,
                            userId: args.userId,
                            scheduledFor: scheduleTime.toDate()
                        };
                        if (!!dbTask) return [3 /*break*/, 6];
                        return [4 /*yield*/, db.createScheduledTask(st)];
                    case 5:
                        dbTask = _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, db.updateScheduledTask({
                            where: { id: dbTask.id },
                            data: st
                        })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        logger_1.logT.info("Scheduling PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY for " + scheduleTime.toISOString());
                        return [2 /*return*/, this.schedule(dbTask, db)];
                }
            });
        });
    };
    MissedActivityBuddyPush.prototype.schedule = function (dbTask, db) {
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
                            var condition;
                            return __generator(this, function (_a) {
                                condition = exports.missedActivityBuddyPush.condition(dbTask, db);
                                if (condition) {
                                    exports.missedActivityBuddyPush.execute(dbTask, db);
                                }
                                // recursively schedule for next day at (23:50)
                                tasks_1.taskScheduler.scheduleTask(dbTask, db);
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
    MissedActivityBuddyPush.prototype.condition = function (task, db) {
        return __awaiter(this, void 0, void 0, function () {
            var start, end, ce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = moment()
                            .startOf("day")
                            .toDate();
                        end = moment()
                            .startOf("day")
                            .set({ hours: 23, minutes: 50 })
                            .toDate();
                        return [4 /*yield*/, db
                                .user({ id: task.userId })
                                .patient()
                                .calendarEntries({
                                where: {
                                    AND: [
                                        { startTime_gte: start },
                                        { startTime_lte: end },
                                        { isDone: false }
                                    ]
                                }
                            })];
                    case 1:
                        ce = _a.sent();
                        return [2 /*return*/, (ce && ce.length > 0)];
                }
            });
        });
    };
    MissedActivityBuddyPush.prototype.execute = function (task, db) {
        return __awaiter(this, void 0, void 0, function () {
            var buddy;
            return __generator(this, function (_a) {
                buddy = db
                    .user({ id: task.userId })
                    .patient()
                    .buddy()
                    .patient()
                    .user();
                NotificationService_1.notification.sendPushNotification({
                    type: task.taskType,
                    receiver: buddy,
                    sender: "SYSTEM"
                });
                return [2 /*return*/];
            });
        });
    };
    return MissedActivityBuddyPush;
}());
exports.missedActivityBuddyPush = new MissedActivityBuddyPush();
