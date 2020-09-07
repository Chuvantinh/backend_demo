import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { QueryResolvers, MutationResolvers, SubscriptionResolvers } from '../generated/graphqlgen';
import { Context, AuthPayload } from '../types';
import { log, logA, logFormat } from '../logger';
import { APP_PRIVATE_KEY, TOKEN_EXPIRY_TIME, VAPID_PUBLIC_KEY } from '../config/env.config';
import { UserUpdateInput, UserCreateInput, UserRole, TaskTypes, Buddy, User, WebPushNotification } from '../generated/prisma-client';
// import { RegistrationError, LoginError } from '../errors/errors';
import { UserInputError } from 'apollo-server';
import { taskScheduler } from '../tasks/tasks';
import { notification } from '../services/notification/NotificationService';


export const UserQueryResolver: Pick<
  QueryResolvers.Type
  ,'getUser'
  | 'getUserById'
  | 'getUserByName'
  | 'getUserRole'
  | 'getPatientProfile'
  | 'getPatientProfileActivities'
  | 'getAllProfileActivities'
  | 'getBuddyId'
  | 'users'
  | 'chats'
  | 'getVapidPublicKey'
  | 'getUserSettings'
  | 'getUserNotificationInfos'
> = {
  ...QueryResolvers.defaultResolvers,

  getUser: async (root, args, ctx: Context) => {
    log.info(`getUser ctx.userId ' ${(ctx.userId)}`);
    const userId = ctx.userId;
    return ctx.db.user({ id: userId });
  },

  getUserById: async (root, { userId }, ctx: Context) => {
    return ctx.db.user({ id: userId });
  },

  getUserByName: async (root, { name }, ctx: Context) => {
    return await ctx.db.user({ username: name });
  },

  getUserRole: async (root, args, ctx: Context) => {
    const userId = ctx.userId;
    return await ctx.db.user({ id: userId }).role();
  },

  getPatientProfile: async (root, args, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.user({ id: userId }).patient().profile();
  },

  getVapidPublicKey: async () => {
    return VAPID_PUBLIC_KEY;
  },

  getBuddyId: async (root, args, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.user({ id: userId }).patient().buddy().patient().user().id();
  },

  getPatientProfileActivities: async (root, args, ctx: Context) => {
    const userId = ctx.userId;

    const pa = await ctx.db.user({ id: userId }).patient().profile().profileActivities();
    // log.info(`getPatientProfileActivities ' ${(logFormat(pa))}`);
    return pa;
  },

  getAllProfileActivities: async (root, args, ctx: Context) => {
      return ctx.db.profileActivities({ where: {} });
  },

  users: async (root, args, ctx: Context) => {
    return ctx.db.users();
  },

  chats: async (root, args, ctx: Context) => {
    return ctx.db.chats()
  },

  getUserSettings: async (root, args, ctx: Context) => {
    return ctx.db.user({ id: ctx.userId }).settings();
  },

  getUserNotificationInfos: async (root, args, ctx: Context) => {
    return ctx.db.user({ id: ctx.userId }).notifications();
  },
}

export const UserMutationResolver: Pick<
  MutationResolvers.Type
  , 'createAppUser'
  | 'deleteAppUser'
  // | 'updateAppUser'
  | 'registerUser'
  | 'login'
  | 'verifyPatient'
  | 'updatePatientProfile'
  | 'updatePatientProfileActivities'
  | 'createProfileActivities'
  | 'updateUserVerificationCode'
  | 'saveNotificationInformation'
  | 'disengageBuddy'
  | 'updateUsersSettings'
  | 'sendTestNotification'
  | 'deleteNotificationInformation'
