"use strict";
// Code generated by github.com/prisma/graphqlgen, DO NOT EDIT.
exports.__esModule = true;
exports.SubscriptionResolvers = exports.AuthPayloadResolvers = exports.MutationResolvers = exports.BuddyRequestResolvers = exports.BuddyMatchResolvers = exports.AdminUserTableResolvers = exports.UserActivityResolvers = exports.FavoriteActivityResolvers = exports.IpaqAnswersResolvers = exports.IpaqResolvers = exports.Phq9Resolvers = exports.QuestionnairesResolvers = exports.SensorDataResolvers = exports.ActivityResolvers = exports.CalendarEntryResolvers = exports.ChatMessageAttachmentResolvers = exports.BotResolvers = exports.ChatMessageResolvers = exports.ChatResolvers = exports.BuddyResolvers = exports.ProfileActivityResolvers = exports.PatientProfileInfoResolvers = exports.PatientResolvers = exports.WebPushNotificationResolvers = exports.UserSettingsResolvers = exports.UserResolvers = exports.QueryResolvers = void 0;
var QueryResolvers;
(function (QueryResolvers) {
    QueryResolvers.defaultResolvers = {};
})(QueryResolvers = exports.QueryResolvers || (exports.QueryResolvers = {}));
var UserResolvers;
(function (UserResolvers) {
    UserResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) { return parent.createdAt; },
        updatedAt: function (parent) { return parent.updatedAt; },
        username: function (parent) { return parent.username; },
        role: function (parent) { return parent.role; },
        lastActive: function (parent) {
            return parent.lastActive === undefined ? null : parent.lastActive;
        }
    };
})(UserResolvers = exports.UserResolvers || (exports.UserResolvers = {}));
var UserSettingsResolvers;
(function (UserSettingsResolvers) {
    UserSettingsResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        themeName: function (parent) {
            return parent.themeName === undefined ? null : parent.themeName;
        }
    };
})(UserSettingsResolvers = exports.UserSettingsResolvers || (exports.UserSettingsResolvers = {}));
var WebPushNotificationResolvers;
(function (WebPushNotificationResolvers) {
    WebPushNotificationResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) { return parent.createdAt; },
        updatedAt: function (parent) { return parent.updatedAt; },
        name: function (parent) { return parent.name; },
        notificationInformation: function (parent) {
            return parent.notificationInformation;
        }
    };
})(WebPushNotificationResolvers = exports.WebPushNotificationResolvers || (exports.WebPushNotificationResolvers = {}));
var PatientResolvers;
(function (PatientResolvers) {
    PatientResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) { return parent.createdAt; },
        updatedAt: function (parent) { return parent.updatedAt; },
        verificationCode: function (parent) { return parent.verificationCode; },
        verified: function (parent) {
            return parent.verified === undefined ? null : parent.verified;
        },
        online: function (parent) {
            return parent.online === undefined ? null : parent.online;
        },
        activeMinutesPerWeek: function (parent) {
            return parent.activeMinutesPerWeek === undefined
                ? null
                : parent.activeMinutesPerWeek;
        }
    };
})(PatientResolvers = exports.PatientResolvers || (exports.PatientResolvers = {}));
var PatientProfileInfoResolvers;
(function (PatientProfileInfoResolvers) {
    PatientProfileInfoResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) { return parent.createdAt; },
        updatedAt: function (parent) { return parent.updatedAt; },
        birthday: function (parent) {
            return parent.birthday === undefined ? null : parent.birthday;
        },
        gender: function (parent) {
            return parent.gender === undefined ? null : parent.gender;
        },
        sameGender: function (parent) {
            return parent.sameGender === undefined ? null : parent.sameGender;
        },
        hideGender: function (parent) {
            return parent.hideGender === undefined ? null : parent.hideGender;
        },
        meetingDesired: function (parent) {
            return parent.meetingDesired === undefined ? null : parent.meetingDesired;
        },
        avatar: function (parent) { return parent.avatar; }
    };
})(PatientProfileInfoResolvers = exports.PatientProfileInfoResolvers || (exports.PatientProfileInfoResolvers = {}));
var ProfileActivityResolvers;
(function (ProfileActivityResolvers) {
    ProfileActivityResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) {
            return parent.createdAt === undefined ? null : parent.createdAt;
        },
        updatedAt: function (parent) {
            return parent.updatedAt === undefined ? null : parent.updatedAt;
        },
        key: function (parent) { return parent.key; },
        icon: function (parent) { return parent.icon; },
        titel: function (parent) { return parent.titel; }
    };
})(ProfileActivityResolvers = exports.ProfileActivityResolvers || (exports.ProfileActivityResolvers = {}));
var BuddyResolvers;
(function (BuddyResolvers) {
    BuddyResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; }
    };
})(BuddyResolvers = exports.BuddyResolvers || (exports.BuddyResolvers = {}));
var ChatResolvers;
(function (ChatResolvers) {
    ChatResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; }
    };
})(ChatResolvers = exports.ChatResolvers || (exports.ChatResolvers = {}));
var ChatMessageResolvers;
(function (ChatMessageResolvers) {
    ChatMessageResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) {
            return parent.createdAt === undefined ? null : parent.createdAt;
        },
        updatedAt: function (parent) {
            return parent.updatedAt === undefined ? null : parent.updatedAt;
        },
        text: function (parent) {
            return parent.text === undefined ? null : parent.text;
        }
    };
})(ChatMessageResolvers = exports.ChatMessageResolvers || (exports.ChatMessageResolvers = {}));
var BotResolvers;
(function (BotResolvers) {
    BotResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        name: function (parent) { return (parent.name === undefined ? null : parent.name); }
    };
})(BotResolvers = exports.BotResolvers || (exports.BotResolvers = {}));
var ChatMessageAttachmentResolvers;
(function (ChatMessageAttachmentResolvers) {
    ChatMessageAttachmentResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        originalCalendarEntryId: function (parent) {
            return parent.originalCalendarEntryId === undefined
                ? null
                : parent.originalCalendarEntryId;
        },
        ownerId: function (parent) {
            return parent.ownerId === undefined ? null : parent.ownerId;
        }
    };
})(ChatMessageAttachmentResolvers = exports.ChatMessageAttachmentResolvers || (exports.ChatMessageAttachmentResolvers = {}));
var CalendarEntryResolvers;
(function (CalendarEntryResolvers) {
    CalendarEntryResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) {
            return parent.createdAt === undefined ? null : parent.createdAt;
        },
        updatedAt: function (parent) {
            return parent.updatedAt === undefined ? null : parent.updatedAt;
        },
        startTime: function (parent) { return parent.startTime; },
        endTime: function (parent) { return parent.endTime; },
        isDone: function (parent) {
            return parent.isDone === undefined ? null : parent.isDone;
        },
        isRunning: function (parent) {
            return parent.isRunning === undefined ? null : parent.isRunning;
        },
        trackingRequested: function (parent) {
            return parent.trackingRequested === undefined ? null : parent.trackingRequested;
        }
    };
})(CalendarEntryResolvers = exports.CalendarEntryResolvers || (exports.CalendarEntryResolvers = {}));
var ActivityResolvers;
(function (ActivityResolvers) {
    ActivityResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) {
            return parent.createdAt === undefined ? null : parent.createdAt;
        },
        updatedAt: function (parent) {
            return parent.updatedAt === undefined ? null : parent.updatedAt;
        },
        key: function (parent) { return parent.key; },
        titel: function (parent) {
            return parent.titel === undefined ? null : parent.titel;
        },
        description: function (parent) {
            return parent.description === undefined ? null : parent.description;
        },
        grade: function (parent) {
            return parent.grade === undefined ? null : parent.grade;
        },
        icon: function (parent) {
            return parent.icon === undefined ? null : parent.icon;
        },
        tags: function (parent) { return parent.tags; },
        isCustom: function (parent) {
            return parent.isCustom === undefined ? null : parent.isCustom;
        },
        color: function (parent) {
            return parent.color === undefined ? null : parent.color;
        }
    };
})(ActivityResolvers = exports.ActivityResolvers || (exports.ActivityResolvers = {}));
var SensorDataResolvers;
(function (SensorDataResolvers) {
    SensorDataResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) {
            return parent.createdAt === undefined ? null : parent.createdAt;
        },
        updatedAt: function (parent) {
            return parent.updatedAt === undefined ? null : parent.updatedAt;
        },
        type: function (parent) { return parent.type; },
        x: function (parent) { return (parent.x === undefined ? null : parent.x); },
        y: function (parent) { return (parent.y === undefined ? null : parent.y); },
        z: function (parent) { return (parent.z === undefined ? null : parent.z); },
        alpha: function (parent) {
            return parent.alpha === undefined ? null : parent.alpha;
        },
        beta: function (parent) {
            return parent.beta === undefined ? null : parent.beta;
        },
        gamma: function (parent) {
            return parent.gamma === undefined ? null : parent.gamma;
        }
    };
})(SensorDataResolvers = exports.SensorDataResolvers || (exports.SensorDataResolvers = {}));
var QuestionnairesResolvers;
(function (QuestionnairesResolvers) {
    QuestionnairesResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; }
    };
})(QuestionnairesResolvers = exports.QuestionnairesResolvers || (exports.QuestionnairesResolvers = {}));
var Phq9Resolvers;
(function (Phq9Resolvers) {
    Phq9Resolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) { return parent.createdAt; },
        updatedAt: function (parent) { return parent.updatedAt; },
        answers: function (parent) { return parent.answers; },
        score: function (parent) { return (parent.score === undefined ? null : parent.score); },
        isComplete: function (parent) {
            return parent.isComplete === undefined ? null : parent.isComplete;
        },
        expiryDate: function (parent) {
            return parent.expiryDate === undefined ? null : parent.expiryDate;
        }
    };
})(Phq9Resolvers = exports.Phq9Resolvers || (exports.Phq9Resolvers = {}));
var IpaqResolvers;
(function (IpaqResolvers) {
    IpaqResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) { return parent.createdAt; },
        updatedAt: function (parent) { return parent.updatedAt; },
        score: function (parent) { return (parent.score === undefined ? null : parent.score); },
        expiryDate: function (parent) {
            return parent.expiryDate === undefined ? null : parent.expiryDate;
        },
        isComplete: function (parent) {
            return parent.isComplete === undefined ? null : parent.isComplete;
        }
    };
})(IpaqResolvers = exports.IpaqResolvers || (exports.IpaqResolvers = {}));
var IpaqAnswersResolvers;
(function (IpaqAnswersResolvers) {
    IpaqAnswersResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        numDays: function (parent) {
            return parent.numDays === undefined ? null : parent.numDays;
        },
        numHours: function (parent) {
            return parent.numHours === undefined ? null : parent.numHours;
        },
        numMinutes: function (parent) {
            return parent.numMinutes === undefined ? null : parent.numMinutes;
        }
    };
})(IpaqAnswersResolvers = exports.IpaqAnswersResolvers || (exports.IpaqAnswersResolvers = {}));
var FavoriteActivityResolvers;
(function (FavoriteActivityResolvers) {
    FavoriteActivityResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) {
            return parent.createdAt === undefined ? null : parent.createdAt;
        },
        updatedAt: function (parent) {
            return parent.updatedAt === undefined ? null : parent.updatedAt;
        },
        activityKey: function (parent) { return parent.activityKey; }
    };
})(FavoriteActivityResolvers = exports.FavoriteActivityResolvers || (exports.FavoriteActivityResolvers = {}));
var UserActivityResolvers;
(function (UserActivityResolvers) {
    UserActivityResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) {
            return parent.createdAt === undefined ? null : parent.createdAt;
        },
        updatedAt: function (parent) {
            return parent.updatedAt === undefined ? null : parent.updatedAt;
        },
        key: function (parent) { return parent.key; },
        titel: function (parent) {
            return parent.titel === undefined ? null : parent.titel;
        },
        description: function (parent) {
            return parent.description === undefined ? null : parent.description;
        },
        icon: function (parent) {
            return parent.icon === undefined ? null : parent.icon;
        },
        tags: function (parent) { return parent.tags; },
        isFavorite: function (parent) {
            return parent.isFavorite === undefined ? null : parent.isFavorite;
        },
        isCustom: function (parent) {
            return parent.isCustom === undefined ? null : parent.isCustom;
        },
        color: function (parent) {
            return parent.color === undefined ? null : parent.color;
        }
    };
})(UserActivityResolvers = exports.UserActivityResolvers || (exports.UserActivityResolvers = {}));
var AdminUserTableResolvers;
(function (AdminUserTableResolvers) {
    AdminUserTableResolvers.defaultResolvers = {
        user: function (parent) { return parent.user; },
        lastIpaqScore: function (parent) {
            return parent.lastIpaqScore === undefined ? null : parent.lastIpaqScore;
        },
        ipaqDelta: function (parent) {
            return parent.ipaqDelta === undefined ? null : parent.ipaqDelta;
        },
        lastPhqScore: function (parent) {
            return parent.lastPhqScore === undefined ? null : parent.lastPhqScore;
        },
        phqDelta: function (parent) {
            return parent.phqDelta === undefined ? null : parent.phqDelta;
        },
        activeMinutesPlanned: function (parent) {
            return parent.activeMinutesPlanned === undefined
                ? null
                : parent.activeMinutesPlanned;
        },
        activeMinutesGoal: function (parent) {
            return parent.activeMinutesGoal === undefined ? null : parent.activeMinutesGoal;
        },
        lastSendMessage: function (parent) {
            return parent.lastSendMessage === undefined ? null : parent.lastSendMessage;
        },
        eventsCompletedPercent: function (parent) {
            return parent.eventsCompletedPercent === undefined
                ? null
                : parent.eventsCompletedPercent;
        }
    };
})(AdminUserTableResolvers = exports.AdminUserTableResolvers || (exports.AdminUserTableResolvers = {}));
var BuddyMatchResolvers;
(function (BuddyMatchResolvers) {
    BuddyMatchResolvers.defaultResolvers = {
        user: function (parent) { return parent.user; },
        matchingScore: function (parent) { return parent.matchingScore; },
        sportsScore: function (parent) {
            return parent.sportsScore === undefined ? null : parent.sportsScore;
        },
        ipaqScore: function (parent) {
            return parent.ipaqScore === undefined ? null : parent.ipaqScore;
        },
        phqScore: function (parent) {
            return parent.phqScore === undefined ? null : parent.phqScore;
        },
        genderScore: function (parent) {
            return parent.genderScore === undefined ? null : parent.genderScore;
        },
        meetingScore: function (parent) {
            return parent.meetingScore === undefined ? null : parent.meetingScore;
        }
    };
})(BuddyMatchResolvers = exports.BuddyMatchResolvers || (exports.BuddyMatchResolvers = {}));
var BuddyRequestResolvers;
(function (BuddyRequestResolvers) {
    BuddyRequestResolvers.defaultResolvers = {
        id: function (parent) { return parent.id; },
        createdAt: function (parent) { return parent.createdAt; },
        state: function (parent) {
            return parent.state === undefined ? null : parent.state;
        }
    };
})(BuddyRequestResolvers = exports.BuddyRequestResolvers || (exports.BuddyRequestResolvers = {}));
var MutationResolvers;
(function (MutationResolvers) {
    MutationResolvers.defaultResolvers = {};
})(MutationResolvers = exports.MutationResolvers || (exports.MutationResolvers = {}));
var AuthPayloadResolvers;
(function (AuthPayloadResolvers) {
    AuthPayloadResolvers.defaultResolvers = {
        token: function (parent) { return parent.token; },
        user: function (parent) { return parent.user; }
    };
})(AuthPayloadResolvers = exports.AuthPayloadResolvers || (exports.AuthPayloadResolvers = {}));
var SubscriptionResolvers;
(function (SubscriptionResolvers) {
    SubscriptionResolvers.defaultResolvers = {};
})(SubscriptionResolvers = exports.SubscriptionResolvers || (exports.SubscriptionResolvers = {}));
