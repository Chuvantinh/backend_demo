import { QueryResolvers } from '../generated/graphqlgen';
import { Context, AdminUserTable } from '../types';
import { getUsersActiveMinutesInWeek } from '../services/ActivitiesHelper';
import moment = require('moment');

export const AdminQueryResolver: Pick<
  QueryResolvers.Type
  , 'getUserTable'
// | ''
> = {
  ...QueryResolvers.defaultResolvers,

  getUserTable: async (root, args, ctx: Context) => {
    const users = await ctx.db.users({where: {role: 'PATIENT'}});

    let tableData: AdminUserTable[] = [];
    for (const u of users) {
      const lastIpaq = await ctx.db.user({ id: u.id, }).patient().quests().ipaqs({ last: 2 });

      let lastIpaqScore: number = undefined;
      let ipaqDelta: number = undefined;
      if (lastIpaq && lastIpaq.length >= 1) {
        lastIpaqScore = lastIpaq[0].score;
        if (lastIpaq.length >= 2) {
          ipaqDelta = lastIpaq[0].score - lastIpaq[1].score
        }
      }

      const lastPhq = await ctx.db.user({ id: u.id }).patient().quests().phq9s({ last: 2 });
      let lastPhqScore: number = undefined;
      let phqDelta = undefined;
      if (lastPhq && lastPhq.length >= 1) {
        lastPhqScore = lastPhq[0].score;
        if (lastPhq.length >= 2) {
          phqDelta = lastPhq[0].score - lastPhq[1].score
        }
      }

      const activeMinutesPlanned = await getUsersActiveMinutesInWeek(
        u.id,
        moment().toISOString(),
        ctx.db
      );

      const activeMinutesGoal = await ctx.db.user({ id: u.id }).patient().activeMinutesPerWeek();

      const lastChatMsg = await ctx.db.user({ id: u.id }).patient().buddy().chat().messages({
        where: { author: { id: u.id } },
        last: 1
      });

      let lastSendMessage: string = undefined;
      if (lastChatMsg && lastChatMsg.length > 0) {
        lastSendMessage = lastChatMsg[0].createdAt;
      }

      const numActivities = (await ctx.db.user({ id: u.id }).patient().calendarEntries()).length;
      const numActivitiesDone = (await ctx.db.user({ id: u.id }).patient().calendarEntries({ where: { isDone: true } })).length;
      const eventsCompletedPercent = (numActivitiesDone / numActivities ) * 100;

      tableData.push(
        {
          user: u,
          lastIpaqScore,
          ipaqDelta,
          lastPhqScore,
          phqDelta,
          lastSendMessage,
          activeMinutesPlanned,
          activeMinutesGoal,
          eventsCompletedPercent,
        }
      );

    }
    return tableData;
  },
}