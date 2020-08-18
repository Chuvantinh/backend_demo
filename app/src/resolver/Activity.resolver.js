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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ActivityMutationResolver = exports.ActivityQueryResolver = void 0;
var graphqlgen_1 = require("../generated/graphqlgen");
var logger_1 = require("../logger");
var ActivitiesHelper_1 = require("../services/ActivitiesHelper");
var tasks_1 = require("../tasks/tasks");
exports.ActivityQueryResolver = __assign(__assign({}, graphqlgen_1.QueryResolvers.defaultResolvers), { getAllActivities: function (root, _a, ctx) {
        var last = _a.last;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_b) {
                userId = ctx.userId;
                return [2 /*return*/, ctx.db.user({ id: userId }).patient().activities()];
            });
        });
    }, getActivity: function (root, _a, ctx) {
        var activityId = _a.activityId;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, ctx.db.activity({ id: activityId })];
            });
        });
    }, getActiveMinutesPerWeekGoal: function (root, _a, ctx) {
        var userId = _a.userId;
        return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_b) {
                id = userId;
                if (!id) {
                    id = ctx.userId;
                }
                return [2 /*return*/, ctx.db.user({ id: id }).patient().activeMinutesPerWeek()];
            });
        });
    }, getActiveMinutesInWeek: function (root, _a, ctx) {
        var date = _a.date, userId = _a.userId;
        return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = userId;
                        if (!id) {
                            id = ctx.userId;
                        }
                        return [4 /*yield*/, ActivitiesHelper_1.getUsersActiveMinutesInWeek(id, date, ctx.db)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }, isUserActivity: function (root, _a, ctx) {
        var key = _a.key;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({
                                id: userId
                            }).patient().activities({
                                where: { key: key },
                                first: 1
                            })];
                    case 1: return [2 /*return*/, (_b.sent()).pop()];
                }
            });
        });
    }, getUserActivities: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, favs, defAct, userAct, _loop_1, _i, userAct_1, a;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = ctx.userId;
                    return [4 /*yield*/, ctx.db.user({ id: userId }).patient().favoriteActivities()];
                case 1:
                    favs = _a.sent();
                    return [4 /*yield*/, ctx.db.activities()];
                case 2:
                    defAct = _a.sent();
                    userAct = defAct;
                    _loop_1 = function (a) {
                        var lookup = favs.find(function (f) { return f.activityKey === a.key; });
                        if (lookup) {
                            a.isFavorite = true;
                        }
                        else {
                            a.isFavorite = false;
                        }
                    };
                    // log.info('getUserActivities:' + JSON.stringify(userAct));
                    for (_i = 0, userAct_1 = userAct; _i < userAct_1.length; _i++) {
                        a = userAct_1[_i];
                        _loop_1(a);
                    }
                    return [2 /*return*/, userAct];
            }
        });
    }); }, getUserActivity: function (root, _a, ctx) {
        var key = _a.key;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, favs, defAct, userAct, _i, favs_1, f, isFav;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().favoriteActivities({ where: { activityKey: key } })];
                    case 1:
                        favs = _b.sent();
                        return [4 /*yield*/, ctx.db.activities({ where: { key: key } })];
                    case 2:
                        defAct = (_b.sent())[0];
                        userAct = defAct;
                        // log.info('getUserActivities:' + JSON.stringify(userAct));
                        userAct.isFavorite = false;
                        for (_i = 0, favs_1 = favs; _i < favs_1.length; _i++) {
                            f = favs_1[_i];
                            isFav = favs.find(function (f) { return f.activityKey === userAct.key; });
                            if (isFav) {
                                userAct.isFavorite = true;
                            }
                        }
                        return [2 /*return*/, userAct];
                }
            });
        });
    }, getUserActivityByID: function (root, _a, ctx) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, favs, defAct, userAct, _i, favs_2, f, isFav;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().favoriteActivities({ where: { id: id } })];
                    case 1:
                        favs = _b.sent();
                        return [4 /*yield*/, ctx.db.activities({ where: { id: id } })];
                    case 2:
                        defAct = (_b.sent())[0];
                        userAct = defAct;
                        // log.info('getUserActivities:' + JSON.stringify(userAct));
                        userAct.isFavorite = false;
                        for (_i = 0, favs_2 = favs; _i < favs_2.length; _i++) {
                            f = favs_2[_i];
                            isFav = favs.find(function (f) { return f.activityKey === userAct.key; });
                            if (isFav) {
                                userAct.isFavorite = true;
                            }
                        }
                        return [2 /*return*/, userAct];
                }
            });
        });
    }, getManyActivities: function (root, _a, ctx) {
        var ids = _a.ids;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_b) {
                userId = ctx.userId;
                return [2 /*return*/, ctx.db.activities({ where: { id_in: ids } })];
            });
        });
    }, getAllDefaultActivities: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ctx.db.activities()];
        });
    }); } });
