import { Prisma, GlobalSettings, GlobalSettingsPromise, UserRole } from '../generated/prisma-client';
// import { Tasks } from '../tasks/tasks';

export interface Context {
  db: Prisma;
  // key: string;
  userId: string;
  role: UserRole,
  // req: any; //for Apollo use this
  settingsId: string;
  // settings: GlobalSettings;

  // tasks: Tasks;
}

// export interface TimerContext extends Partial<Context> {
//   db: Prisma,
//   settingsId: getGlobalSettings(db);
// }