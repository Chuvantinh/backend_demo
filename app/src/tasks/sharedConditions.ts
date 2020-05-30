import { ScheduledTask, Prisma } from '../generated/prisma-client';
import { getUsersActiveMinutesInWeek } from '../services/ActivitiesHelper';
import * as moment from 'moment';
import { logT } from '../logger';

export const plannedActivityToHighCondition = async (
  task: Partial<ScheduledTask>,
  db: Prisma
): Promise<boolean> => {
  const targetMinutes = await db
    .user({ id: task.userId })
    .patient()
    .activeMinutesPerWeek();

  const plannedMinutes = await getUsersActiveMinutesInWeek(
    task.userId,
    moment().toISOString(),
    db
  );
  logT.info(
    `plannedMinutes ${plannedMinutes} - targetMinutes ${targetMinutes}`
  );
  return plannedMinutes > targetMinutes;
}



export const notEnoughActivitiesPlannedCondition = async (
  task: ScheduledTask, db: Prisma
  ): Promise<boolean> => {
  const targetMinutes = await db
    .user({ id: task.userId })
    .patient()
    .activeMinutesPerWeek();

  const plannedMinutes = await getUsersActiveMinutesInWeek(
    task.userId,
    moment()
      .add(1, "weeks")
      .toISOString(),
    db
  );

  return plannedMinutes < targetMinutes;
}