exports.ActivityMutationResolver = {
    createDefaultActivities: function (root, _a, ctx) {
        var activities = _a.activities;
        return __awaiter(void 0, void 0, void 0, function () {
            var _i, activities_1, a, hasActivity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, activities_1 = activities;
                        _b.label = 1;
                    case 1:
                        if (!(_i < activities_1.length)) return [3 /*break*/, 7];
                        a = activities_1[_i];
                        return [4 /*yield*/, ctx.db.$exists.activity({ key: a.key })];
                    case 2:
                        hasActivity = _b.sent();
                        if (!!hasActivity) return [3 /*break*/, 4];
                        return [4 /*yield*/, ctx.db.createActivity(a)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, ctx.db.updateActivity({ where: { key: a.key }, data: a })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [4 /*yield*/, ctx.db.activities()];
                    case 8: return [2 /*return*/, _b.sent()];
                }
            });
        });
    },
    /// TODO: Check usage -> Deprecated? Refactor name -> add Activity
    createUserActivity: function (root, _a, ctx) {
        var input = _a.input;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, newActId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.updateUser({
                                where: { id: userId },
                                data: {
                                    patient: { update: { activities: { connect: input } } }
                                }
                            }).patient().activities()];
                    case 1:
                        newActId = _b.sent();
                        tasks_1.taskScheduler.scheduleTask({
                            taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
                            userId: userId
                        }, ctx.db);
                        return [2 /*return*/, newActId.pop()];
                }
            });
        });
    },
    /// TODO: Check usage -> Deprecated? -> rename?
    createUserActivities: function (root, _a, ctx) {
        var input = _a.input;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, act;
            return __generator(this, function (_b) {
                userId = ctx.userId;
                act = ctx.db.updateUser({
                    where: { id: userId },
                    data: {
                        patient: {
                            update: {
                                activities: {
                                    create: input.create
                                }
                            }
                        }
                    }
                }).patient().activities();
                tasks_1.taskScheduler.scheduleTask({
                    taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
                    userId: userId
                }, ctx.db);
                return [2 /*return*/, act];
            });
        });
    },
    favoriteUserActivity: function (root, _a, ctx) {
        var key = _a.key, fav = _a.fav;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, favs, hasFav, act;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().favoriteActivities()];
                    case 1:
                        favs = _b.sent();
                        hasFav = favs.find(function (f) { return f.activityKey === key; });
                        logger_1.log.info('favoriteUserActivity' + key + ' ' + fav);
                        if (!!fav) return [3 /*break*/, 4];
                        if (!hasFav) return [3 /*break*/, 3];
                        return [4 /*yield*/, ctx.db.updateUser({
                                where: { id: userId },
                                data: {
                                    patient: {
                                        update: {
                                            favoriteActivities: { "delete": { activityKey: key } }
                                        }
                                    }
                                }
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        if (!!hasFav) return [3 /*break*/, 6];
                        return [4 /*yield*/, ctx.db.updateUser({
                                where: { id: userId },
                                data: {
                                    patient: {
                                        update: {
                                            favoriteActivities: { create: { activityKey: key } }
                                        }
                                    }
                                }
                            })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [4 /*yield*/, ctx.db.activity({ key: key })];
                    case 7:
                        act = _b.sent();
                        act = __assign(__assign({}, act), { isFavorite: fav });
                        return [2 /*return*/, act];
                }
            });
        });
    },
    createCustomActivity: function (root, _a, ctx) {
        var activity = _a.activity;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, customActIdx, actInput, createdAct, act;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({
                                id: userId
                            }).patient().activities({
                                where: { key_contains: userId }
                            })];
                    case 1:
                        customActIdx = (_b.sent()).length;
                        customActIdx = !customActIdx ? 0 : customActIdx;
                        actInput = {
                            key: 'CUSTOM_' + userId + '_' + customActIdx,
                            color: activity.color,
                            description: activity.description,
                            tags: activity.tags,
                            icon: activity.icon,
                            isCustom: true,
                            titel: activity.titel
                        };
                        return [4 /*yield*/, ctx.db.updateUser({
                                where: { id: userId },
                                data: {
                                    patient: {
                                        update: {
                                            activities: {
                                                create: actInput
                                            },
                                            favoriteActivities: {
                                                create: { activityKey: actInput.key }
                                            }
                                        }
                                    }
                                }
                            })];
                    case 2:
                        createdAct = _b.sent();
                        return [4 /*yield*/, ctx.db.activity({ key: actInput.key })];
                    case 3:
                        act = _b.sent();
                        act = __assign(__assign({}, act), { isFavorite: true });
                        return [2 /*return*/, act];
                }
            });
        });
    },
    deleteUserActivity: function (root, _a, ctx) {
        var activityId = _a.activityId;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, act;
            return __generator(this, function (_b) {
                userId = ctx.userId;
                act = ctx.db.deleteActivity({ id: activityId });
                tasks_1.taskScheduler.scheduleTask({
                    taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
                    userId: userId
                }, ctx.db);
                return [2 /*return*/, act];
            });
        });
    },
    deleteUserActivities: function (root, _a, ctx) {
        var activityIds = _a.activityIds;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, ids, act;
            return __generator(this, function (_b) {
                userId = ctx.userId;
                ids = __spreadArrays(activityIds);
                act = ctx.db.deleteManyActivities({ id_in: ids }).count();
                tasks_1.taskScheduler.scheduleTask({
                    taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
                    userId: userId
                }, ctx.db);
                return [2 /*return*/, act];
            });
        });
    },
    setActiveMinutesInWeek: function (root, _a, ctx) {
        var minutes = _a.minutes;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, act;
            return __generator(this, function (_b) {
                userId = ctx.userId;
                act = ctx.db.updateUser({
                    where: { id: userId },
                    data: { patient: { update: { activeMinutesPerWeek: minutes } } }
                }).patient().activeMinutesPerWeek();
                tasks_1.taskScheduler.scheduleTask({
                    taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
                    userId: userId
                }, ctx.db);
                return [2 /*return*/, act];
            });
        });
    }
};
