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
exports.UserSubscriptionResolver = exports.UserMutationResolver = exports.UserQueryResolver = void 0;
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var moment = require("moment");
var graphqlgen_1 = require("../generated/graphqlgen");
var logger_1 = require("../logger");
var env_config_1 = require("../config/env.config");
var errors_1 = require("../errors/errors");
var apollo_server_1 = require("apollo-server");
var tasks_1 = require("../tasks/tasks");
var NotificationService_1 = require("../services/notification/NotificationService");
exports.UserQueryResolver = __assign(__assign({}, graphqlgen_1.QueryResolvers.defaultResolvers), { getUser: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            logger_1.log.info("getUser ctx.userId ' " + (ctx.userId));
            userId = ctx.userId;
            return [2 /*return*/, ctx.db.user({ id: userId })];
        });
    }); }, getUserById: function (root, _a, ctx) {
        var userId = _a.userId;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, ctx.db.user({ id: userId })];
            });
        });
    }, getUserByName: function (root, _a, ctx) {
        var name = _a.name;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ctx.db.user({ username: name })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }, getUserRole: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = ctx.userId;
                    return [4 /*yield*/, ctx.db.user({ id: userId }).role()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, getPatientProfile: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            userId = ctx.userId;
            return [2 /*return*/, ctx.db.user({ id: userId }).patient().profile()];
        });
    }); }, getVapidPublicKey: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, env_config_1.VAPID_PUBLIC_KEY];
        });
    }); }, getBuddyId: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            userId = ctx.userId;
            return [2 /*return*/, ctx.db.user({ id: userId }).patient().buddy().patient().user().id()];
        });
    }); }, getPatientProfileActivities: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, pa;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = ctx.userId;
                    return [4 /*yield*/, ctx.db.user({ id: userId }).patient().profile().profileActivities()];
                case 1:
                    pa = _a.sent();
                    // log.info(`getPatientProfileActivities ' ${(logFormat(pa))}`);
                    return [2 /*return*/, pa];
            }
        });
    }); }, getAllProfileActivities: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ctx.db.profileActivities({ where: {} })];
        });
    }); }, users: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ctx.db.users()];
        });
    }); }, chats: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ctx.db.chats()];
        });
    }); }, getUserSettings: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ctx.db.user({ id: ctx.userId }).settings()];
        });
    }); }, getUserNotificationInfos: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ctx.db.user({ id: ctx.userId }).notifications()];
        });
    }); } });
