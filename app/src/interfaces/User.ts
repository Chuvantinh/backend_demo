import { IAvatar } from './Avatar';
import { IChat } from './Chat';
import { IIpaq } from './Ipaq';
import { IMessage } from './Message';
import { IPhq9 } from './Phq9';
import { ISport } from './Sport';
import { IPotentialBuddy } from './PotentialBuddy';
import {
  UserRole, 
  Activity,
  Questionnaires,
  PatientProfileInfo,
  CalendarEntry,
  Buddy,
  BuddyRequest,
  WebPushNotification,
} from '../generated/prisma-client';

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  role: UserRole;
  verificationCode: string;
  verified: boolean;
  profile: PatientProfileInfo;
  buddy: Buddy;
  buddyRequests: BuddyRequest[];
  quests: Questionnaires[];
  notification: string;
  online: boolean;
  activities: Activity[];
  calendarEntries: CalendarEntry[];
  notifications: WebPushNotification[];
}

// enum UserRole {
//     ADMIN,
//     DOCTOR,
//     USER,
//     BOT
// }

// enum Gender {
//     MALE,
//     FEMALE,
//     DIVERSE
// }
