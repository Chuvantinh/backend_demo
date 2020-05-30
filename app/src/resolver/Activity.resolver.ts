import { QueryResolvers, MutationResolvers } from '../generated/graphqlgen';
import { Context, UserActivity } from '../types';
import { ID_Input, CalendarEntryCreateInput, ActivityCreateInput } from '../generated/prisma-client';

import * as moment from 'moment';
import { log } from '../logger';
import { getUsersActiveMinutesInWeek } from '../services/ActivitiesHelper';
import { taskScheduler } from '../tasks/tasks';

export const ActivityQueryResolver: Pick<
  QueryResolvers.Type
  , 'getAllActivities'
  | 'getActivity'
  | 'getActiveMinutesPerWeekGoal'
  | 'getActiveMinutesInWeek'
  | 'isUserActivity'
  | 'getUserActivities'
  | 'getUserActivity'
  | 'getUserActivityByID'
  | 'getManyActivities'
  | 'getAllDefaultActivities'
> = {
  ...QueryResolvers.defaultResolvers,

  getAllActivities: async (root, { last }, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.user({ id: userId }).patient().activities();
  },

  getActivity: async (root, { activityId }, ctx: Context) => {
    return ctx.db.activity({ id: activityId });
  },

  getActiveMinutesPerWeekGoal: async (root, { userId }, ctx: Context) => {
    let id = userId;
    if (!id) {
      id = ctx.userId;
    }
    return ctx.db.user({ id }).patient().activeMinutesPerWeek();
  },

  getActiveMinutesInWeek: async (root, { date, userId }, ctx: Context) => {
    let id = userId;
    if (!id) {
      id = ctx.userId;
    }
    return await getUsersActiveMinutesInWeek(id, date, ctx.db);
  },

  isUserActivity: async (root, { key }, ctx: Context) => {
    const userId = ctx.userId;
    return (await ctx.db.user({
      id: userId
    }).patient().activities({
      where: { key }, first: 1
    })).pop();
  },

  getUserActivities: async (root, args, ctx: Context) => {
    const userId = ctx.userId;
    const favs = await ctx.db.user({ id: userId }).patient().favoriteActivities();
    //const defAct = await ctx.db.user({ id: userId }).patient().activities();
    const defAct = await ctx.db.activities();

    let userAct = defAct as Array<UserActivity>;
    // log.info('getUserActivities:' + JSON.stringify(userAct));

    for (const a of userAct) {
      const lookup = favs.find(f => f.activityKey === a.key);
      if (lookup) {
        a.isFavorite = true;
      } else {
        a.isFavorite = false;
      }
    }

    return userAct;
  },

  getUserActivity: async (root, { key }, ctx: Context) => {
    const userId = ctx.userId;
    const favs = await ctx.db.user({ id: userId }).patient().favoriteActivities({ where: { activityKey: key } });
    //const defAct = await ctx.db.user({ id: userId }).patient().activities();
    const [defAct] = await ctx.db.activities({ where: { key } });

    let userAct = defAct as UserActivity;
    // log.info('getUserActivities:' + JSON.stringify(userAct));

    userAct.isFavorite = false;
    for (const f of favs) {
      let isFav = favs.find(f => f.activityKey === userAct.key)
      if (isFav) {
        userAct.isFavorite = true;
      }
    }
    return userAct;
  },

  getUserActivityByID: async (root, { id }, ctx: Context) => {
    const userId = ctx.userId;
    const favs = await ctx.db.user({ id: userId }).patient().favoriteActivities({ where: { id } });
    //const defAct = await ctx.db.user({ id: userId }).patient().activities();
    const [defAct] = await ctx.db.activities({ where: { id } });

    let userAct = defAct as UserActivity;
    // log.info('getUserActivities:' + JSON.stringify(userAct));

    userAct.isFavorite = false;
    for (const f of favs) {
      let isFav = favs.find(f => f.activityKey === userAct.key)
      if (isFav) {
        userAct.isFavorite = true;
      }
    }
    return userAct;
  },

  getManyActivities: async (root, { ids }, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.activities({ where: { id_in: ids } });
  },

  getAllDefaultActivities: async (root, args, ctx: Context) => {
    return ctx.db.activities();
  },
}

export const ActivityMutationResolver: Pick<
  MutationResolvers.Type
  , 'createDefaultActivities'
  | 'createUserActivity'
  | 'createUserActivities'
  | 'favoriteUserActivity'
  | 'createCustomActivity'
  // | 'updateUserActivities'
  | 'deleteUserActivity'
  | 'deleteUserActivities'
  | 'setActiveMinutesInWeek'
