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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.removeOpenRequests = exports.matchUp = exports.MatchingHelper = exports.matchesSorter = void 0;
var logger_1 = require("../logger");
var tasks_1 = require("../tasks/tasks");
exports.matchesSorter = function (a, b) {
    return a.matchingScore < b.matchingScore ? 1 : -1;
};
var MatchingHelper = /** @class */ (function () {
    function MatchingHelper(settings) {
        this.PHQ_LOW_MIN = settings.phqGroupLowMin;
        this.PHQ_LOW_MAX = settings.phqGroupLowMax;
        this.IPAQ_GROUP_LOW_MAX = settings.ipaqGroupLowMax;
        this.IPAQ_GROUP_MODERATE_MAX = settings.ipaqGroupModerateMax;
        this.IPAQ_GROUP_HIGH_MAX = settings.ipaqGroupHighMax;
        this.MATCHING_PERCENT_MIN = settings.matchingPercentageCap;
    }
    MatchingHelper.prototype.findMatches = function (userId, db) {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, potentialUsers, potentialBuddys, buddiesScored, buddiesSorted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collectInfo(userId, db)];
                    case 1:
                        userInfo = _a.sent();
                        if (!userInfo) {
                            logger_1.log.info('MATCHING - requesting userinfo ' + JSON.stringify(userInfo, null, ' '));
                            logger_1.log.error('User not Ready for matching!', new Error);
                        }
                        return [4 /*yield*/, db.users({
                                where: {
                                    role: 'PATIENT',
                                    AND: [
                                        { patient: { verified: true } },
                                        { id_not: userId },
                                        { patient: { NOT: { buddy: {} } } }
                                    ]
                                }
                            })];
                    case 2:
                        potentialUsers = _a.sent();
                        logger_1.log.info('MATCHING - users ' + potentialUsers.length + ' User ');
                        return [4 /*yield*/, this.collectUsersMatchingInfo(potentialUsers, db)];
                    case 3:
                        potentialBuddys = _a.sent();
                        logger_1.log.info('MATCHING - buddy infos ' + potentialBuddys.length + ' User ');
                        return [4 /*yield*/, this.getMatchingScores(userInfo, potentialBuddys)];
                    case 4:
                        buddiesScored = _a.sent();
                        buddiesSorted = buddiesScored.sort(exports.matchesSorter);
                        return [2 /*return*/, buddiesSorted];
                }
            });
        });
    };
    MatchingHelper.prototype.getOverlapMatch = function (userId, possibleMatches, db) {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, pid, patientIds, existingReq, overlapMatchUsers, _i, existingReq_1, er, _a, _b, potentialBuddys, buddiesScored, matchesSorted, _c, matchesSorted_1, s, match;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.collectInfo(userId, db)];
                    case 1:
                        userInfo = _d.sent();
                        return [4 /*yield*/, db.user({ id: userId }).patient().id()];
                    case 2:
                        pid = _d.sent();
                        if (!userInfo) {
                            logger_1.log.info('MATCHING - requesting userinfo ' + JSON.stringify(userInfo, null, ' '));
                            logger_1.log.error('User not Ready for matching!', new Error);
                        }
                        return [4 /*yield*/, db.patients({ where: { user: { id_in: possibleMatches } } })];
                    case 3:
                        patientIds = (_d.sent()).map(function (r) { return r.id; });
                        return [4 /*yield*/, db.buddyRequests({
                                where: {
                                    to: { id: pid },
                                    from: { id_in: patientIds },
                                    state: "SEND"
                                }
                            })];
                    case 4:
                        existingReq = _d.sent();
                        if (existingReq.length === 0) {
                            // no existing requests -> exit and create some requests
                            return [2 /*return*/, undefined];
                        }
                        overlapMatchUsers = new Array();
                        _i = 0, existingReq_1 = existingReq;
                        _d.label = 5;
                    case 5:
                        if (!(_i < existingReq_1.length)) return [3 /*break*/, 8];
                        er = existingReq_1[_i];
                        _b = (_a = overlapMatchUsers).push;
                        return [4 /*yield*/, db.buddyRequest({ id: er.id }).from().user()];
                    case 6:
                        _b.apply(_a, [_d.sent()]);
                        _d.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [4 /*yield*/, this.collectUsersMatchingInfo(overlapMatchUsers, db)];
                    case 9:
                        potentialBuddys = _d.sent();
                        return [4 /*yield*/, this.getMatchingScores(userInfo, potentialBuddys)];
                    case 10:
                        buddiesScored = _d.sent();
                        matchesSorted = buddiesScored.sort(exports.matchesSorter);
                        logger_1.log.info('SORTED MATCHES:');
                        for (_c = 0, matchesSorted_1 = matchesSorted; _c < matchesSorted_1.length; _c++) {
                            s = matchesSorted_1[_c];
                            logger_1.log.info("NAME: " + s.user.username + " SCORE " + s.matchingScore);
                        }
                        match = matchesSorted.length > 0 ? matchesSorted[0] : undefined;
                        return [2 /*return*/, match];
                }
            });
        });
    };
    MatchingHelper.prototype.instantMatch = function (userId, db) {
        return __awaiter(this, void 0, void 0, function () {
            var pid, existingBuddy, matches, bestMatch, buddyPatId, buddyRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.user({ id: userId }).patient().id()];
                    case 1:
                        pid = _a.sent();
                        return [4 /*yield*/, db.patient({ id: pid }).buddy()];
                    case 2:
                        existingBuddy = _a.sent();
                        if (existingBuddy) {
                            // abort
                            logger_1.log.info("ABORT INSTANT MATCH");
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, this.findMatches(userId, db)];
                    case 3:
                        matches = _a.sent();
                        if (matches.length <= 0) {
                            return [2 /*return*/, undefined];
                        }
                        if (matches[0].matchingScore < this.MATCHING_PERCENT_MIN) {
                            return [2 /*return*/, undefined];
                        }
                        bestMatch = matches[0];
                        return [4 /*yield*/, db.user({ id: bestMatch.user.id }).patient().id()];
                    case 4:
                        buddyPatId = _a.sent();
                        return [4 /*yield*/, db.createBuddyRequest({
                                from: { connect: { id: pid } },
                                to: { connect: { id: buddyPatId } },
                                state: "SEND"
                            })];
                    case 5:
                        buddyRequest = _a.sent();
                        return [4 /*yield*/, matchUp(true, pid, buddyPatId, db)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, bestMatch];
                }
            });
        });
    };
    MatchingHelper.prototype.collectUsersMatchingInfo = function (users, db) {
        return __awaiter(this, void 0, void 0, function () {
            var potentialBuddys, _i, _a, bud, info;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        potentialBuddys = new Array();
                        _i = 0;
                        return [4 /*yield*/, users];
                    case 1:
                        _a = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        bud = _a[_i];
                        return [4 /*yield*/, this.collectInfo(bud.id, db)];
                    case 3:
                        info = _b.sent();
                        if (info) {
                            // log.info(`Collected Info: ${JSON.stringify(info, null, ' ')}`);
                            potentialBuddys.push(info);
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, potentialBuddys];
                }
            });
        });
    };
    MatchingHelper.prototype.getMatchingScores = function (userInfo, potentialBuddies) {
        return __awaiter(this, void 0, void 0, function () {
            var buddyMatches, _i, _a, buddyInfo, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        buddyMatches = new Array();
                        _i = 0;
                        return [4 /*yield*/, potentialBuddies];
                    case 1:
                        _a = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        buddyInfo = _a[_i];
                        _c = (_b = buddyMatches).push;
                        return [4 /*yield*/, this.getUserMatchingScore(userInfo, buddyInfo)];
                    case 3:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, buddyMatches];
                }
            });
        });
    };
    MatchingHelper.prototype.getUserMatchingScore = function (userInfo, buddyInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var scoreGender, scorePhq, scoreIpaq, scoreSports, scoreMeeting, score, match, user, matchLog;
            return __generator(this, function (_a) {
                // const matchingUser = potentialUsers.find(u => u.id === buddyInfo.id);
                logger_1.log.info('MATCHING - name ' + buddyInfo.user.username);
                scoreGender = this.genderMatching(userInfo, buddyInfo);
                scorePhq = this.phqMatching(userInfo.phqScore, buddyInfo.phqScore);
                scoreIpaq = this.ipaqMatching(userInfo.ipaqScore, buddyInfo.ipaqScore);
                scoreSports = this.sportsMatching(userInfo.sports, buddyInfo.sports);
                scoreMeeting = this.meetingMatching(userInfo, buddyInfo);
                score = scoreGender + scorePhq + scoreIpaq + scoreSports + scoreMeeting;
                match = {
                    user: buddyInfo.user,
                    matchingScore: Math.round(score),
                    genderScore: Math.round(scoreGender),
                    ipaqScore: Math.round(scoreIpaq),
                    meetingScore: Math.round(scoreMeeting),
                    phqScore: Math.round(scorePhq),
                    sportsScore: Math.round(scoreSports)
                };
                user = match.user, matchLog = __rest(match, ["user"]);
                logger_1.log.info('MATCHING SCORE: ' + logger_1.logFormat(matchLog));
                return [2 /*return*/, match];
            });
        });
    };
    MatchingHelper.prototype.phqMatching = function (uScore, bScore) {
        // PHQ score groups: 10-18 & 19-27
        // PHQ never match users of same group together!
        // PHQ weight: 50%
        logger_1.log.info('phqMatching' + uScore + ' - ' + bScore);
        // low phq group
        var matchingScore = 0;
        if (uScore >= this.PHQ_LOW_MIN && uScore <= this.PHQ_LOW_MAX) {
            if (bScore >= this.PHQ_LOW_MIN && bScore <= this.PHQ_LOW_MAX) {
                matchingScore = 0;
            }
            else {
                matchingScore = 50;
            }
        }
        else if (uScore > this.PHQ_LOW_MAX) { // high phq group
            if (bScore > this.PHQ_LOW_MAX) {
                matchingScore = 0;
            }
            else {
                matchingScore = 50;
            }
        }
        return matchingScore;
    };
    MatchingHelper.prototype.ipaqMatching = function (uScore, bScore) {
        var IPAQ_LOW_MIN = 0;
        // IPAQ grouping
        // - low & mid, 
        // - mid & high, 
        // - NOT low & mid
        // IPAQ weight: 20%
        var matchingScore = 0;
        if (uScore >= IPAQ_LOW_MIN && uScore <= this.IPAQ_GROUP_LOW_MAX) {
            // low activity group
            if (bScore >= IPAQ_LOW_MIN && bScore <= this.IPAQ_GROUP_LOW_MAX) {
                matchingScore = 20;
            }
            else if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
                // match low with mid
                matchingScore = 10;
            }
        }
        else if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
            // mid group
            if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
                // match mid with mid
                matchingScore = 20;
            }
            else if (bScore >= IPAQ_LOW_MIN && bScore <= this.IPAQ_GROUP_LOW_MAX) {
                // match mid with low
                matchingScore = 10;
            }
            else if (bScore > this.IPAQ_GROUP_MODERATE_MAX && bScore <= this.IPAQ_GROUP_HIGH_MAX) {
                // match mid with high
                matchingScore = 10;
            }
        }
        else if (uScore >= this.IPAQ_GROUP_MODERATE_MAX) { // high activity group
            if (bScore >= this.IPAQ_GROUP_MODERATE_MAX) {
                // match high with high
                matchingScore = 20;
            }
            else if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
                // match high with mid
                matchingScore = 10;
            }
        }
        return matchingScore;
    };
    MatchingHelper.prototype.sportsMatching = function (user, buddy) {
        // sports Weight: 20%
        var weight = 10;
        var matchingScore = 0;
        var _loop_1 = function (a) {
            if (buddy.findIndex(function (e) { return e.key === a.key; }) > -1) {
                matchingScore += 1;
            }
        };
        for (var _i = 0, user_1 = user; _i < user_1.length; _i++) {
            var a = user_1[_i];
            _loop_1(a);
        }
        matchingScore = matchingScore / 100 * weight;
        return matchingScore;
    };
    MatchingHelper.prototype.genderMatching = function (user, buddy) {
        // same Gender: Weight 10%
        var matchingScore = 0;
        logger_1.log.info('MATCHING - Gender ' + user.sameGender + '  ');
        if (user.sameGender) {
            if (user.gender === buddy.gender) {
                matchingScore = 10;
            }
        }
        else {
            matchingScore = 10;
        }
        return matchingScore;
    };
    MatchingHelper.prototype.meetingMatching = function (user, buddy) {
        // meeting desired weight: ? - set to 10% for now
        var weight = 10;
        var matchingScore = 0;
        if (user.meetingDesired && buddy.meetingDesired) {
            matchingScore = 5;
            if (user.sameGender && user.gender === buddy.gender) {
                matchingScore += 5;
            }
        }
        matchingScore = matchingScore / 100 * weight;
        return matchingScore;
    };
    MatchingHelper.prototype.collectInfo = function (userId, db) {
        return __awaiter(this, void 0, void 0, function () {
            var user, lastIpaq, ipaqScore, lastPhq, phqScore, userProfile, sports, userMatchingInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.user({ id: userId })];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, db.user({ id: userId }).patient().quests().ipaqs({
                                last: 1
                            })];
                    case 2:
                        lastIpaq = _a.sent();
                        // log.info(`Matching Info Ipaq: ${JSON.stringify(lastIpaq, null, ' ')}`);
                        if (!lastIpaq || lastIpaq.length <= 0)
                            return [2 /*return*/, undefined];
                        ipaqScore = lastIpaq && lastIpaq.pop().score;
                        return [4 /*yield*/, db.user({ id: userId }).patient().quests().phq9s({
                                last: 1
                            })];
                    case 3:
                        lastPhq = _a.sent();
                        //log.info(`Matching Info Phq: ${JSON.stringify(lastPhq, null, ' ')}`);
                        if (!lastPhq || lastPhq.length <= 0)
                            return [2 /*return*/, undefined];
                        phqScore = lastPhq && lastPhq.pop().score;
                        return [4 /*yield*/, db.user({ id: userId }).patient().profile()];
                    case 4:
                        userProfile = _a.sent();
                        return [4 /*yield*/, db.user({ id: userId }).patient().profile().profileActivities()];
                    case 5:
                        sports = _a.sent();
                        // log.info(`Matching Profile: ${JSON.stringify(userProf, null, ' ')}`);
                        // log.info(`Matching Sports: ${JSON.stringify(sports, null, ' ')}`);
                        // log.info(`Matching Info Sports: ${sports.map(s => s.titel)}`);
                        if (!userProfile || !sports || sports.length <= 0)
                            return [2 /*return*/, undefined];
                        userMatchingInfo = {
                            user: user,
                            gender: userProfile.gender,
                            sameGender: userProfile.sameGender,
                            meetingDesired: userProfile.meetingDesired,
                            ipaqScore: ipaqScore,
                            phqScore: phqScore,
                            sports: sports
                        };
                        this.logUserInfo(userMatchingInfo);
                        return [2 /*return*/, userMatchingInfo];
                }
            });
        });
    };
    MatchingHelper.prototype.logUserInfo = function (usrInfo) {
        usrInfo.sports[0].key;
        var usr = __assign({ name: usrInfo.user.username, sports: __spreadArrays(usrInfo.sports.map(function (s) { return s.key; })) }, usrInfo);
        delete usr.user;
        delete usr.sports;
        logger_1.log.info("Profile Info: " + JSON.stringify(usr, null, ' '));
    };
    return MatchingHelper;
}());
exports.MatchingHelper = MatchingHelper;
function matchUp(accepted, patientId, newBuddyPatientId, db) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, req, chat, usersBuddy, buddiesBuddy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.patient({ id: patientId }).user().id()];
                case 1:
                    userId = _a.sent();
                    return [4 /*yield*/, db.buddyRequests({
                            where: {
                                from: { id: patientId },
                                to: { id: newBuddyPatientId }
                            }
                        })];
                case 2:
                    req = (_a.sent())[0];
                    if (!!accepted) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.updateBuddyRequest({
                            where: { id: req.id },
                            data: { state: 'DENIED' }
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, undefined];
                case 4: 
                // remove all other open requests
                return [4 /*yield*/, removeOpenRequests(req.id, patientId, db)];
                case 5:
                    // remove all other open requests
                    _a.sent();
                    return [4 /*yield*/, removeOpenRequests(req.id, newBuddyPatientId, db)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.updateBuddyRequest({
                            where: { id: req.id },
                            data: { state: 'CONFIRMED' }
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db.createChat({
                            bot: { create: { name: 'roBot' } }
                        })];
                case 8:
                    chat = _a.sent();
                    return [4 /*yield*/, db.createBuddy({
                            patient: { connect: { id: newBuddyPatientId } },
                            chat: { connect: chat }
                        })
                        // link this users buddy with other users buddy
                    ];
                case 9:
                    usersBuddy = _a.sent();
                    // link this users buddy with other users buddy
                    return [4 /*yield*/, db.updatePatient({
                            where: { id: patientId },
                            data: { buddy: { connect: usersBuddy } }
                        })
                        // create buddy for requesting user
                    ];
                case 10:
                    // link this users buddy with other users buddy
                    _a.sent();
                    return [4 /*yield*/, db.createBuddy({
                            patient: { connect: { id: patientId } },
                            chat: { connect: chat }
                        })
                        // link others users buddy with this users buddy 
                    ];
                case 11:
                    buddiesBuddy = _a.sent();
                    // link others users buddy with this users buddy 
                    return [4 /*yield*/, db.updatePatient({
                            where: { id: newBuddyPatientId },
                            data: { buddy: { connect: buddiesBuddy } }
                        })
                        // create tasks
                    ];
                case 12:
                    // link others users buddy with this users buddy 
                    _a.sent();
                    // create tasks
                    tasks_1.taskScheduler.setupAfterMatchTasks({
                        chatId: chat.id,
                        userId: userId
                    }, db);
                    return [2 /*return*/, chat];
            }
        });
    });
}
exports.matchUp = matchUp;
function removeOpenRequests(excludeId, patientId, db) {
    return __awaiter(this, void 0, void 0, function () {
        var requests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.updateManyBuddyRequests({
                        where: {
                            OR: [
                                { from: { id: patientId } },
                                { to: { id: patientId } }
                            ],
                            id_not: excludeId
                        }, data: { state: 'REMOVED' }
                    })];
                case 1:
                    requests = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeOpenRequests = removeOpenRequests;
