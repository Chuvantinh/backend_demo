import { Context, BuddyMatch } from '../types';
import { Gender, Activity, GlobalSettings, ProfileActivity, BuddyRequest, User, ID_Input, Prisma } from '../generated/prisma-client';
import { log, logFormat } from '../logger';
import { taskScheduler } from '../tasks/tasks';

interface UserMatchingInfo {
  user: User,
  phqScore: number;
  ipaqScore: number;
  sameGender: boolean;
  meetingDesired: boolean;
  gender: Gender;
  sports: ProfileActivity[];
}

export const matchesSorter = (a: BuddyMatch, b: BuddyMatch): number => {
  return a.matchingScore < b.matchingScore ? 1 : -1;
}

export class MatchingHelper {
  private PHQ_LOW_MIN: number;
  private PHQ_LOW_MAX: number;

  private IPAQ_GROUP_LOW_MAX: number;
  private IPAQ_GROUP_MODERATE_MAX: number;
  private IPAQ_GROUP_HIGH_MAX: number;

  private MATCHING_PERCENT_MIN: number;

  constructor(settings: GlobalSettings) {
    this.PHQ_LOW_MIN = settings.phqGroupLowMin;
    this.PHQ_LOW_MAX = settings.phqGroupLowMax;

    this.IPAQ_GROUP_LOW_MAX = settings.ipaqGroupLowMax;
    this.IPAQ_GROUP_MODERATE_MAX = settings.ipaqGroupModerateMax;
    this.IPAQ_GROUP_HIGH_MAX = settings.ipaqGroupHighMax;

    this.MATCHING_PERCENT_MIN = settings.matchingPercentageCap;
  }

  public async findMatches(userId: string, db: Prisma): Promise<Array<BuddyMatch>> {
    // collect this users info for matching
    // const userId = ctx.userId;
    const userInfo = await this.collectInfo(userId, db);

    if (!userInfo) {
      log.info('MATCHING - requesting userinfo ' + JSON.stringify(userInfo, null, ' '));
      log.error('User not Ready for matching!', new Error);
    }

    // collect all possible other users
    const potentialUsers = await db.users({
      where: {
        role: 'PATIENT',
        AND: [
          { patient: { verified: true } },
          { id_not: userId },
          { patient: { NOT: { buddy: {} } } }
        ]
      }
    });
    log.info('MATCHING - users ' + potentialUsers.length + ' User ');

    // collect info needed for matching from db
    const potentialBuddys = await this.collectUsersMatchingInfo(potentialUsers, db);
    log.info('MATCHING - buddy infos ' + potentialBuddys.length + ' User ');

    // calculate matching score (%)
    const buddiesScored = await this.getMatchingScores(userInfo, potentialBuddys);

    // sort by highest match
    const buddiesSorted = buddiesScored.sort(matchesSorter);

    return buddiesSorted;
  }

  public async getOverlapMatch(userId: string, possibleMatches: string[], db: Prisma): Promise<BuddyMatch> {
    // const userId = ctx.userId;
    const userInfo = await this.collectInfo(userId, db);
    const pid = await db.user({ id: userId }).patient().id();

    if (!userInfo) {
      log.info('MATCHING - requesting userinfo ' + JSON.stringify(userInfo, null, ' '));
      log.error('User not Ready for matching!', new Error);
    }

    const patientIds = (await db.patients({ where: { user: { id_in: possibleMatches } } })).map(r => r.id);

    const existingReq = await db.buddyRequests({
      where: {
        to: { id: pid },
        from: { id_in: patientIds },
        state: "SEND"
      }
    });

    if (existingReq.length === 0) {
      // no existing requests -> exit and create some requests
      return undefined;
    }

    let overlapMatchUsers = new Array<User>();
    for (const er of existingReq) {
      overlapMatchUsers.push(await db.buddyRequest({ id: er.id }).from().user());
    }

    const potentialBuddys = await this.collectUsersMatchingInfo(overlapMatchUsers, db);

    const buddiesScored = await this.getMatchingScores(userInfo, potentialBuddys);

    const matchesSorted = buddiesScored.sort(matchesSorter);
    log.info('SORTED MATCHES:');
    for (const s of matchesSorted) {
      log.info(`NAME: ${s.user.username} SCORE ${s.matchingScore}`);
    }

    const match = matchesSorted.length > 0 ? matchesSorted[0] : undefined;

    return match;
  }

