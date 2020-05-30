import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context } from '../types';
import { log } from '../logger';
import { MatchingHelper, matchUp } from '../services/MatchingHelper';
import { notification } from '../services/notification/NotificationService';
import { UserInputError, ForbiddenError, ValidationError } from 'apollo-server';
import { BuddyRequest } from '../generated/prisma-client';
import { taskScheduler } from '../tasks/tasks';

export const MatchingQueryResolver: Pick<
  QueryResolvers.Type
  , 'getMatchingBuddies'
  | 'getAllBuddyRequests'
  | 'getBuddyRequestsCount'
> = {
  ...QueryResolvers.defaultResolvers,
  getMatchingBuddies: async (root, { userId, percentageCap, limit }, ctx: Context) => {
    if (ctx.role !== 'ADMIN' && userId) {
      throw new ForbiddenError('Not Authorized');
    }
    if (!userId) {
      userId = ctx.userId;
    }

    const settings = await ctx.db.globalSettings({ id: ctx.settingsId });
    const matcher = new MatchingHelper(settings);
    const matchingResults = await matcher.findMatches(userId, ctx.db);
    log.info('MATCHING - matchingResults ' + matchingResults.length);
    // limit to 9 results
    const matchingResultLimited = matchingResults.slice(0, matchingResults.length < 9 ? matchingResults.length : 9);
    return matchingResultLimited;
  },

  getAllBuddyRequests: async (root, args, ctx: Context) => {
    const userId = ctx.userId;
    const pId = await ctx.db.user({ id: userId }).patient().id();
    // return await ctx.db.user({ id: userId }).patient().buddyRequests();
    log.info('getAllBuddyRequests ' + pId);
    return await ctx.db.buddyRequests({
      where: {
        OR: [
          { from: { id: pId } },
          { to: { id: pId } }
        ]
      }
    });
  },

  getBuddyRequestsCount: async (root, args, ctx: Context) => {
    const userId = ctx.userId;
    const pId = await ctx.db.user({ id: userId }).patient().id();
    const requests = await ctx.db.buddyRequests({
      where: {
        OR: [
          { from: { id: pId } },
          { to: { id: pId } }
        ],
        state_not: "REMOVED",
      }
    });
    return requests.length;
  },

  // getIncomingBuddyRequests: async (root, args, ctx: Context) => {
  //   const userId = ctx.userId;
  //   const pId = await ctx.db.user({ id: userId }).patient().id();
  //   return await ctx.db.buddyRequests({ where: { to: { id: pId } } });
  // },

  // getSentBuddyRequests: async (root, args, ctx: Context) => {
  //   const userId = ctx.userId;
  //   // const user = await ctx.db.user({ id: userId });
  //   const pId = await ctx.db.user({ id: userId }).patient().id();
  //   return await ctx.db.buddyRequests({ where: { from: { id: pId } } });
  // },
}

export const MatchingMutationResolver: Pick<
  MutationResolvers.Type
  , 'sendBuddyRequest'
  | 'sendBuddyRequests'
  | 'sendBuddyResponse'
  | 'removeBuddyRequest'
  | 'adminLinkBuddies'