exports.UserMutationResolver = {
    createAppUser: function (root, _a, ctx) {
        var username = _a.username, verificationCode = _a.verificationCode, role = _a.role;
        return __awaiter(void 0, void 0, void 0, function () {
            var userExists, e, newUser, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ctx.db.$exists.user({ username: username })];
                    case 1:
                        userExists = _b.sent();
                        if (userExists) {
                            e = new errors_1.RegistrationError('User already Exists');
                            logger_1.log.error("User with Name  " + username + " already Exists", e);
                            return [2 /*return*/, undefined];
                        }
                        logger_1.log.info("Creating User -  " + username + " - " + role + " - " + verificationCode);
                        newUser = {
                            username: username,
                            role: role,
                            notifications: {},
                            settings: {
                                create: { themeName: 'theme-06-teal-amber' }
                            }
                        };
                        if (role === "PATIENT") {
                            newUser = {
                                username: username,
                                role: role,
                                notifications: {},
                                settings: {
                                    create: { themeName: 'theme-06-teal-amber' }
                                },
                                patient: {
                                    create: {
                                        verificationCode: verificationCode,
                                        verified: false,
                                        profile: {
                                            create: {}
                                        },
                                        activities: {},
                                        quests: {
                                            create: {}
                                        }
                                    }
                                }
                            };
                        }
                        return [4 /*yield*/, ctx.db.createUser(newUser)];
                    case 2:
                        user = _b.sent();
                        logger_1.log.info("User Created " + logger_1.logFormat(newUser) + " ");
                        return [2 /*return*/, user];
                }
            });
        });
    },
    registerUser: function (root, _a, ctx) {
        var username = _a.username, password = _a.password, verificationCode = _a.verificationCode;
        return __awaiter(void 0, void 0, void 0, function () {
            var SALT_ROUNDS, user, _b, _c, _d, _e, _f, role, patient, hashedPassword, updatedUser;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        SALT_ROUNDS = 10;
                        return [4 /*yield*/, ctx.db.user({ username: username })];
                    case 1:
                        user = _g.sent();
                        if (!user) {
                            // const e = new RegistrationError('REGISTER_USER_NOT_FOUND');
                            logger_1.logA.warn("Failed to register unknown user " + username);
                            return [2 /*return*/, false];
                        }
                        _c = (_b = logger_1.log).info;
                        _d = "Register User ";
                        _f = (_e = JSON).stringify;
                        return [4 /*yield*/, user.role];
                    case 2:
                        _c.apply(_b, [_d + _f.apply(_e, [(_g.sent()), null, ' '])]);
                        role = user.role;
                        if (!(role === "PATIENT")) return [3 /*break*/, 4];
                        return [4 /*yield*/, ctx.db.patients({ where: { user: { id: user.id } } })];
                    case 3:
                        patient = (_g.sent())[0];
                        logger_1.log.info("Register " + JSON.stringify(patient.verificationCode, null, ' '));
                        if (patient.verificationCode !== verificationCode) {
                            // const e = new RegistrationError('REGISTER_VERBIFY_FAILED');
                            logger_1.logA.warn('Wrong verification code');
                            // registration rejected
                            return [2 /*return*/, false];
                        }
                        _g.label = 4;
                    case 4: return [4 /*yield*/, bcrypt.hash(password, SALT_ROUNDS)];
                    case 5:
                        hashedPassword = _g.sent();
                        return [4 /*yield*/, ctx.db.updateUser({
                                where: { id: user.id },
                                data: {
                                    password: hashedPassword,
                                    patient: { update: { verified: true } }
                                }
                            })];
                    case 6:
                        updatedUser = _g.sent();
                        // registration successful
                        return [2 /*return*/, updatedUser ? true : false];
                }
            });
        });
    },
    login: function (root, _a, ctx) {
        var username = _a.username, password = _a.password;
        return __awaiter(void 0, void 0, void 0, function () {
            var user, valid, authPayload;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger_1.log.info('login ' + JSON.stringify(username));
                        return [4 /*yield*/, ctx.db.user({ username: username })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw new errors_1.LoginError("Login Failed");
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 2:
                        valid = _b.sent();
                        if (!valid) {
                            throw new errors_1.LoginError("Login Failed");
                        }
                        authPayload = {
                            user: user,
                            token: jwt.sign({ userId: user.id }, env_config_1.APP_PRIVATE_KEY, {
                                // algorithm: 'RS256', // process.env.TOKEN_ALGORITHM,
                                expiresIn: env_config_1.TOKEN_EXPIRY_TIME
                            })
                        };
                        // TODO: save token to db to validate expiry
                        return [2 /*return*/, authPayload];
                }
            });
        });
    },
    verifyPatient: function (root, _a, ctx) {
        var verify = _a.verify;
        var userId = ctx.userId;
        return ctx.db.updateUser({
            where: { id: userId },
            data: { patient: { update: { verified: verify } } }
        }).patient().verified();
    },
    updatePatientProfile: function (root, _a, ctx) {
        var profile = _a.profile;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, id;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().profile().id()];
                    case 1:
                        id = _b.sent();
                        return [2 /*return*/, ctx.db.updatePatientProfileInfo({
                                data: profile,
                                where: { id: id }
                            })];
                }
            });
        });
    },
    updatePatientProfileActivities: function (root, _a, ctx) {
        var activities = _a.activities;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, id;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().profile().id()];
                    case 1:
                        id = _b.sent();
                        return [4 /*yield*/, ctx.db.updatePatientProfileInfo({
                                data: {
                                    profileActivities: activities
                                },
                                where: { id: id }
                            }).profileActivities()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    },
    createProfileActivities: function (root, _a, ctx) {
        var activities = _a.activities;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId, id, _i, activities_1, a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().profile().id()];
                    case 1:
                        id = _b.sent();
                        _i = 0, activities_1 = activities;
                        _b.label = 2;
                    case 2:
                        if (!(_i < activities_1.length)) return [3 /*break*/, 5];
                        a = activities_1[_i];
                        return [4 /*yield*/, ctx.db.createProfileActivity(a)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, ctx.db.profileActivities({ where: {} })];
                }
            });
        });
    },
    deleteAppUser: function (root, _a, ctx) {
        var args = _a.args;
        logger_1.log.info("deleting user " + logger_1.logFormat(args));
        if (args.username) {
            return ctx.db.deleteUser({ username: args.username });
        }
        else if (args.id) {
            return ctx.db.deleteUser({ id: args.id });
        }
        throw new apollo_server_1.UserInputError('Missing Argument in deleteAppUser');
    },
    updateUserVerificationCode: function (root, _a, ctx) {
        var username = _a.username, verificationCode = _a.verificationCode;
        return ctx.db.updateUser({
            where: { username: username },
            data: {
                patient: {
                    update: {
                        verificationCode: verificationCode
                    }
                }
            }
        });
    },
    // updateAppUser: (root, { userUpdate }, ctx: Context) => {
    //   const userId = ctx.userId;
    //   return ctx.db.updateUser({
    //     data: userUpdate as UserUpdateInput,
    //     where: { id: userId }
    //   });
    // },
    // TODO: correct task deletion
    disengageBuddy: function (root, _a, ctx) {
        var userId = _a.userId;
        return __awaiter(void 0, void 0, void 0, function () {
            var userPatId, requests, buddyUserId, chatId, buddyIdU, buddyIdB, dontDelete, res, _b, _c, _i, res_1, id;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, ctx.db.user({ id: userId }).patient().id()];
                    case 1:
                        userPatId = _d.sent();
                        return [4 /*yield*/, (ctx.db.buddyRequests({
                                where: {
                                    OR: [
                                        { from: { id: userPatId } },
                                        { to: { id: userPatId } }
                                    ],
                                    state: "CONFIRMED"
                                }
                            }))];
                    case 2:
                        requests = (_d.sent())[0];
                        if (!requests) return [3 /*break*/, 4];
                        return [4 /*yield*/, ctx.db.updateBuddyRequest({
                                where: { id: requests.id },
                                data: { state: "REMOVED" }
                            })];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4: return [4 /*yield*/, ctx.db.user({ id: userId }).patient().buddy().patient().user().id()];
                    case 5:
                        buddyUserId = _d.sent();
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().buddy().chat().id()];
                    case 6:
                        chatId = _d.sent();
                        return [4 /*yield*/, ctx.db.user({ id: userId }).patient().buddy().id()];
                    case 7:
                        buddyIdU = _d.sent();
                        return [4 /*yield*/, ctx.db.user({ id: buddyUserId }).patient().buddy().id()];
                    case 8:
                        buddyIdB = _d.sent();
                        logger_1.log.info('disengageBuddy - buddy Ids ' + buddyIdU + '  ' + buddyIdB);
                        return [4 /*yield*/, ctx.db.deleteChat({ id: chatId })];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, ctx.db.deleteBuddy({ id: buddyIdU })];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, ctx.db.deleteBuddy({ id: buddyIdB })];
                    case 11:
                        _d.sent();
                        dontDelete = [
                            "PUSH_NOTIFY_IPAQ_REMINDER",
                            "PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP",
                            "PUSH_NOTIFY_PHQ_REMINDER",
                            "PUSH_NOTIFY_PHQ_REMINDER_FOLLOWUP",
                        ];
                        return [4 /*yield*/, ctx.db.scheduledTasks({
                                where: { userId: userId, taskType_not_in: dontDelete }
                            })];
                    case 12:
                        res = (_d.sent()).map(function (r) { return r.id; });
                        _b = [res];
                        return [4 /*yield*/, ctx.db.scheduledTasks({
                                where: { userId: buddyUserId, taskType_not_in: dontDelete }
                            })];
                    case 13:
                        res = __spreadArrays.apply(void 0, _b.concat([(_d.sent()).map(function (r) { return r.id; })]));
                        _c = [res];
                        return [4 /*yield*/, ctx.db.scheduledTasks({
                                where: { chatId: chatId }
                            })];
                    case 14:
                        res = __spreadArrays.apply(void 0, _c.concat([(_d.sent()).map(function (r) { return r.id; })]));
                        _i = 0, res_1 = res;
                        _d.label = 15;
                    case 15:
                        if (!(_i < res_1.length)) return [3 /*break*/, 18];
                        id = res_1[_i];
                        return [4 /*yield*/, ctx.db.deleteManyScheduledTasks({ id: id })];
                    case 16:
                        _d.sent();
                        _d.label = 17;
                    case 17:
                        _i++;
                        return [3 /*break*/, 15];
                    case 18: return [4 /*yield*/, tasks_1.taskScheduler.deleteTasksAfterUnlink(res)];
                    case 19:
                        _d.sent();
                        // await ctx.db.deleteManyScheduledTasks({ userId: userId, taskType_not_in: dontDelete });
                        // await ctx.db.deleteManyScheduledTasks({ userId: buddyUserId });
                        // await ctx.db.deleteManyScheduledTasks({ chatId: chatId });
                        // await ctx.db.updateUser({
                        //   where: { id: buddyId },
                        //   data: {
                        //     patient: {
                        //       update: {
                        //         buddy: {
                        //           delete: true,
                        //         }
                        //       }
                        //     }
                        //   },
                        // });
                        // return ctx.db.updateUser({
                        //   where: { id: userId },
                        //   data: {
                        //     patient: {
                        //       update: {
                        //         buddy: {
                        //           delete: true,
                        //         },
                        //       }
                        //     }
                        //   },
                        // });
                        return [2 /*return*/, ctx.db.user({ id: userId })];
                }
            });
        });
    },
    updateUsersSettings: function (root, _a, ctx) {
        var settings = _a.settings;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.updateUser({
                                where: { id: userId },
                                data: { settings: { update: settings } }
                            }).settings()];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    },
    saveNotificationInformation: function (root, _a, ctx) {
        var webPushInfos = _a.webPushInfos;
        return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = ctx.userId;
                        return [4 /*yield*/, ctx.db.updateUser({
                                where: { id: userId },
                                data: { notifications: { create: webPushInfos } }
                            }).notifications()];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    },
    sendTestNotification: function (root, _a, ctx) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var notificationInfos, payload, singleNotification, _i, notificationInfos_1, notify;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ctx.db.user({ id: ctx.userId }).notifications()];
                    case 1:
                        notificationInfos = _b.sent();
                        logger_1.log.info("sendTestNotification - " + id + " ");
                        payload = NotificationService_1.notification.buildPayload({
                            body: '🌞 - Notifikation gesendet - ' + moment().toISOString(),
                            title: '🚀 Test Notifikation an Gerät: ',
                            actionTitle: '⭐ Button ⭐'
                        });
                        if (!id) return [3 /*break*/, 4];
                        singleNotification = notificationInfos.find(function (e) { return e.id === id; });
                        payload.notification.title += ' ' + singleNotification.name;
                        if (!singleNotification) return [3 /*break*/, 3];
                        return [4 /*yield*/, NotificationService_1.notification.sendNotificationToUserEndpoint(ctx.db.user({ id: ctx.userId }), payload, singleNotification.notificationInformation)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                    case 4:
                        _i = 0, notificationInfos_1 = notificationInfos;
                        _b.label = 5;
                    case 5:
                        if (!(_i < notificationInfos_1.length)) return [3 /*break*/, 8];
                        notify = notificationInfos_1[_i];
                        payload.notification.title = '🚀 Test Notifikation an Gerät ' + notify.name;
                        return [4 /*yield*/, NotificationService_1.notification.sendNotificationToUserEndpoint(ctx.db.user({ id: ctx.userId }), payload, notify.notificationInformation)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, true];
                }
            });
        });
    },
    deleteNotificationInformation: function (root, _a, ctx) {
        var id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var usersNotification, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ctx.db.user({
                            id: ctx.userId
                        }).notifications({
                            where: { id: id }
                        })];
                    case 1:
                        usersNotification = _c.sent();
                        _b = usersNotification.length > 0;
                        if (!_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, ctx.db.$exists.webPushNotification({ id: id })];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        if (!_b) return [3 /*break*/, 5];
                        return [4 /*yield*/, ctx.db.deleteWebPushNotification({ id: id })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 5: return [2 /*return*/, false];
                }
            });
        });
    }
};
exports.UserSubscriptionResolver = __assign(__assign({}, graphqlgen_1.SubscriptionResolvers.defaultResolvers), { 
    // unused
    watchHasBuddy: {
        subscribe: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var pId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.db.user({ id: ctx.userId }).patient().id()];
                    case 1:
                        pId = _a.sent();
                        return [2 /*return*/, ctx.db.$subscribe.buddy({
                                mutation_in: ['CREATED', 'UPDATED', 'DELETED'],
                                node: { patient: { id: pId } }
                            }).node()];
                }
            });
        }); },
        resolve: function (root) { return root; }
    }, 
    // unused
    watchUser: {
        subscribe: function (root, args, ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                userId = ctx.userId;
                return [2 /*return*/, ctx.db.$subscribe.user({
                        mutation_in: ['UPDATED'],
                        node: { id: userId }
                    }).node()];
            });
        }); },
        resolve: function (root) {
            logger_1.log.info('resolving watch User' + root.username);
            return root;
        }
    } });
