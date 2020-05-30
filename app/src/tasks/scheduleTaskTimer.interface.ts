
import { TaskTimer, ITaskOptions } from 'tasktimer';
import { Prisma, ScheduledTask, ScheduledTaskCreateInput } from '../generated/prisma-client';

export interface IScheduleTaskTimer {
  setup(args: ScheduledTaskCreateInput, db: Prisma, timer?: TaskTimer, ): Promise<ITaskOptions>,
  schedule(dbTask: ScheduledTask, db: Prisma): Promise<ITaskOptions>,
  execute(task: ScheduledTask, db: Prisma),
  condition(task: ScheduledTask, db: Prisma): Promise<boolean>,
}