> = {

  createDefaultActivities: async (root, { activities }, ctx: Context) => {
    // TODO: Needs Admin authorization

    // const numBefore = await ctx.db.deleteManyActivities().count;
    // log.info('Deleted Activities' + numBefore);

    for (const a of activities) {
      const hasActivity = await ctx.db.$exists.activity({ key: a.key });
      if (!hasActivity) {
        await ctx.db.createActivity(a);
      } else {
        await ctx.db.updateActivity({ where: { key: a.key }, data: a });
      }

    }
    return await ctx.db.activities();
  },

  /// TODO: Check usage -> Deprecated? Refactor name -> add Activity
  createUserActivity: async (root, { input }, ctx: Context) => {
    const userId = ctx.userId;

    // return ctx.db.createActivity({
    //   ...input,
    //   user: { connect: { id: userId } }
    // });

    const newActId = await ctx.db.updateUser({
      where: { id: userId },
      data: {
        patient: { update: { activities: { connect: input } } }
      }
    }).patient().activities()

    taskScheduler.scheduleTask({
      taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
      userId,
    }, ctx.db);

    return newActId.pop();
  },
  
  /// TODO: Check usage -> Deprecated? -> rename?
  createUserActivities: async (root, { input }, ctx: Context) => {
    const userId = ctx.userId;
    const act = ctx.db.updateUser({
      where: { id: userId },
      data: {
        patient: {
          update: {
            activities: {
              create: input.create
            }
          }
        }
      }
    }).patient().activities();

    taskScheduler.scheduleTask({
      taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
      userId,
    }, ctx.db);

    return act;
  },

  favoriteUserActivity: async (root, { key, fav }, ctx: Context) => {
    const userId = ctx.userId;
    const favs = await ctx.db.user({ id: userId }).patient().favoriteActivities();
    const hasFav = favs.find(f => f.activityKey === key);
    log.info('favoriteUserActivity' + key + ' ' + fav);
    if (!fav) {
      if (hasFav) {
        await ctx.db.updateUser({
          where: { id: userId },
          data: {
            patient: {
              update: {
                favoriteActivities: { delete: { activityKey: key } }
              }
            }
          }
        });
      }
    } else {
      if (!hasFav) {
        await ctx.db.updateUser({
          where: { id: userId },
          data: {
            patient: {
              update: {
                favoriteActivities: { create: { activityKey: key } }
              }
            }
          }
        });
      }
    }
    let act = await ctx.db.activity({ key }) as UserActivity;
    act = { ...act, isFavorite: fav }
    return act;
  },

  createCustomActivity: async (root, { activity }, ctx: Context) => {
    const userId = ctx.userId;

    let customActIdx = (await ctx.db.user({
      id: userId
    }).patient().activities({
      where: { key_contains: userId }
    })).length;

    customActIdx = !customActIdx ? 0 : customActIdx;

    const actInput: ActivityCreateInput = {
      key: 'CUSTOM_' + userId + '_' + customActIdx,
      color: activity.color,
      description: activity.description,
      tags: activity.tags,
      icon: activity.icon,
      isCustom: true,
      titel: activity.titel,
    };

    const createdAct = await ctx.db.updateUser({
      where: { id: userId },
      data: {
        patient: {
          update: {
            activities: {
              create: actInput,
            },
            favoriteActivities: { 
              create: { activityKey: actInput.key } }
          }
        }
      }
    });

    // await ctx.db.updateUser({
    //   where: { id: userId },
    //   data: {
    //     patient: {
    //       update: {
    //         favoriteActivities: { create: { activityKey: actInput.key } }
    //       }
    //     }
    //   }
    // });

    let act = await ctx.db.activity({ key: actInput.key }) as UserActivity;
    act = { ...act, isFavorite: true }
    return act;
  },

  deleteUserActivity: async (root, { activityId }, ctx: Context) => {
    const userId = ctx.userId;

    const act = ctx.db.deleteActivity({ id: activityId });
    taskScheduler.scheduleTask({
      taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
      userId,
    }, ctx.db);

    return act;
  },

  deleteUserActivities: async (root, { activityIds }, ctx: Context) => {
    const userId = ctx.userId;
    // const myId: string = await ctx.db.activity({ id: activityId })..user().id();
    // if (userId !== myId) { throw new Error('You have no permission to delete'); }
    const ids: ID_Input[] = [...activityIds];
    const act = ctx.db.deleteManyActivities({ id_in: ids }).count();
    taskScheduler.scheduleTask({
      taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
      userId,
    }, ctx.db);
    return act;
  },

  setActiveMinutesInWeek: async (root, { minutes }, ctx: Context) => {
    const userId = ctx.userId;

    const act = ctx.db.updateUser({
      where: { id: userId },
      data: { patient: { update: { activeMinutesPerWeek: minutes } } }
    }).patient().activeMinutesPerWeek();

    taskScheduler.scheduleTask({
      taskType: "PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY",
      userId,
    }, ctx.db);
    return act;
  },
}