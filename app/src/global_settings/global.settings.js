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
exports.WebPushSettingsConfigDev = exports.BotSettingsConfigDev = exports.GlobalConfigDev = exports.getGlobalSettingsId = exports.getGlobalSettings = void 0;
var apollo_server_1 = require("apollo-server");
var logger_1 = require("../logger");
exports.getGlobalSettings = function (prisma) { return __awaiter(void 0, void 0, void 0, function () {
    var s;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                s = prisma.globalSettingses();
                return [4 /*yield*/, s];
            case 1:
                if ((_a.sent()).length !== 1) {
                    logger_1.log.fatal('Global Config invalid or not exiting', Error);
                    throw new apollo_server_1.ValidationError('Global Config invalid or not found -> exiting');
                }
                return [4 /*yield*/, s];
            case 2: return [2 /*return*/, (_a.sent()).pop()];
        }
    });
}); };
exports.getGlobalSettingsId = function (prisma) { return __awaiter(void 0, void 0, void 0, function () {
    var s, webPushSettings, botSettings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.globalSettingses()];
            case 1:
                s = (_a.sent());
                if (s.length !== 1) {
                    logger_1.log.fatal('Global Config invalid or not exiting', Error);
                    throw new apollo_server_1.ValidationError('Global Config invalid or not found -> Exiting');
                }
                return [4 /*yield*/, prisma.webPushSettingses()];
            case 2:
                webPushSettings = (_a.sent());
                if (webPushSettings.length !== 1) {
                    logger_1.log.fatal('Web Push Settings invalid or not exiting', Error);
                }
                return [4 /*yield*/, prisma.botSettingses()];
            case 3:
                botSettings = (_a.sent());
                if (botSettings.length !== 1) {
                    logger_1.log.fatal('Bot Settings invalid or not exiting', Error);
                }
                return [2 /*return*/, s.pop().id];
        }
    });
}); };
// TODO init config on First Start
// needs to be set after first initialization of server
exports.GlobalConfigDev = {
    matchingPercentageCap: 70,
    matchingTimeout: {
        create: {
            hours: 0,
            days: 0,
            minutes: 2,
            seconds: 0
        }
    },
    defaultActivityTimeMinutesPerWeek: 150,
    minimumActivityTimeMinutes: 10,
    maximumActivityTimeMinutes: 240,
    ipaqGroupLowMax: 360,
    ipaqGroupModerateMax: 3600,
    ipaqGroupHighMax: 3600,
    phqGroupLowMin: 10,
    phqGroupLowMax: 18
};
exports.BotSettingsConfigDev = {
    botFirstGreetingText: "Hey, ich bin euer RobBot und versuche euch am Anfang ein wenig zu Unterstützern. Schön das ihr euch hier gefunden habt. Stellt euch kurz vor wer ihr seid und was eure Ziele sind. Ob ihr gerade Lust auf viele Aktivitäten habt und vielleicht auf welche.",
    botActivityLessThanPlannedWeekday: 4,
    botAskCreateActivitiesTime: {
        create: {
            hours: 0,
            days: 0,
            minutes: 2,
            seconds: 0
        }
    },
    botAskCreateActivitiesMessage: "Tragt doch bitte Aktivitäten in euren Kalender in",
    botAskStartChatIntervall: {
        create: {
            hours: 0,
            days: 0,
            minutes: 5,
            seconds: 0
        }
    },
    botAskStartChatMessage: "Hey ihr hab euch seit mehr als einer Woche nicht mehr geschrieben. Wie geht’s euch und euren Plänen?",
    botActivityLessThanPlannedMessage: "Falls ihr eure Aktiven Minuten noch nicht erreicht habt sprecht doch darüber was ihr noch im Kalender hinzufügen könnt"
};
exports.WebPushSettingsConfigDev = {
    webPushIpaqReminderIntervall: {
        create: {
            days: 14,
            hours: 0,
            minutes: 5,
            seconds: 0
        }
    },
    webPushIpaqReminderIntervallFollowUp: {
        create: {
            days: 0,
            hours: 23,
            minutes: 5,
            seconds: 0
        }
    },
    webPushIpaqReminderMessage: "Bitte IPAQ Fragebogen ausfüllen",
    webPushPhqReminderIntervall: {
        create: {
            days: 14,
            hours: 0,
            minutes: 5,
            seconds: 0
        }
    },
    webPushPhqReminderIntervallFollowUp: {
        create: {
            days: 0,
            hours: 23,
            minutes: 5,
            seconds: 0
        }
    },
    webPushPhqReminderMessage: "Bitte PHQ-9 Fragebogen ausfüllen"
};
