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
exports.AdminQueryResolver = void 0;
var graphqlgen_1 = require("../generated/graphqlgen");
var ActivitiesHelper_1 = require("../services/ActivitiesHelper");
var moment = require("moment");
exports.AdminQueryResolver = __assign(__assign({}, graphqlgen_1.QueryResolvers.defaultResolvers), { getUserTable: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var users, tableData, _i, users_1, u, lastIpaq, lastIpaqScore, ipaqDelta, lastPhq, lastPhqScore, phqDelta, activeMinutesPlanned, activeMinutesGoal, lastChatMsg, lastSendMessage, numActivities, numActivitiesDone, eventsCompletedPercent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.users({ where: { role: 'PATIENT' } })];
                case 1:
                    users = _a.sent();
                    tableData = [];
                    _i = 0, users_1 = users;
                    _a.label = 2;
                case 2:
                    if (!(_i < users_1.length)) return [3 /*break*/, 11];
                    u = users_1[_i];
                    return [4 /*yield*/, ctx.db.user({ id: u.id }).patient().quests().ipaqs({ last: 2 })];
                case 3:
                    lastIpaq = _a.sent();
                    lastIpaqScore = undefined;
                    ipaqDelta = undefined;
                    if (lastIpaq && lastIpaq.length >= 1) {
                        lastIpaqScore = lastIpaq[0].score;
                        if (lastIpaq.length >= 2) {
                            ipaqDelta = lastIpaq[0].score - lastIpaq[1].score;
                        }
                    }
                    return [4 /*yield*/, ctx.db.user({ id: u.id }).patient().quests().phq9s({ last: 2 })];
                case 4:
                    lastPhq = _a.sent();
                    lastPhqScore = undefined;
                    phqDelta = undefined;
                    if (lastPhq && lastPhq.length >= 1) {
                        lastPhqScore = lastPhq[0].score;
                        if (lastPhq.length >= 2) {
                            phqDelta = lastPhq[0].score - lastPhq[1].score;
                        }
                    }
                    return [4 /*yield*/, ActivitiesHelper_1.getUsersActiveMinutesInWeek(u.id, moment().toISOString(), ctx.db)];
                case 5:
                    activeMinutesPlanned = _a.sent();
                    return [4 /*yield*/, ctx.db.user({ id: u.id }).patient().activeMinutesPerWeek()];
                case 6:
                    activeMinutesGoal = _a.sent();
                    return [4 /*yield*/, ctx.db.user({ id: u.id }).patient().buddy().chat().messages({
                            where: { author: { id: u.id } },
                            last: 1
                        })];
                case 7:
                    lastChatMsg = _a.sent();
                    lastSendMessage = undefined;
                    if (lastChatMsg && lastChatMsg.length > 0) {
                        lastSendMessage = lastChatMsg[0].createdAt;
                    }
                    return [4 /*yield*/, ctx.db.user({ id: u.id }).patient().calendarEntries()];
                case 8:
                    numActivities = (_a.sent()).length;
                    return [4 /*yield*/, ctx.db.user({ id: u.id }).patient().calendarEntries({ where: { isDone: true } })];
                case 9:
                    numActivitiesDone = (_a.sent()).length;
                    eventsCompletedPercent = (numActivitiesDone / numActivities) * 100;
                    tableData.push({
                        user: u,
                        lastIpaqScore: lastIpaqScore,
                        ipaqDelta: ipaqDelta,
                        lastPhqScore: lastPhqScore,
                        phqDelta: phqDelta,
                        lastSendMessage: lastSendMessage,
                        activeMinutesPlanned: activeMinutesPlanned,
                        activeMinutesGoal: activeMinutesGoal,
                        eventsCompletedPercent: eventsCompletedPercent
                    });
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 2];
                case 11: return [2 /*return*/, tableData];
            }
        });
    }); } });