  public async instantMatch(userId: string, db: Prisma): Promise<BuddyMatch> {
    const pid = await db.user({ id: userId }).patient().id();

    // check if user has buddy by now
    const existingBuddy = await db.patient({ id: pid }).buddy();
    if (existingBuddy) {
      // abort
      log.info(`ABORT INSTANT MATCH`);
      return undefined;
    }

    const matches = await this.findMatches(userId, db);

    if (matches.length <= 0) {
      return undefined;
    }

    if (matches[0].matchingScore < this.MATCHING_PERCENT_MIN) {
      return undefined;
    }

    const bestMatch = matches[0];
    const buddyPatId = await db.user({ id: bestMatch.user.id }).patient().id();

    // create request - will be instantly set to 'accepted'
    const buddyRequest = await db.createBuddyRequest({
      from: { connect: { id: pid } },
      to: { connect: { id: buddyPatId } },
      state: "SEND",
    });

    await matchUp(true, pid, buddyPatId, db);

    return bestMatch;
  }


  private async collectUsersMatchingInfo(users: Array<User>, db: Prisma): Promise<Array<UserMatchingInfo>> {
    const potentialBuddys = new Array<UserMatchingInfo>();
    for (const bud of await users) {
      const info = await this.collectInfo(bud.id, db)
      if (info) {
        // log.info(`Collected Info: ${JSON.stringify(info, null, ' ')}`);
        potentialBuddys.push(info);
      }
    }
    return potentialBuddys;
  }

  private async getMatchingScores(userInfo: UserMatchingInfo, potentialBuddies: Array<UserMatchingInfo>): Promise<Array<BuddyMatch>> {
    const buddyMatches = new Array<BuddyMatch>();
    for (const buddyInfo of await potentialBuddies) {
      buddyMatches.push(await this.getUserMatchingScore(userInfo, buddyInfo));
    }
    return buddyMatches;
  }

  private async  getUserMatchingScore(userInfo: UserMatchingInfo, buddyInfo: UserMatchingInfo): Promise<BuddyMatch> {
    // const matchingUser = potentialUsers.find(u => u.id === buddyInfo.id);
    log.info('MATCHING - name ' + buddyInfo.user.username);

    const scoreGender = this.genderMatching(userInfo, buddyInfo);
    const scorePhq = this.phqMatching(userInfo.phqScore, buddyInfo.phqScore);
    const scoreIpaq = this.ipaqMatching(userInfo.ipaqScore, buddyInfo.ipaqScore);
    const scoreSports = this.sportsMatching(userInfo.sports, buddyInfo.sports);
    const scoreMeeting = this.meetingMatching(userInfo, buddyInfo);

    const score = scoreGender + scorePhq + scoreIpaq + scoreSports + scoreMeeting;

    const match: BuddyMatch = {
      user: buddyInfo.user,
      matchingScore: Math.round(score),
      genderScore: Math.round(scoreGender),
      ipaqScore: Math.round(scoreIpaq),
      meetingScore: Math.round(scoreMeeting),
      phqScore: Math.round(scorePhq),
      sportsScore: Math.round(scoreSports),
    };

    const {
      user,
      ...matchLog
    } = match;
    log.info('MATCHING SCORE: ' + logFormat(matchLog));

    return match;
  }

