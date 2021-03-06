"use strict";
// Code generated by Prisma (prisma@1.34.10). DO NOT EDIT.
// Please don't change this file manually but run `prisma generate` to update it.
// For more information, please read the docs: https://www.prisma.io/docs/prisma-client/
exports.__esModule = true;
exports.prisma = exports.Prisma = exports.models = void 0;
var prisma_client_lib_1 = require("prisma-client-lib");
var prisma_schema_1 = require("./prisma-schema");
/**
 * Model Metadata
 */
exports.models = [
    {
        name: "User",
        embedded: false
    },
    {
        name: "WebPushNotification",
        embedded: false
    },
    {
        name: "UserSettings",
        embedded: false
    },
    {
        name: "Patient",
        embedded: false
    },
    {
        name: "PatientProfileInfo",
        embedded: false
    },
    {
        name: "BuddyRequest",
        embedded: false
    },
    {
        name: "Buddy",
        embedded: false
    },
    {
        name: "Chat",
        embedded: false
    },
    {
        name: "ChatMessage",
        embedded: false
    },
    {
        name: "ChatMessageAttachment",
        embedded: false
    },
    {
        name: "Bot",
        embedded: false
    },
    {
        name: "ScheduledTask",
        embedded: false
    },
    {
        name: "Questionnaires",
        embedded: false
    },
    {
        name: "Phq9",
        embedded: false
    },
    {
        name: "Ipaq",
        embedded: false
    },
    {
        name: "IpaqAnswers",
        embedded: false
    },
    {
        name: "ProfileActivity",
        embedded: false
    },
    {
        name: "Activity",
        embedded: false
    },
    {
        name: "FavoriteActivity",
        embedded: false
    },
    {
        name: "CalendarEntry",
        embedded: false
    },
    {
        name: "SensorData",
        embedded: false
    },
    {
        name: "Group",
        embedded: false
    },
    {
        name: "Category",
        embedded: false
    },
    {
        name: "Challenge",
        embedded: false
    },
    {
        name: "ChallengeGroup",
        embedded: false
    },
    {
        name: "ChallengeCategory",
        embedded: false
    },
    {
        name: "JoinedChallenges",
        embedded: false
    },
    {
        name: "Initiator",
        embedded: false
    },
    {
        name: "Voting",
        embedded: false
    },
    {
        name: "GroupColor",
        embedded: false
    },
    {
        name: "UserRole",
        embedded: false
    },
    {
        name: "Gender",
        embedded: false
    },
    {
        name: "BuddyRequestState",
        embedded: false
    },
    {
        name: "TaskTypes",
        embedded: false
    },
    {
        name: "ActivityGrade",
        embedded: false
    },
    {
        name: "StatusChallegen",
        embedded: false
    },
    {
        name: "GlobalSettings",
        embedded: false
    },
    {
        name: "BotSettings",
        embedded: false
    },
    {
        name: "WebPushSettings",
        embedded: false
    },
    {
        name: "TimeSpan",
        embedded: false
    }
];
/**
 * Type Defs
 */
exports.Prisma = prisma_client_lib_1.makePrismaClientClass({
    typeDefs: prisma_schema_1.typeDefs,
    models: exports.models,
    endpoint: "" + process.env["PRISMA_ENDPOINT"],
    secret: "" + process.env["PRISMA_MANAGEMENT_API_SECRET"]
});
exports.prisma = new exports.Prisma();
