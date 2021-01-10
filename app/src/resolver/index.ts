// Base Class
import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  SubscriptionResolvers,
  SensorDataResolvers
} from '../generated/graphqlgen';

// Nested resolvers for non-scalar types
import { Ipaq } from './nested/Ipaq';
import { Phq9 } from './nested/Phq9';
import { User } from './nested/User';
import { Patient } from './nested/Patient';
import { Activity } from './nested/Activity';
import { Buddy } from './nested/Buddy';
import { BuddyRequest } from './nested/BuddyRequest';
import { Chat } from './nested/Chat';
import { ChatMessage } from './nested/ChatMessage';
import { ChatMessageAttachment } from './nested/ChatMessageAttachment';
import { CalendarEntry } from './nested/CalendarEntry';
import { Bot } from './nested/Bot';
import { Questionnaires } from './nested/Questionnaires';
import { IpaqAnswers } from './nested/IpaqAnswers';
import { PatientProfileInfo } from './nested/PatientProfileInfo';
import { UserActivity } from './nested/UserActivity';
import { AdminUserTable } from './nested/AdminUserTable';
import { SensorData } from "./nested/SensorData";
// van tinh resolvers
import { GroupColorQueryResolver } from './GroupColor.resolver'
import { GroupQueryResolver } from './Group.resolver'
import { ChallengeQueryResolver, ChallengeMutationResolver} from "./Challenge.resolver";
import { CategoryQueryResolver} from "./Category.resolver";
import { ContributionQueryResolver, ContributionMutationResolver} from "./Contribution";
import { VotingQueryResolver,VotingMutationResolver} from "./Voting";
import { AwardQueryResolver, AwardMutationResolver} from "./Award";
import { QuestionMutationResolver} from "./Question.resolver";
// van tinh nested
import { Challenge} from "./nested/Challenge";
import { GroupColor} from "./nested/GroupColor";
import { Group} from "./nested/Group";
import { Category} from "./nested/Category";
import { Contribution } from "./nested/Contribution";
import { Voting } from "./nested/Voting";
import { Award } from "./nested/Award";
import { Question } from "./nested/Question";


// generated default Resolvers - no need to implement as there are no nested non-scalar fields
import { AuthPayload } from '../generated/tmp-resolvers/AuthPayload';
// import { Reminder } from '../generated/tmp-resolvers/Reminder';
import { BuddyMatch } from '../generated/tmp-resolvers/BuddyMatch';
import { ProfileActivity } from '../generated/tmp-resolvers/ProfileActivity';
import { UserSettings } from '../generated/tmp-resolvers/UserSettings';
import { FavoriteActivity } from '../generated/tmp-resolvers/FavoriteActivity';
import { WebPushNotification } from '../generated/tmp-resolvers/WebPushNotification';

import {
  UserQueryResolver,
  UserMutationResolver,
  UserSubscriptionResolver,
} from './User.resolver';
import {
  AdminQueryResolver,
  /// AdminMutationResolver
} from './Admin.resolver';
import {
  QuestQueryResolver,
  QuestMutationsResolver,
  QuestSubscriptionResolver
} from './Quest.resolver';
import {
  MatchingQueryResolver,
  MatchingMutationResolver,
  MatchingSubscriptionResolver
} from './Matching.resolver';
import {
  ChatQueryResolver,
  ChatMutationResolver,
  ChatSubscriptionResolver
} from './Chat.resolver';
import {
  ActivityQueryResolver,
  ActivityMutationResolver
} from './Activity.resolver';
import {
  CalendarQueryResolver,
  CalendarMutationResolver,
  CalendarSubscriptionResolver,
} from './Calendar.resolver';
import { 
  SensorDataQueryResolver, 
  SensorDataMutationResolver
} from './SensorData.resolver';

const Query: QueryResolvers.Type = {
    ...QueryResolvers.defaultResolvers,
    ...UserQueryResolver,
    ...AdminQueryResolver,
    ...QuestQueryResolver,
    ...MatchingQueryResolver,
    ...ChatQueryResolver,
    ...ActivityQueryResolver,
    ...CalendarQueryResolver,
    ...SensorDataQueryResolver,
    ...GroupColorQueryResolver,
    ...GroupQueryResolver,
    ...ChallengeQueryResolver,
    ...CategoryQueryResolver,
    ...ContributionQueryResolver,
    ...VotingQueryResolver,
    ...AwardQueryResolver,
    //...QuestionQueryResolver
}

const Mutation: MutationResolvers.Type = {
    ...MutationResolvers.defaultResolvers,
    ...UserMutationResolver,
    ...QuestMutationsResolver,
    ...MatchingMutationResolver,
    ...ChatMutationResolver,
    ...ActivityMutationResolver,
    ...CalendarMutationResolver,
    ...SensorDataMutationResolver,
    ...ChallengeMutationResolver,
    ...ContributionMutationResolver,
    ...VotingMutationResolver,
    ...AwardMutationResolver,
    ...QuestionMutationResolver
}

const Subscription: SubscriptionResolvers.Type = {
    ...SubscriptionResolvers.defaultResolvers,
    ...UserSubscriptionResolver,
    ...MatchingSubscriptionResolver,
    ...ChatSubscriptionResolver,
    ...QuestSubscriptionResolver,
    ...CalendarSubscriptionResolver,
}

export const resolvers: Resolvers = {
    Query,
    Mutation,
    Subscription,
    // nested field resolvers
    User,
    AdminUserTable,
    Patient,
    PatientProfileInfo,
    Buddy,
    BuddyRequest,
    Chat,
    ChatMessage,
    ChatMessageAttachment,
    CalendarEntry,
    Activity,
    Bot,
    Questionnaires,
    Phq9,
    Ipaq,
    IpaqAnswers,
    UserActivity,
    // default Resolvers - no need to implement as there are no nested fields
    AuthPayload,
    ProfileActivity,
    BuddyMatch,
    UserSettings,
    FavoriteActivity,
    WebPushNotification,
    // Reminder,
    // CreateCalendarInputArgs,
    SensorData,
    // van tinh
    Challenge,
    Group,
    GroupColor,
    Category,
    Contribution,
    Voting,
    Award,
    Question
}