> = {
  createAppUser: async (root, { username, verificationCode, role }, ctx: Context) => {
    const userExists = await ctx.db.$exists.user({ username });
    if (userExists) {
      //const e = new RegistrationError('User already Exists');
      const  e = undefined;
        log.error(`User with Name  ${username} already Exists`, e);
      return undefined;
    }

    log.info(`Creating User -  ${username} - ${role} - ${verificationCode}`);

    let newUser: UserCreateInput = {
      username,
      role,
      notifications: {},
      settings: {
        create: { themeName: 'theme-06-teal-amber' }
      }
    }
    if (role === "PATIENT") {
      newUser = {
        username,
        role,
        notifications: {},
        settings: {
          create: { themeName: 'theme-06-teal-amber' }
        },
        patient: {
          create: {
            verificationCode: verificationCode,
            verified: false,
            profile: {
              create: {}
            },
            activities: {},
            quests: {
              create: {}
            },
          }
        }
      }
    }
    const user = await ctx.db.createUser(newUser);
    log.info(`User Created ${logFormat(newUser)} `);
    return user;
  },


  registerUser: async (root, { username, password, verificationCode }, ctx: Context) => {
    const SALT_ROUNDS = 10;
    const user = await ctx.db.user({ username });

    if (!user) {
      // const e = new RegistrationError('REGISTER_USER_NOT_FOUND');
      logA.warn(`Failed to register unknown user ${username}`);
      return false;
    }

    log.info(`Register User ${JSON.stringify((await user.role), null, ' ')}`);
    const role = user.role;

    // if patient check verification code
    if (role === "PATIENT") {
      const [patient] = await ctx.db.patients({ where: { user: { id: user.id } } });
      log.info(`Register ${JSON.stringify(patient.verificationCode, null, ' ')}`);
      if (patient.verificationCode !== verificationCode) {
        // const e = new RegistrationError('REGISTER_VERBIFY_FAILED');
        logA.warn('Wrong verification code');
        // registration rejected
        return false;
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const updatedUser = await ctx.db.updateUser({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        patient: { update: { verified: true } }
      }
    });
    // registration successful
    return updatedUser ? true : false;
  },

  login: async (root, { username, password }, ctx: Context) => {
    // log.info('Login username is :  ' + JSON.stringify(username));
      // log.info(`login resolver vao day lan 2`);
     const user = await ctx.db.user({ username });
     
    if (!user) {
      console.log("no user found");
      //log.info(`login loi`);
      // throw new LoginError(`Login Failed`);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      console.log("invalid the password in login  mutation");
      //throw new LoginError(`Login Failed`);
    }

    const authPayload: AuthPayload = {
      user,
      token: jwt.sign(
          { userId: user.id },
        APP_PRIVATE_KEY, {
        // algorithm: 'RS256', // process.env.TOKEN_ALGORITHM,
        expiresIn: TOKEN_EXPIRY_TIME
      })
    }

    // TODO: save token to db to validate expiry

      // return token of prisma in order to get data from prisma
      // const authPayload: AuthPayload = {
      //     user,
      //     token: jwt.sign(
      //         {
      //                 service: "default@default",
      //                 roles: user.role
      //         },
      //         APP_PRIVATE_KEY, {
      //             // algorithm: 'RS256', // process.env.TOKEN_ALGORITHM,
      //             expiresIn: TOKEN_EXPIRY_TIME
      //         })
      // }

    return authPayload;
  },

  verifyPatient: (root, { verify }, ctx: Context) => {
    const userId = ctx.userId;
    return ctx.db.updateUser({
      where: { id: userId },
      data: { patient: { update: { verified: verify } } }
    }).patient().verified();
  },

  updatePatientProfile: async (root, { profile }, ctx: Context) => {
    const userId = ctx.userId;
    const id = await ctx.db.user({ id: userId }).patient().profile().id();
    return ctx.db.updatePatientProfileInfo({
      data: profile,
      where: { id }
    });
  },

  updatePatientProfileActivities: async (root, { activities }, ctx: Context) => {
    const userId = ctx.userId;
    const id = await ctx.db.user({ id: userId }).patient().profile().id();
    return await ctx.db.updatePatientProfileInfo({
      data: {
        profileActivities: activities,
      },
      where: { id }
    }).profileActivities();
  },

  createProfileActivities: async (root, { activities }, ctx: Context) => {
    const userId = ctx.userId;
    const id = await ctx.db.user({ id: userId }).patient().profile().id();
    for (const a of activities) {
      await ctx.db.createProfileActivity(a);
    }
    return ctx.db.profileActivities({ where: {} });
  },

  deleteAppUser: (root, { args }, ctx: Context) => {
    log.info(`deleting user ${logFormat(args)}`);
    if (args.username) {
      return ctx.db.deleteUser({ username: args.username });
    } else if (args.id) {
      return ctx.db.deleteUser({ id: args.id });
    }
    throw new UserInputError('Missing Argument in deleteAppUser');
  },


  updateUserVerificationCode: (root, { username, verificationCode }, ctx: Context) => {
    return ctx.db.updateUser({
      where: { username },
      data: {
        patient: {
          update: {
            verificationCode
          }
        }
      },
    })
  },


  // updateAppUser: (root, { userUpdate }, ctx: Context) => {
  //   const userId = ctx.userId;
  //   return ctx.db.updateUser({
  //     data: userUpdate as UserUpdateInput,
  //     where: { id: userId }
  //   });
  // },



  // TODO: correct task deletion
  disengageBuddy: async (root, { userId }, ctx: Context) => {
    // const userId = ctx.userId;
    const userPatId = await ctx.db.user({ id: userId }).patient().id();

    // set request to removed - should only be one req
    const [requests] = await (ctx.db.buddyRequests({
      where: {
        OR: [
          { from: { id: userPatId } },
          { to: { id: userPatId } }
        ],
        state: "CONFIRMED",
      }
    }));
    if (requests) {
      await ctx.db.updateBuddyRequest({
        where: { id: requests.id },
        data: { state: "REMOVED" }
      });
    }

    const buddyUserId = await ctx.db.user({ id: userId }).patient().buddy().patient().user().id();
    const chatId = await ctx.db.user({ id: userId }).patient().buddy().chat().id();
    const buddyIdU = await ctx.db.user({ id: userId }).patient().buddy().id();
    const buddyIdB = await ctx.db.user({ id: buddyUserId }).patient().buddy().id();
    log.info('disengageBuddy - buddy Ids ' + buddyIdU + '  ' + buddyIdB);

    await ctx.db.deleteChat({ id: chatId });
    await ctx.db.deleteBuddy({ id: buddyIdU });
    await ctx.db.deleteBuddy({ id: buddyIdB });

    // TODO: save task ids and clean up timer list
    // const delChatTask = await ctx.db.deleteManyScheduledTasks({ chatId: chatId }).count();
    // log.info('disengageBuddy - delChatTask ' + delChatTask);
    // TODO: only remove tasks which are bound to buddy - not system tasks - e.g. quest reminders


    const dontDelete: TaskTypes[] = [
      "PUSH_NOTIFY_IPAQ_REMINDER",
      "PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP",
      "PUSH_NOTIFY_PHQ_REMINDER",
      "PUSH_NOTIFY_PHQ_REMINDER_FOLLOWUP",
    ]

    let res = (await ctx.db.scheduledTasks({
      where:
        { userId: userId, taskType_not_in: dontDelete }
    })).map(r => r.id);

    res = [
      ...res,
      ...(await ctx.db.scheduledTasks({
        where:
          { userId: buddyUserId, taskType_not_in: dontDelete }
      })).map(r => r.id)
    ];
    res = [
      ...res,
      ...(await ctx.db.scheduledTasks({
        where:
          { chatId: chatId }
      })).map(r => r.id)
    ];

    for (const id of res) {
      await ctx.db.deleteManyScheduledTasks({ id });
    }
    await taskScheduler.deleteTasksAfterUnlink(res);

    // await ctx.db.deleteManyScheduledTasks({ userId: userId, taskType_not_in: dontDelete });
    // await ctx.db.deleteManyScheduledTasks({ userId: buddyUserId });
    // await ctx.db.deleteManyScheduledTasks({ chatId: chatId });

    // await ctx.db.updateUser({
    //   where: { id: buddyId },
    //   data: {
    //     patient: {
    //       update: {
    //         buddy: {
    //           delete: true,
    //         }
    //       }
    //     }
    //   },
    // });
    // return ctx.db.updateUser({
    //   where: { id: userId },
    //   data: {
    //     patient: {
    //       update: {
    //         buddy: {
    //           delete: true,
    //         },
    //       }
    //     }
    //   },
    // });
    return ctx.db.user({ id: userId });
  },

  updateUsersSettings: async (root, { settings }, ctx: Context) => {
    const userId = ctx.userId;
    return await ctx.db.updateUser({
      where: { id: userId },
      data: { settings: { update: settings } },
    }).settings()
  },


  saveNotificationInformation: async (root, { webPushInfos }, ctx: Context) => {
    const userId = ctx.userId;
    return await ctx.db.updateUser(
      {
        where: { id: userId },
        data: { notifications: { create: webPushInfos } }
      }).notifications();
  },


  sendTestNotification: async (root, { id }, ctx: Context) => {
    const notificationInfos = await ctx.db.user({ id: ctx.userId }).notifications();
    log.info(`sendTestNotification - ${id} `);

    let payload = notification.buildPayload({
      body: '🌞 - Notifikation gesendet - ' + moment().toISOString(),
      title: '🚀 Test Notifikation an Gerät: ',
      actionTitle: '⭐ Button ⭐',
    });

    // send to specified id / device
    if (id) {
      const singleNotification = notificationInfos.find(e => e.id === id)
      payload.notification.title += ' ' + singleNotification.name;
      if (singleNotification) {
        await notification.sendNotificationToUserEndpoint(
          ctx.db.user({ id: ctx.userId }),
          payload,
          singleNotification.notificationInformation
        )
        return true;
      }
      return false;
    } else {
      // send to all registered ids / devices
      for (const notify of notificationInfos) {
        payload.notification.title = '🚀 Test Notifikation an Gerät ' + notify.name;
        await notification.sendNotificationToUserEndpoint(
          ctx.db.user({ id: ctx.userId }),
          payload,
          notify.notificationInformation,
        )
      }
      return true;
    }
  },

  deleteNotificationInformation: async (root, { id }, ctx: Context) => {
    const usersNotification = await ctx.db.user({
      id: ctx.userId
    }).notifications({
      where: { id }
    });
    if (usersNotification.length > 0 && await ctx.db.$exists.webPushNotification({ id })) {
      await ctx.db.deleteWebPushNotification({ id });
      return true;
    }
    return false;
  },
}


export const UserSubscriptionResolver: Pick<
  SubscriptionResolvers.Type
  , 'watchHasBuddy'
  | 'watchUser'
> = {
  ...SubscriptionResolvers.defaultResolvers,

  // unused
  watchHasBuddy: {
    subscribe: async (root, args, ctx: Context) => {
      // const userId = ctx.userId;
      const pId = await ctx.db.user({ id: ctx.userId }).patient().id();
      return ctx.db.$subscribe.buddy({
        mutation_in: ['CREATED', 'UPDATED', 'DELETED'],
        node: { patient: { id: pId } }
      }).node();
    },
    resolve: (root: Buddy) => root
  },

  // unused
  watchUser: {
    subscribe: async (root, args, ctx: Context) => {
      const userId = ctx.userId;
      return ctx.db.$subscribe.user({
        mutation_in: ['UPDATED'],
        node: { id: userId }
      }).node();
    },
    resolve: (root: User) => {
      log.info('resolving watch User' + root.username);
      return root
    }
  },
}