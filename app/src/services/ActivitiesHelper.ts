import * as moment from 'moment';
import { log } from '../logger';
import { Context } from '../types';
import { Prisma } from '../generated/prisma-client';

const getUsersActiveMinutesInWeek = async (userId: string, date: string, db: Prisma): Promise<number> => {
  const mDate = moment(date);
  log.info('gotDate:' + JSON.stringify(mDate, null, ' '));
  const start = mDate.startOf('week').toDate();
  const end = mDate.endOf('week').toDate();

  const ce = await db.user({ id: userId }).patient().calendarEntries({
    where: {
      AND: [
        { startTime_gte: start },
        { endTime_lte: end }
      ]
    }
  })

  const numMinutes = ce.reduce((acc, entry) =>
    acc + moment.duration(moment.utc(entry.endTime).diff(moment.utc(entry.startTime))).asMinutes()
    , 0);

  log.info('Active MINUTES in Week:' + numMinutes);
  return numMinutes;
}


export { getUsersActiveMinutesInWeek };