  private phqMatching(uScore: number, bScore: number): number {
    // PHQ score groups: 10-18 & 19-27
    // PHQ never match users of same group together!
    // PHQ weight: 50%

    log.info('phqMatching' + uScore + ' - ' + bScore);
    // low phq group
    let matchingScore = 0;
    if (uScore >= this.PHQ_LOW_MIN && uScore <= this.PHQ_LOW_MAX) {
      if (bScore >= this.PHQ_LOW_MIN && bScore <= this.PHQ_LOW_MAX) {
        matchingScore = 0;
      } else {
        matchingScore = 50
      }
    } else if (uScore > this.PHQ_LOW_MAX) { // high phq group
      if (bScore > this.PHQ_LOW_MAX) {
        matchingScore = 0;
      } else {
        matchingScore = 50;
      }
    }
    return matchingScore;
  }

  private ipaqMatching(uScore: number, bScore: number): number {
    const IPAQ_LOW_MIN = 0;

    // IPAQ grouping
    // - low & mid, 
    // - mid & high, 
    // - NOT low & mid
    // IPAQ weight: 20%

    let matchingScore = 0;
    if (uScore >= IPAQ_LOW_MIN && uScore <= this.IPAQ_GROUP_LOW_MAX) {
      // low activity group
      if (bScore >= IPAQ_LOW_MIN && bScore <= this.IPAQ_GROUP_LOW_MAX) {
        matchingScore = 20;
      } else if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
        // match low with mid
        matchingScore = 10
      }
    } else if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
      // mid group
      if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
        // match mid with mid
        matchingScore = 20;
      } else if (bScore >= IPAQ_LOW_MIN && bScore <= this.IPAQ_GROUP_LOW_MAX) {
        // match mid with low
        matchingScore = 10;
      } else if (bScore > this.IPAQ_GROUP_MODERATE_MAX && bScore <= this.IPAQ_GROUP_HIGH_MAX) {
        // match mid with high
        matchingScore = 10;
      }
    } else if (uScore >= this.IPAQ_GROUP_MODERATE_MAX) { // high activity group
      if (bScore >= this.IPAQ_GROUP_MODERATE_MAX) {
        // match high with high
        matchingScore = 20;
      } else if (bScore > this.IPAQ_GROUP_LOW_MAX && bScore <= this.IPAQ_GROUP_MODERATE_MAX) {
        // match high with mid
        matchingScore = 10
      }
    }
    return matchingScore
  }

  private sportsMatching(user: Array<ProfileActivity>, buddy: Array<ProfileActivity>): number {
    // sports Weight: 20%
    const weight = 10;
    let matchingScore = 0;
    for (const a of user) {
      if (buddy.findIndex(e => e.key === a.key) > -1) {
        matchingScore += 1;
      }
    }
    matchingScore = matchingScore / 100 * weight;
    return matchingScore;
  }


  private genderMatching(user: UserMatchingInfo, buddy: UserMatchingInfo): number {
    // same Gender: Weight 10%
    let matchingScore = 0;
    log.info('MATCHING - Gender ' + user.sameGender + '  ');
    if (user.sameGender) {
      if (user.gender === buddy.gender) {
        matchingScore = 10;
      }
    } else {
      matchingScore = 10;
    }
    return matchingScore;
  }

  private meetingMatching(user: UserMatchingInfo, buddy: UserMatchingInfo): number {
    // meeting desired weight: ? - set to 10% for now
    const weight = 10;
    let matchingScore = 0;
    if (user.meetingDesired && buddy.meetingDesired) {
      matchingScore = 5
      if (user.sameGender && user.gender === buddy.gender) {
        matchingScore += 5
      }
    }
    matchingScore = matchingScore / 100 * weight;
    return matchingScore;
  }

  private async collectInfo(userId: string, db: Prisma): Promise<UserMatchingInfo> {
    // const patient = await ctx.db.user({ id: userId }).patient()
    // log.info(`Collecting info on: ${await ctx.db.user({ id: userId }).username()}`);
    const user = await db.user({ id: userId });

    const lastIpaq = await db.user({ id: userId }).patient().quests().ipaqs({
      last: 1,
      // where: { isComplete: true }
    });
    // log.info(`Matching Info Ipaq: ${JSON.stringify(lastIpaq, null, ' ')}`);
    if (!lastIpaq || lastIpaq.length <= 0) return undefined;
    const ipaqScore = lastIpaq && lastIpaq.pop().score
    // log.info(`Matching Info ipaq: ${ipaqScore}`);

    const lastPhq = await db.user({ id: userId }).patient().quests().phq9s({
      last: 1,
      // where: { isComplete: true }
    });
    //log.info(`Matching Info Phq: ${JSON.stringify(lastPhq, null, ' ')}`);
    if (!lastPhq || lastPhq.length <= 0) return undefined;
    const phqScore = lastPhq && lastPhq.pop().score
    // log.info(`Matching Info Phq: ${phqScore}`);


    const userProfile = await db.user({ id: userId }).patient().profile();
    const sports = await db.user({ id: userId }).patient().profile().profileActivities();
    // log.info(`Matching Profile: ${JSON.stringify(userProf, null, ' ')}`);
    // log.info(`Matching Sports: ${JSON.stringify(sports, null, ' ')}`);
    // log.info(`Matching Info Sports: ${sports.map(s => s.titel)}`);
    if (!userProfile || !sports || sports.length <= 0) return undefined;

    const userMatchingInfo: UserMatchingInfo = {
      user,
      gender: userProfile.gender,
      sameGender: userProfile.sameGender,
      meetingDesired: userProfile.meetingDesired,
      ipaqScore,
      phqScore,
      sports
    }
    this.logUserInfo(userMatchingInfo);
    return userMatchingInfo;
  }

  private logUserInfo(usrInfo: UserMatchingInfo) {
    usrInfo.sports[0].key
    let usr = {
      name: usrInfo.user.username,
      sports: [...usrInfo.sports.map(s => s.key)],
      ...usrInfo
    }
    delete usr.user;
    delete usr.sports;
    log.info(`Profile Info: ${JSON.stringify(usr, null, ' ')}`);
  }
}


