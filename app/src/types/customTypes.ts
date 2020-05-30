import { User, Chat } from '../generated/prisma-client';

// non Database Types needed for type generation
export interface AuthPayload {
  token: string;
  user: User;
}

export interface BuddyMatch {
  user: User;
  // matching score gets generated just in time
  matchingScore: number;
  // detailed matching results
  sportsScore: number | null;
  ipaqScore: number | null;
  phqScore: number | null;
  genderScore: number | null;
  meetingScore: number | null;
}

export interface UserActivity {
  id: string
  createdAt: string | null
  updatedAt: string | null
  key: string
  titel: string | null
  description: string | null
  icon: string | null
  tags: string[]
  isFavorite: boolean | null
  isCustom: boolean | null
  color: string | null
}

export interface AdminUserTable {
  user: User;
  lastIpaqScore: number | null;
  ipaqDelta: number | null;
  lastPhqScore: number | null;
  phqDelta: number | null;
  activeMinutesPlanned: number | null;
  activeMinutesGoal: number | null;
  lastSendMessage: string | null;
  eventsCompletedPercent: number | null;
  // canMatch: boolean | null;
}