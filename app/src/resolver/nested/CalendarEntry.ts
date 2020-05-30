
import { CalendarEntryResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const CalendarEntry: CalendarEntryResolvers.Type = {
  ...CalendarEntryResolvers.defaultResolvers,

  activity: async (parent, _args, ctx: Context) => {
    return ctx.db.calendarEntry({ id: parent.id }).activity();
  },
  patient: async (parent, _args, ctx: Context) => {
    return ctx.db.calendarEntry({ id: parent.id }).patient();
  },
  sensorData: async (parent, _args, ctx: Context) => {
    return ctx.db.calendarEntry({ id: parent.id }).sensorData();
  },
};