export async function matchUp(
  accepted: boolean,
  patientId: string,
  newBuddyPatientId: string,
  db: Prisma) {
  const userId = await db.patient({ id: patientId }).user().id();
  // const patientId = await ctx.db.user({ id: ctx.userId }).patient().id();
  // get associated request
  const [req] = (await db.buddyRequests({
    where: {
      from: { id: patientId },
      to: { id: newBuddyPatientId }
    }
  }));

  // only set state if not accepted - keep request for evaluation
  if (!accepted) {
    await db.updateBuddyRequest({
      where: { id: req.id },
      data: { state: 'DENIED' }
    });
    return undefined;
    // set state to accepted
  } else {
    // remove all other open requests
    await removeOpenRequests(req.id, patientId, db);
    await removeOpenRequests(req.id, newBuddyPatientId, db);

    await db.updateBuddyRequest({
      where: { id: req.id },
      data: { state: 'CONFIRMED' }
    });

    // create new chat and bot for the buddies
    const chat = await db.createChat({
      bot: { create: { name: 'roBot' } }
    });

    // create buddy for responding (initiating) user
    const usersBuddy = await db.createBuddy({
      patient: { connect: { id: newBuddyPatientId } },
      chat: { connect: chat }
    })

    // link this users buddy with other users buddy
    await db.updatePatient({
      where: { id: patientId },
      data: { buddy: { connect: usersBuddy } }
    })

    // create buddy for requesting user
    const buddiesBuddy = await db.createBuddy({
      patient: { connect: { id: patientId } },
      chat: { connect: chat }
    })

    // link others users buddy with this users buddy 
    await db.updatePatient({
      where: { id: newBuddyPatientId },
      data: { buddy: { connect: buddiesBuddy } }
    })

    // create tasks
    taskScheduler.setupAfterMatchTasks({
      chatId: chat.id,
      userId: userId,
    }, db)

    return chat;
  }
}

export async function removeOpenRequests(excludeId: string, patientId: string, db: Prisma) {
  const requests = await db.updateManyBuddyRequests({
    where: {
      OR: [
        { from: { id: patientId } },
        { to: { id: patientId } }
      ],
      id_not: excludeId,
    }, data: { state: 'REMOVED' }
  });
}