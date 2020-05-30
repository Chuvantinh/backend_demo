import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context } from '../types';
import { ID_Input, CalendarEntryCreateInput, CalendarEntryUpdateDataInput, CalendarEntryUpdateInput, CalendarEntryOrderByInput, DateTimeInput, CalendarEntry } from '../generated/prisma-client';

import * as moment from 'moment';

export const CalendarQueryResolver: Pick<
  QueryResolvers.Type
  , 'getUsersCalendarEntry'
  | 'getUsersCalendarEntries'
  | 'getUsersCalendarEntriesForDate'
  | 'getBuddyCalendarEntries'
> = {
  ...QueryResolvers.defaultResolvers,


  getUsersCalendarEntry: async (root, { id }, ctx: Context) => {
    return ctx.db.calendarEntry({ id });
  },

  getUsersCalendarEntriesForDate: async (root, { date }, ctx: Context) => {
    const userId = ctx.userId;
    let dateLower: DateTimeInput = moment(date).toDate();
    let dateUpper: DateTimeInput = moment(date).add({ day: 1 }).toDate();
    const calEvents = await ctx.db.calendarEntries({
      where: { startTime_gte: dateLower, patient: { user: { id: userId } } },
      orderBy: "startTime_ASC",
    });
    const calToday = calEvents.filter(e => moment(e.startTime).isSame(dateLower, 'day'))
    return calToday;
  },

  getUsersCalendarEntries: async (root, { last }, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.calendarEntries({
      where: { patient: { user: { id: userId } } },
      orderBy: "startTime_ASC"
    });
  },

  getBuddyCalendarEntries: async (root, { last }, ctx: Context) => {
    const userId = ctx.userId;
    // const order: CalendarEntryOrderByInput = 'startTime_DESC';

    const buddyId = await ctx.db.user({
      id: userId
    }).patient().buddy().patient().user().id();
    return ctx.db.calendarEntries({
      where: { patient: { user: { id: buddyId } } },
      orderBy: "startTime_ASC"
    });
  },
}

export const CalendarMutationResolver: Pick<
  MutationResolvers.Type
  , 'createUserCalendarEntry'
  | 'updateUserCalendarEntry'
  | 'deleteUserCalendarEntry'
> = {

  createUserCalendarEntry: async (root, { input }, ctx: Context) => {
    const pId = await ctx.db.user({ id: ctx.userId }).patient().id()
    const ip: CalendarEntryCreateInput = {
      ...input,
      activity: { connect: { id: input.activity.connect.id } },
      patient: { connect: { id: pId } },
      sensorData: null, // TODO - create empty sensor data?
    }
    return ctx.db.createCalendarEntry(ip);
  },

  updateUserCalendarEntry: async (root, { id, update }, ctx: Context) => {
    const userId = ctx.userId;

    // keep Scalars - remove nested property 'activity' & 'user'
    const data: Pick<CalendarEntryUpdateInput, 'endTime' | 'startTime' | 'isDone'> = {
      ...update
    }

    return ctx.db.updateCalendarEntry({
      where: { id },
      data
    });
  },

  deleteUserCalendarEntry: async (root, { id }, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.deleteCalendarEntry({ id }).id();
  },
}

// TODO: Test this subscription - not used yet
export const CalendarSubscriptionResolver: Pick<
  SubscriptionResolvers.Type
  , 'watchActiveCalendarEntry'
> = {
  ...SubscriptionResolvers.defaultResolvers,

  watchActiveCalendarEntry: {
    subscribe: async (root, args, ctx: Context) => {
      // const userId = ctx.userId;
      const pId = await ctx.db.user({ id: ctx.userId }).patient().id();
      return ctx.db.$subscribe.calendarEntry({
        mutation_in: ['UPDATED'],
        node: {
          isRunning: true,
          patient: { id: pId },
        }
      }).node();
    },
    resolve: (root: CalendarEntry) => root
  },
}
