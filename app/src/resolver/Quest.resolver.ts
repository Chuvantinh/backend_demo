import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context } from '../types';
import { log } from '../logger';
import { User } from '../generated/prisma-client';
import { QuestionnaireHelper } from '../services/questionnaires';
import * as moment from 'moment';
import { taskScheduler } from '../tasks/tasks';
import { ForbiddenError } from 'apollo-server';
;

export const QuestQueryResolver: Pick<
  QueryResolvers.Type
  , 'getUserQuests'
  | 'getUsersLastPhqQuest'
  | 'getUserLastIpaqQuest'
> = {
  ...QueryResolvers.defaultResolvers,

  getUserQuests: async (root, { }, ctx: Context) => {
    const userId = ctx.userId;

    // const ipaq = ctx.db.user({ id: userId }).quests().ipaqs({ first: 1 });
    // const phq = ctx.db.user({ id: userId }).quests().phq9s({ first: 1 });

    return ctx.db.user({ id: userId }).patient().quests();
  },

  getUsersLastPhqQuest: async (root, { userID }, ctx: Context) => {
    if(userID && ctx.role === 'PATIENT') {
      throw new ForbiddenError('Not Authorized');
    }
    let userId = userID ? userID : ctx.userId;
    const phq = await ctx.db.user({ id: userId }).patient().quests().phq9s({ first: 1 });
    return phq.pop();
  },

  getUserLastIpaqQuest: async (root, { userID }, ctx: Context) => {
    if(userID && ctx.role === 'PATIENT') {
      throw new ForbiddenError('Not Authorized');
    }
    let userId = userID ? userID : ctx.userId;
    const ipaq = await ctx.db.user({ id: userId }).patient().quests().ipaqs({ first: 1 });
    return ipaq.pop();
  }
}
export const QuestMutationsResolver: Pick<MutationResolvers.Type
  , 'createPhq9Quest'
  | 'createIpaqQuest'>
  = {
  ...MutationResolvers.defaultResolvers,
  createPhq9Quest: async (root, { phq9Input }, ctx: Context) => {
    const PHQ_LENGTH = 9;
    const userId = ctx.userId;
    const usersQuests = ctx.db.user({ id: userId }).patient().quests();

    const twoWeeks = moment().add(2, 'weeks');

    const score: number = QuestionnaireHelper.calculateScorePhq(phq9Input.answers.set);

    // all 9 answers have to be larger 0 to consider the quest complete
    const isComplete = phq9Input.answers.set.filter(a => a > 0).length === PHQ_LENGTH;

    taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_PHQ_REMINDER',
      userId,
    }, ctx.db);


    return ctx.db.createPhq9({
      answers: phq9Input.answers,
      score,
      expiryDate: twoWeeks.toDate(),
      isComplete,
      quests: { connect: { id: await usersQuests.id() } }
    });

  },
  createIpaqQuest: async (root, { ipaqInput }, ctx: Context) => {
    const IPAQ_LENGTH = 4;
    const userId = ctx.userId;
    const usersQuests = ctx.db.user({ id: userId }).patient().quests();

    // consider the quest complete if all 4 answers have 1 value larger 0
    const isComplete = ipaqInput.answers.create.filter(a =>
      a.numDays > 0 || a.numHours > 0 || a.numMinutes > 0).length
      === IPAQ_LENGTH;

    const twoWeeks = moment().add(2, 'weeks');
    // TODO calculate correct score for IPAQ
    const score: number = QuestionnaireHelper.calculateScoreIpaq(ipaqInput.answers.create);
    log.info('ipaq score: ' + score);

    taskScheduler.scheduleTask({
      taskType: 'PUSH_NOTIFY_IPAQ_REMINDER',
      userId,
    }, ctx.db);

    log.info('ipaq score ' + score);
    return ctx.db.createIpaq({
      answers: { create: ipaqInput.answers.create },
      score,
      isComplete,
      expiryDate: twoWeeks.toDate(),
      quests: { connect: { id: await usersQuests.id() } }
    });

  },
}

export const QuestSubscriptionResolver: Pick<
  SubscriptionResolvers.Type
  , 'watchPhq9s'
  | 'watchIpaqs'
> = {
  ...SubscriptionResolvers.defaultResolvers,

  watchPhq9s: {
    subscribe: (root, args, ctx: Context) => {
      const userId = ctx.userId;
      return ctx.db.$subscribe.phq9({
        mutation_in: ['CREATED', 'UPDATED'],
        node: { quests: { patient: { user: { id: userId } } } }
      }).node().quests().patient().user();
    },
    resolve: (root: User) => root
  },
  watchIpaqs: {
    subscribe: (root, args, ctx: Context) => {
      const userId = ctx.userId;
      return ctx.db.$subscribe.ipaq({
        mutation_in: ['CREATED', 'UPDATED'],
        node: { quests: { patient: { user: { id: userId } } } }
      }).node().quests().patient().user();
    },
    resolve: (root: User) => root
  },
}