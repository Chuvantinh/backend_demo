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
exports.notification = void 0;
var webpush = require("web-push");
var env_config_1 = require("../../config/env.config");
var logger_1 = require("../../logger");
var VIBRATION_PATTERN = [100, 50, 100];
var ICON_PATH = 'assets/icon-72x72.png';
/**
 * Class to send push notifications
 */
var NotificationService = /** @class */ (function () {
    function NotificationService() {
        /**
         * Creates the payload for a push notification
         * @param title, Title of the push notification
         * @param body, Body of the push notification
         * @param icon, Icon that should be shown at the push notification
         * @param vibrate, Vibrate pattern of the device
         * @param dateOfArrival, Date that is shown in the push notification (upper right corner)
         * @param primaryKey
         * @param action
         * @param actionTitle, Title in the lower left corner of the push notifications
         * @returns Payload for a push notification
         */
        // public createPayload(title?: any,
        //   body?: any,
        //   icon?: any,
        //   vibrate?: any,
        //   dateOfArrival?: any,
        //   primaryKey?: any,
        //   action?: any,
        //   actionTitle?: any): NotificationPayload {
        //   return {
        //     notification: {
        //       title,
        //       body,
        //       icon,
        //       vibrate,
        //       data: {
        //         dateOfArrival,
        //         primaryKey
        //       },
        //       actions: [{
        //         action,
        //         title: actionTitle
        //       }]
        //     }
        //   };
        // }
        this.VAPID_KEYS = {
            publicKey: env_config_1.VAPID_PUBLIC_KEY,
            privateKey: env_config_1.VAPID_PRIVATE_KEY
        };
        webpush.setVapidDetails('mailto:mantheys@charite.de', this.VAPID_KEYS.publicKey, this.VAPID_KEYS.privateKey);
    }
    NotificationService.prototype.getDefaultNotificationPayload = function () {
        return {
            notification: {
                title: "EMPTY_TITLE",
                body: "EMPTY_BODY",
                icon: 'assets/icon-72x72.png',
                vibrate: VIBRATION_PATTERN,
                data: {
                    dateOfArrival: new Date(),
                    primaryKey: undefined
                },
                actions: [{
                        action: 'explore',
                        title: 'EMPTY_ACTION_TITLE'
                    }]
            }
        };
    };
    NotificationService.prototype.buildPayload = function (partPayload) {
        var defPayload = this.getDefaultNotificationPayload();
        var payload = {
            notification: __assign(__assign({}, defPayload.notification), { title: partPayload.title, body: partPayload.body, actions: [{
                        action: 'explore',
                        title: partPayload.actionTitle
                    }] })
        };
        logger_1.logT.info("Notification Payload " + logger_1.logFormat(payload));
        return payload;
    };
    NotificationService.prototype.sendPushNotification = function (args) {
        switch (args.type) {
            case 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST':
                this.sendIncomingBuddyRequestNotification(args);
                break;
            case 'PUSH_NOTIFY_BUDDY_REQUEST_DENIED':
                this.sendBuddyRequestDeniedNotification(args);
                break;
            case 'PUSH_NOTIFY_BUDDY_REQUEST_DENIED':
                this.sendBuddyRequestDeniedNotification(args);
                break;
            case 'PUSH_NOTIFY_IPAQ_REMINDER':
            case 'PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP':
                this.sendPushNotifyIpaqReminder(args);
                break;
            case 'PUSH_NOTIFY_PHQ_REMINDER':
            case 'PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP':
                this.sendPushNotifyPhqReminder(args);
                break;
            case 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER':
                this.sendPushNotEnoughActivitiesUser(args);
                break;
            case 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY':
                this.sendPushNotEnoughActivitiesBuddy(args);
                break;
            // case 'PUSH_NOTIFY_TO_MUCH_ACTIVITIES_USER':
            //   break;
            case 'PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY':
                this.sendPushNotifyToMuchActivitiesBuddy(args);
                break;
            case 'PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY':
                this.sendPushNotifyMissedActivityBuddy(args);
                break;
            default:
                break;
        }
    };
    NotificationService.prototype.sendBuddyRequestDeniedNotification = function (args) {
        var sender = args.sender; // user which did not answer
        var receiver = args.receiver; // requesting user
        // TODO use messages from config in db
        var payload = this.buildPayload({
            title: sender.username + " hat deine Anfrage leider nicht beantwortet",
            body: "Du kannst nun erneut nach Buddies suchen",
            actionTitle: 'Deine Buddy-Anfragen wurde nicht beantwortet'
        });
        this.sendNotificationToUser(receiver, payload);
    };
    NotificationService.prototype.sendPushNotifyIpaqReminder = function (args) {
        // const receiver = args.receiver as User;
        var receiver = args.receiver;
        // TODO use messages from config in db
        var payload = this.buildPayload({
            title: "IPAQ Fragebogen ausf\u00FCllen",
            body: "Bitte erneut IPAQ Fragebogen ausf\u00FCllen",
            actionTitle: 'Zum Fragebogen'
        });
        this.sendNotificationToUser(receiver, payload);
    };
    NotificationService.prototype.sendPushNotifyPhqReminder = function (args) {
        // const receiver = args.receiver as User;
        var receiver = args.receiver;
        // TODO use messages from config in db
        var payload = this.buildPayload({
            title: "PHQ Fragebogen ausf\u00FCllen",
            body: "Bitte erneut PHQ Fragebogen ausf\u00FCllen",
            actionTitle: 'Zum Fragebogen'
        });
        this.sendNotificationToUser(receiver, payload);
    };
    NotificationService.prototype.sendPushNotEnoughActivitiesUser = function (args) {
        // const receiver = args.receiver as User;
        var receiver = args.receiver;
        // TODO use messages from config in db
        var payload = this.buildPayload({
            title: "Bitte aktivit\u00E4ten Planen",
            body: "Bisher sind zu wenige aktivit\u00E4ten geplant",
            actionTitle: 'explore'
        });
        this.sendNotificationToUser(receiver, payload);
    };
    NotificationService.prototype.sendPushNotEnoughActivitiesBuddy = function (args) {
        var receiver = args.receiver;
        // TODO use messages from config in db
        var payload = this.buildPayload({
            title: "Ihr Buddy hat zuwenig aktivit\u00E4ten geplant",
            body: "Sprechen Sie doch dar\u00FCber",
            actionTitle: 'explore'
        });
        this.sendNotificationToUser(receiver, payload);
    };
    NotificationService.prototype.sendPushNotifyToMuchActivitiesBuddy = function (args) {
        // const receiver = args.receiver as User;
        var receiver = args.receiver;
        var payload = this.buildPayload({
            title: "Ihr Buddy hat zu viele aktivit\u00E4ten geplant",
            body: "Sprechen Sie doch dar\u00FCber",
            actionTitle: 'Zum Chat'
        });
        this.sendNotificationToUser(receiver, payload);
    };
    NotificationService.prototype.sendPushNotifyMissedActivityBuddy = function (args) {
        var receiver = args.receiver;
        // TODO use messages from config in db
        var payload = this.buildPayload({
            title: "Ihr Buddy hat geplante Aktivt\u00E4ten verpasst",
            body: "Bitte unterst\u00FCzen Sie ihren Buddy",
            actionTitle: 'Zum Chat'
        });
        this.sendNotificationToUser(receiver, payload);
    };
    /**
     * Sends a single remind message to a user
     * @param receiver, User that should receive the push notification
     * @param title, Title of the push notification
     * @param body, Body of the push notification
     * @param actionTitle, Title in the lower left corner of the push notification
     * @param icon, Icon that should be shown at the push notification
     * @param vibrate, Vibrate pattern of the device
     */
    // public sendRemindMessage(receiver: User,
    //   title: string,
    //   body: string,
    //   actionTitle: string,
    //   icon?: string,
    //   vibrate?: number[]): void {
    //   const notificationPayload = this.createPayload(
    //     title,
    //     body,
    //     (icon) ? icon : 'assets/icon-72x72.png',
    //     (vibrate) ? vibrate : [100, 50, 100],
    //     Date.now(),
    //     1,
    //     'explore',
    //     actionTitle
    //   );
    //   this.sendNotificationToUser(receiver, notificationPayload);
    // }
    /**
     * Sends a buddy-request push notification
     * @param receiver, User that should receive the push notification
     * @param sender, User that sends the push notification
     */
    NotificationService.prototype.sendIncomingBuddyRequestNotification = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, senderName, receiver, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sender = args.sender;
                        return [4 /*yield*/, sender.username()];
                    case 1:
                        senderName = _a.sent();
                        receiver = args.receiver;
                        payload = this.buildPayload({
                            title: senderName + " m\u00F6chte dein Buddy werden",
                            body: "Schau dir " + senderName + "'s Profil doch einmal an",
                            actionTitle: 'Schau doch mal in deine Buddy-Anfragen'
                        });
                        this.sendNotificationToUser(receiver, payload);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send a single push notification
     * @param receiver, User that should receive the push notification
     * @param payload, Payload that contains all the data of the push notification
     */
    NotificationService.prototype.sendNotificationToUser = function (receiver, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var notifications, pushInfos, _i, pushInfos_1, pushInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, receiver.notifications()];
                    case 1:
                        notifications = _a.sent();
                        pushInfos = notifications.map(function (r) { return r.notificationInformation; });
                        _i = 0, pushInfos_1 = pushInfos;
                        _a.label = 2;
                    case 2:
                        if (!(_i < pushInfos_1.length)) return [3 /*break*/, 5];
                        pushInfo = pushInfos_1[_i];
                        return [4 /*yield*/, this.sendNotificationToUserEndpoint(receiver, payload, pushInfo)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendNotificationToUserEndpoint = function (receiver, payload, webPushInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var pushInfo, receiverName, sendPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pushInfo = webPushInfo;
                        return [4 /*yield*/, receiver.username()];
                    case 1:
                        receiverName = _a.sent();
                        //logT.info(`sending Notification with infos: ${logFormat(receiver.notificationInformation)}`);
                        if (pushInfo && pushInfo.endpoint && pushInfo.keys.auth && pushInfo.keys.p256dh) {
                            sendPromise = new Promise(function (resolve, reject) {
                                webpush.sendNotification(webPushInfo, JSON.stringify(payload), 
                                // TODO:
                                { proxy: env_config_1.SERVER_PROXY }).then(function () {
                                    return resolve('Notification send');
                                })["catch"](function (error) {
                                    return reject(error);
                                });
                            });
                            sendPromise["catch"](function (error) { return logger_1.logT.trace("SendNotification " + error, error); });
                        }
                        else {
                            logger_1.logT.info("Push Notification send aborted - User " + receiverName + " has no notification infos");
                            return [2 /*return*/, false];
                        }
                        //logT.info(`sending Notification to ${receiver.username} with infos: ${logFormat(psj)}`);
                        logger_1.logT.info("sending Notification to " + receiverName);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    NotificationService.prototype.sendChatNotificationToUsers = function (senderName, receivers, msgText) {
        for (var _i = 0, receivers_1 = receivers; _i < receivers_1.length; _i++) {
            var r = receivers_1[_i];
            this.sendChatNotificationToUser(senderName, r, msgText);
        }
    };
    NotificationService.prototype.sendChatNotificationToUser = function (senderName, receiver, msgText) {
        return __awaiter(this, void 0, void 0, function () {
            var notifyInfos, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, receiver.notifications()];
                    case 1:
                        notifyInfos = _a.sent();
                        if (notifyInfos.length <= 0) {
                            logger_1.logT.info("Push Notification send aborted - User " + receiver.username + " has no notification infos");
                            return [2 /*return*/];
                        }
                        payload = {
                            notification: {
                                title: "Neue Nachricht von " + senderName,
                                body: msgText,
                                icon: ICON_PATH,
                                vibrate: VIBRATION_PATTERN
                            }
                        };
                        this.sendNotificationToUser(receiver, payload);
                        return [2 /*return*/];
                }
            });
        });
    };
    return NotificationService;
}());
exports.notification = new NotificationService();
