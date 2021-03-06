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
exports.autoMatch = void 0;
var moment = require("moment");
var logger_1 = require("../logger");
var global_settings_1 = require("../global_settings/global.settings");
var DateTimeHelper_1 = require("../services/DateTimeHelper");
var MatchingHelper_1 = require("../services/MatchingHelper");
var AutoMatch = /** @class */ (function () {
    function AutoMatch() {
    }
    AutoMatch.prototype.setup = function (args, db) {
        return __awaiter(this, void 0, void 0, function () {
            var settingsId, matchingTimeout, scheduleTime, dbTask, st;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args.userId) {
                            logger_1.logT.error("Missing Argument in SYSTEM_AUTO_MATCH", Error);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, global_settings_1.getGlobalSettingsId(db)];
                    case 1:
                        settingsId = _a.sent();
                        return [4 /*yield*/, db
                                .globalSettings({ id: settingsId })
                                .matchingTimeout()];
                    case 2:
                        matchingTimeout = _a.sent();
                        scheduleTime = moment().add(DateTimeHelper_1.toMomentDuration(matchingTimeout)).add(5, 'seconds');
                        return [4 /*yield*/, db.scheduledTasks({
                                where: {
                                    taskType: args.taskType,
                                    userId: args.userId
                                }
                            })];
                    case 3:
                        dbTask = (_a.sent())[0];
                        if (!!dbTask) return [3 /*break*/, 5];
                        st = {
                            taskType: args.taskType,
                            scheduledFor: scheduleTime.toDate(),
                            userId: args.userId
                        };
                        return [4 /*yield*/, db.createScheduledTask(st)];
                    case 4:
                        dbTask = _a.sent();
                        _a.label = 5;
                    case 5:
                        logger_1.logT.info("Scheduling SYSTEM_AUTO_MATCH for " + scheduleTime.toISOString());
                        return [2 /*return*/, this.schedule(dbTask, db)];
                }
            });
        });
    };
    AutoMatch.prototype.schedule = function (dbTask, db) {
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
                                    case 0: return [4 /*yield*/, exports.autoMatch.condition(dbTask, db)];
                                    case 1:
                                        shouldExecute = _a.sent();
                                        if (!shouldExecute) return [3 /*break*/, 3];
                                        return [4 /*yield*/, exports.autoMatch.execute(dbTask, db)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
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
    AutoMatch.prototype.condition = function (dbTask, db) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, existingBuddy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.user({ id: dbTask.userId }).patient().id()];
                    case 1:
                        pid = _a.sent();
                        return [4 /*yield*/, db.patient({ id: pid }).buddy()];
                    case 2:
                        existingBuddy = _a.sent();
                        if (existingBuddy) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AutoMatch.prototype.execute = function (task, db) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, matcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logT.info("Executing SYSTEM_AUTO_MATCH callback");
                        return [4 /*yield*/, db.globalSettingses()];
                    case 1:
                        settings = (_a.sent())[0];
                        matcher = new MatchingHelper_1.MatchingHelper(settings);
                        return [4 /*yield*/, matcher.instantMatch(task.userId, db)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.deleteScheduledTask({ id: task.id })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AutoMatch;
}());
exports.autoMatch = new AutoMatch();
