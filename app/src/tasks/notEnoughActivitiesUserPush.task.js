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
exports.notEnoughActivitiesUserPush = void 0;
var tasks_1 = require("./tasks");
var logger_1 = require("../logger");
var moment = require("moment");
var global_settings_1 = require("../global_settings/global.settings");
var NotificationService_1 = require("../services/notification/NotificationService");
var sharedConditions_1 = require("./sharedConditions");
var NotEnoughActivitiesUserPush = /** @class */ (function () {
    function NotEnoughActivitiesUserPush() {
    }
    NotEnoughActivitiesUserPush.prototype.setup = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            var dbTask, st, settingsId, pushSettingsId, weekday, scheduleTime, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args.userId) {
                            logger_1.logT.error("Missing Argument in pushNotifyNotEnoughActivitiesUserSchedule", Error);
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
                        if (!!dbTask) return [3 /*break*/, 3];
                        st = {
                            taskType: args.taskType,
                            userId: args.userId
                        };
                        return [4 /*yield*/, db.createScheduledTask(st)];
                    case 2:
                        dbTask = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, global_settings_1.getGlobalSettingsId(db)];
                    case 4:
                        settingsId = _a.sent();
                        return [4 /*yield*/, db
                                .globalSettings({ id: settingsId })
                                .webPushSettings()
                                .id()];
                    case 5:
                        pushSettingsId = _a.sent();
                        return [4 /*yield*/, db
                                .webPushSettings({ id: pushSettingsId })
                                .webPushNotEnoughActivitiesWeekday()];
                    case 6:
                        weekday = _a.sent();
                        scheduleTime = moment().startOf("week").add(weekday, "days");
                        // not specified but schedule message for 18:00h
                        scheduleTime.set({ hour: 18, minute: 0 });
                        now = moment();
                        if (now > moment().startOf("week").add(weekday, "days").set({ hour: 18, minute: 0 })) {
                            scheduleTime.add(1, "week");
                        }
                        logger_1.logT.info("Scheduling PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER message for " + scheduleTime.toISOString());
                        return [4 /*yield*/, db.updateScheduledTask({
                                where: { id: dbTask.id },
                                data: { scheduledFor: scheduleTime.toDate() }
                            })];
                    case 7:
                        // const buddy = await db.user({ id: args.userId }).patient().buddy().patient().user();
                        dbTask = _a.sent();
                        return [2 /*return*/, this.schedule(dbTask, db)];
                }
            });
        });
    };
    NotEnoughActivitiesUserPush.prototype.schedule = function (dbTask, db) {
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
                            var shouldExecute;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, exports.notEnoughActivitiesUserPush.condition(dbTask, db)];
                                    case 1:
                                        shouldExecute = _a.sent();
                                        logger_1.logT.info("pushNotifyNotEnoughActivitiesUserSchedule is " + shouldExecute);
                                        if (shouldExecute) {
                                            exports.notEnoughActivitiesUserPush.execute(dbTask, db);
                                        }
                                        // recursively schedule new task for next week
                                        tasks_1.taskScheduler.scheduleTask(dbTask, db);
                                        done();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }
                };
                return [2 /*return*/, t];
            });
        });
    };
    NotEnoughActivitiesUserPush.prototype.condition = function (task, db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, sharedConditions_1.notEnoughActivitiesPlannedCondition(task, db)];
            });
        });
    };
    NotEnoughActivitiesUserPush.prototype.execute = function (task, db) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = db.user({ id: task.userId });
                NotificationService_1.notification.sendPushNotification({
                    type: "PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER",
                    receiver: user,
                    sender: "SYSTEM"
                });
                return [2 /*return*/];
            });
        });
    };
    return NotEnoughActivitiesUserPush;
}());
exports.notEnoughActivitiesUserPush = new NotEnoughActivitiesUserPush();