> = {
  // old matching system - buddy has to actively confirm request
  sendBuddyRequest: async (root, { requestToUserId }, ctx: Context) => {
    const userId = ctx.userId;
    const user = await ctx.db.user({ id: userId });
    const pid = await ctx.db.user({ id: userId }).patient().id();
    const existingReq = await ctx.db.buddyRequests({ where: { from: { id: pid } } });

    // // Abort if user has is existing request
    if (existingReq.some(e => e.state === 'SEND')) {
      throw new UserInputError('Existing Open Buddy Request found');
    }

    const buddy = ctx.db.user({ id: requestToUserId });
    const buddyPatId = await ctx.db.user({ id: requestToUserId }).patient().id();

    // request now occur between patients - NOT users
    log.info('Buddy Request from ' + pid + ' to ' + buddyPatId);
    const buddyRequest = await ctx.db.createBuddyRequest({
      from: { connect: { id: pid } },
      to: { connect: { id: buddyPatId } },
      state: 'SEND',
    });

    notification.sendPushNotification({
      type: 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST',
      receiver: buddy,
      sender: user,
    });
    // destroy request after 48h
    taskScheduler.scheduleTask({
      taskType: 'SYSTEM_SCHEDULE_REQUEST_DESTRUCTION',
      buddyRequestId: buddyRequest.id,
      userId
    }, ctx.db);

    // send to notification to Potential Buddy
    // NOT Implemented because of upcoming changes in Buddy Matching
    // taskScheduler.scheduleTask({
    //   taskType: 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST',
    //   buddyRequestId: buddyRequest.id,
    //   userId
    // }, ctx.db);


    return buddyRequest.id;
  },

  // new matching system - buddy auto confirms request if there is an existing request
  sendBuddyRequests: async (root, { requestToUserIds }, ctx: Context) => {
    const userId = ctx.userId;
    const user = await ctx.db.user({ id: userId });
    const pid = await ctx.db.user({ id: userId }).patient().id();


    // if there is an existing request from another user -> match immediately
    const settings = await ctx.db.globalSettings({ id: ctx.settingsId });
    const matcher = new MatchingHelper(settings);
    const match = await matcher.getOverlapMatch(userId, requestToUserIds, ctx.db);
    if (match) {
      const patientBuddy = await ctx.db.user({ id: match.user.id }).patient();
      const chat = await matchUp(true, pid, patientBuddy.id, ctx.db);
      return true;
    }

    // no existing requests found -> create new requests
    let requestedBuddys = new Array<BuddyRequest>();
    for (const id of requestToUserIds) {

      const buddy = await ctx.db.user({ id });
      const buddyPatId = await ctx.db.user({ id }).patient().id();

      // request now occur between patients - NOT users
      log.info('Buddy Request from ' + pid + ' to ' + buddyPatId);
      const buddyRequest = await ctx.db.createBuddyRequest({
        from: { connect: { id: pid } },
        to: { connect: { id: buddyPatId } },
        state: 'SEND',
      });
      requestedBuddys.push(buddyRequest);

      // notification.sendPushNotification({
      //   type: 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST',
      //   receiver: buddy,
      //   sender: user,
      // });

      // destroy request after 48h
      taskScheduler.scheduleTask({
        taskType: 'SYSTEM_SCHEDULE_REQUEST_DESTRUCTION',
        buddyRequestId: buddyRequest.id,
        userId
      }, ctx.db);

    }

    // auto match if no user generated match is possible
    taskScheduler.scheduleTask({
      taskType: 'SYSTEM_AUTO_MATCH',
      userId
    }, ctx.db);

    return false;
  },

  // old request system - no response needed in new system
  sendBuddyResponse: async (root, { accepted, newBuddyPatientId }, ctx: Context) => {
    // const userId = ctx.userId;
    const patientId = await ctx.db.user({ id: ctx.userId }).patient().id();
    // get associated request
    const req = (await ctx.db.buddyRequests({
      where: {
        from: { id: newBuddyPatientId },
        to: { id: patientId }
      }
    })).pop()

    // only set state if not accepted - keep request for evaluation
    if (!accepted) {
      await ctx.db.updateBuddyRequest({
        where: { id: req.id },
        data: { state: 'DENIED' }
      });
      return;
      // set state to accepted
    } else {
      await ctx.db.updateBuddyRequest({
        where: { id: req.id },
        data: { state: 'CONFIRMED' }
      });

      // create new chat and bot for the buddies
      const chat = await ctx.db.createChat({
        bot: { create: { name: 'roBot' } }
      });

      // create buddy for responding (initiating) user
      const usersBuddy = await ctx.db.createBuddy({
        patient: { connect: { id: newBuddyPatientId } },
        chat: { connect: chat }
      })

      // link this users buddy with other users buddy
      await ctx.db.updatePatient({
        where: { id: patientId },
        data: { buddy: { connect: usersBuddy } }
      })

      // create buddy for requesting user
      const buddiesBuddy = await ctx.db.createBuddy({
        patient: { connect: { id: patientId } },
        chat: { connect: chat }
      })

      // link others users buddy with this users buddy 
      await ctx.db.updatePatient({
        where: { id: newBuddyPatientId },
        data: { buddy: { connect: buddiesBuddy } }
      })

      // create tasks
      taskScheduler.setupAfterMatchTasks({
        chatId: chat.id,
        userId: ctx.userId,
      }, ctx.db)

      return chat;
    }
  },

  removeBuddyRequest: async (root, { reqId }, ctx: Context) => {
    const id = await ctx.db.updateBuddyRequest({
      where: { id: reqId },
      data: { state: 'REMOVED' }
    }).id();
    return id;
  },

  adminLinkBuddies: async (root, { userId, buddyId }, ctx: Context) => {
    if (ctx.role !== 'ADMIN') {
      throw new ForbiddenError('Not Authorized');
    }

    // check if one of the users has a buddy now
    const patientHasBuddy = await ctx.db.user({ id: userId }).patient().buddy();
    const buddyHasBuddy = await ctx.db.user({ id: buddyId }).patient().buddy();

    if (patientHasBuddy || buddyHasBuddy) {
      throw new ValidationError('Unable to Link users - one already has buddy');
    }

    const patientId = await ctx.db.user({ id: buddyId }).patient().id();
    const buddyPatientId = await ctx.db.user({ id: userId }).patient().id();

    // create request - will instantly be set to accepted
    const buddyRequest = await ctx.db.createBuddyRequest({
      from: { connect: { id: patientId } },
      to: { connect: { id: buddyPatientId } },
      state: 'SEND',
    });

    await matchUp(true, patientId, buddyPatientId, ctx.db);

    return true;
  },
}


export const MatchingSubscriptionResolver: Pick<
  SubscriptionResolvers.Type
  , 'watchBuddyRequests'
> = {
  ...SubscriptionResolvers.defaultResolvers,

  watchBuddyRequests: {
    subscribe: async (root, args, ctx: Context) => {
      // const userId = ctx.userId;
      const pId = await ctx.db.user({ id: ctx.userId }).patient().id();
      return ctx.db.$subscribe.buddyRequest({
        mutation_in: ['CREATED', 'UPDATED'],
        node: {
          OR: [
            { from: { id: pId } },
            { to: { id: pId } }
          ],
          // state_not: "REMOVED",
        }
      }).node();
    },
    resolve: (root: BuddyRequest) => root
  },
}

