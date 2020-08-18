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
exports.__esModule = true;
exports.resolvers = void 0;
// Base Class
var graphqlgen_1 = require("../generated/graphqlgen");
// Nested resolvers for non-scalar types
var Ipaq_1 = require("./nested/Ipaq");
var Phq9_1 = require("./nested/Phq9");
var User_1 = require("./nested/User");
var Patient_1 = require("./nested/Patient");
var Activity_1 = require("./nested/Activity");
var Buddy_1 = require("./nested/Buddy");
var BuddyRequest_1 = require("./nested/BuddyRequest");
var Chat_1 = require("./nested/Chat");
var ChatMessage_1 = require("./nested/ChatMessage");
var ChatMessageAttachment_1 = require("./nested/ChatMessageAttachment");
var CalendarEntry_1 = require("./nested/CalendarEntry");
var Bot_1 = require("./nested/Bot");
var Questionnaires_1 = require("./nested/Questionnaires");
var IpaqAnswers_1 = require("./nested/IpaqAnswers");
var PatientProfileInfo_1 = require("./nested/PatientProfileInfo");
var UserActivity_1 = require("./nested/UserActivity");
var AdminUserTable_1 = require("./nested/AdminUserTable");
var SensorData_1 = require("./nested/SensorData");
// generated default Resolvers - no need to implement as there are no nested non-scalar fields
var AuthPayload_1 = require("../generated/tmp-resolvers/AuthPayload");
// import { Reminder } from '../generated/tmp-resolvers/Reminder';
var BuddyMatch_1 = require("../generated/tmp-resolvers/BuddyMatch");
var ProfileActivity_1 = require("../generated/tmp-resolvers/ProfileActivity");
var UserSettings_1 = require("../generated/tmp-resolvers/UserSettings");
var FavoriteActivity_1 = require("../generated/tmp-resolvers/FavoriteActivity");
var WebPushNotification_1 = require("../generated/tmp-resolvers/WebPushNotification");
var User_resolver_1 = require("./User.resolver");
var Admin_resolver_1 = require("./Admin.resolver");
var Quest_resolver_1 = require("./Quest.resolver");
var Matching_resolver_1 = require("./Matching.resolver");
var Chat_resolver_1 = require("./Chat.resolver");
var Activity_resolver_1 = require("./Activity.resolver");
var Calendar_resolver_1 = require("./Calendar.resolver");
var SensorData_resolver_1 = require("./SensorData.resolver");
var Query = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, graphqlgen_1.QueryResolvers.defaultResolvers), User_resolver_1.UserQueryResolver), Admin_resolver_1.AdminQueryResolver), Quest_resolver_1.QuestQueryResolver), Matching_resolver_1.MatchingQueryResolver), Chat_resolver_1.ChatQueryResolver), Activity_resolver_1.ActivityQueryResolver), Calendar_resolver_1.CalendarQueryResolver), SensorData_resolver_1.SensorDataQueryResolver);
var Mutation = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, graphqlgen_1.MutationResolvers.defaultResolvers), User_resolver_1.UserMutationResolver), Quest_resolver_1.QuestMutationsResolver), Matching_resolver_1.MatchingMutationResolver), Chat_resolver_1.ChatMutationResolver), Activity_resolver_1.ActivityMutationResolver), Calendar_resolver_1.CalendarMutationResolver), SensorData_resolver_1.SensorDataMutationResolver);
var Subscription = __assign(__assign(__assign(__assign(__assign(__assign({}, graphqlgen_1.SubscriptionResolvers.defaultResolvers), User_resolver_1.UserSubscriptionResolver), Matching_resolver_1.MatchingSubscriptionResolver), Chat_resolver_1.ChatSubscriptionResolver), Quest_resolver_1.QuestSubscriptionResolver), Calendar_resolver_1.CalendarSubscriptionResolver);
exports.resolvers = {
    // main operation types
    Query: Query,
    Mutation: Mutation,
    Subscription: Subscription,
    // nested field resolvers
    User: User_1.User,
    AdminUserTable: AdminUserTable_1.AdminUserTable,
    Patient: Patient_1.Patient,
    PatientProfileInfo: PatientProfileInfo_1.PatientProfileInfo,
    Buddy: Buddy_1.Buddy,
    BuddyRequest: BuddyRequest_1.BuddyRequest,
    Chat: Chat_1.Chat,
    ChatMessage: ChatMessage_1.ChatMessage,
    ChatMessageAttachment: ChatMessageAttachment_1.ChatMessageAttachment,
    CalendarEntry: CalendarEntry_1.CalendarEntry,
    Activity: Activity_1.Activity,
    Bot: Bot_1.Bot,
    Questionnaires: Questionnaires_1.Questionnaires,
    Phq9: Phq9_1.Phq9,
    Ipaq: Ipaq_1.Ipaq,
    IpaqAnswers: IpaqAnswers_1.IpaqAnswers,
    UserActivity: UserActivity_1.UserActivity,
    // default Resolvers - no need to implement as there are no nested fields
    AuthPayload: AuthPayload_1.AuthPayload,
    ProfileActivity: ProfileActivity_1.ProfileActivity,
    BuddyMatch: BuddyMatch_1.BuddyMatch,
    UserSettings: UserSettings_1.UserSettings,
    FavoriteActivity: FavoriteActivity_1.FavoriteActivity,
    WebPushNotification: WebPushNotification_1.WebPushNotification,
    // Reminder,
    // CreateCalendarInputArgs,
    SensorData: SensorData_1.SensorData
};
