import * as moment from "moment";
import { TimeSpan } from '../generated/prisma-client';

export const toMomentDuration = (span: Partial<TimeSpan>): moment.Duration => {
  return moment.duration({
    days: span.days,
    hours: span.hours,
    minutes: span.minutes,
    seconds: span.seconds
  });
}