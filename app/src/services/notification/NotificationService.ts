import * as  webpush from 'web-push';
import { User, TaskTypes, Bot, UserPromise } from '../../generated/prisma-client';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, SERVER_PROXY } from '../../config/env.config';
import { log, logT, logFormat } from '../../logger';

interface NotificationPayload {
  notification: {
    title: string;
    body: string;
    icon: string;
    vibrate?: number[];
    data?: {
      dateOfArrival?: Date;
      primaryKey?: number;
    }
    actions?: [{
      action: string;
      title: string;
    }];
  }
}

interface NotificationPayloadMinimal {
  title: string,
  body: string;
  actionTitle: string
}

interface SendWebPushArgs {
  type: TaskTypes,
  // sender: User | Bot | 'SYSTEM',
  // receiver: User | User[],
  // senderPromise: UserPromise | Bot | 'SYSTEM',
  // receiverPromise: UserPromise | UserPromise[],
  sender: UserPromise | Bot | 'SYSTEM',
  receiver: UserPromise | UserPromise[],
}

const VIBRATION_PATTERN = [100, 50, 100];
const ICON_PATH = 'assets/icon-72x72.png';

/**
 * Class to send push notifications
 */
class NotificationService {

  /**
   * Creates the payload for a push notification
   * @param title, Title of the push notification
   * @param body, Body of the push notification
   * @param icon, Icon that should be shown at the push notification
   * @param vibrate, Vibrate pattern of the device
   * @param dateOfArrival, Date that is shown in the push notification (upper right corner)
   * @param primaryKey
   * @param action
   * @param actionTitle, Title in the lower left corner of the push notifications
   * @returns Payload for a push notification
   */
  // public createPayload(title?: any,
  //   body?: any,
  //   icon?: any,
  //   vibrate?: any,
  //   dateOfArrival?: any,
  //   primaryKey?: any,
  //   action?: any,
  //   actionTitle?: any): NotificationPayload {
  //   return {
  //     notification: {
  //       title,
  //       body,
  //       icon,
  //       vibrate,
  //       data: {
  //         dateOfArrival,
  //         primaryKey
  //       },
  //       actions: [{
  //         action,
  //         title: actionTitle
  //       }]
  //     }
  //   };
  // }
  private readonly VAPID_KEYS = {
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY
  };

  public constructor() {
    webpush.setVapidDetails(
      'mailto:mantheys@charite.de',
      this.VAPID_KEYS.publicKey,
      this.VAPID_KEYS.privateKey
    );
  }

  private getDefaultNotificationPayload(): NotificationPayload {
    return {
      notification: {
        title: `EMPTY_TITLE`,
        body: `EMPTY_BODY`,
        icon: 'assets/icon-72x72.png',
        vibrate: VIBRATION_PATTERN,
        data: {
          dateOfArrival: new Date(),
          primaryKey: undefined,
        },
        actions: [{
          action: 'explore',
          title: 'EMPTY_ACTION_TITLE'
        }]
      }
    }
  }

  public buildPayload(partPayload: NotificationPayloadMinimal): NotificationPayload {
    const defPayload = this.getDefaultNotificationPayload();
    const payload: NotificationPayload = {
      notification: {
        ...defPayload.notification,
        title: partPayload.title,
        body: partPayload.body,
        actions: [{
          action: 'explore',
          title: partPayload.actionTitle
        }]
      },
    }

    logT.info(`Notification Payload ${logFormat(payload)}`)
    return payload;
  }

  public sendPushNotification(args: SendWebPushArgs) {
    switch (args.type) {
      case 'PUSH_NOTIFY_INCOMING_BUDDY_REQUEST':
        this.sendIncomingBuddyRequestNotification(args);
        break;
      case 'PUSH_NOTIFY_BUDDY_REQUEST_DENIED':
        this.sendBuddyRequestDeniedNotification(args);
        break;
      case 'PUSH_NOTIFY_BUDDY_REQUEST_DENIED':
        this.sendBuddyRequestDeniedNotification(args);
        break;

      case 'PUSH_NOTIFY_IPAQ_REMINDER':
      case 'PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP':
        this.sendPushNotifyIpaqReminder(args);
        break;
      case 'PUSH_NOTIFY_PHQ_REMINDER':
      case 'PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP':
        this.sendPushNotifyPhqReminder(args);
        break;
      case 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER':
        this.sendPushNotEnoughActivitiesUser(args);
        break;
      case 'PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY':
        this.sendPushNotEnoughActivitiesBuddy(args);
        break;
      // case 'PUSH_NOTIFY_TO_MUCH_ACTIVITIES_USER':
      //   break;
      case 'PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY':
        this.sendPushNotifyToMuchActivitiesBuddy(args);
        break;

      case 'PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY':
        this.sendPushNotifyMissedActivityBuddy(args);
        break;

      default:
        break;
    }
  }


  private sendBuddyRequestDeniedNotification(args: SendWebPushArgs): void {
    const sender = args.sender as UserPromise;      // user which did not answer
    const receiver = args.receiver as UserPromise;  // requesting user

    // TODO use messages from config in db
    const payload = this.buildPayload({
      title: `${sender.username} hat deine Anfrage leider nicht beantwortet`,
      body: `Du kannst nun erneut nach Buddies suchen`,
      actionTitle: 'Deine Buddy-Anfragen wurde nicht beantwortet'
    })
    this.sendNotificationToUser(receiver, payload);
  }

  private sendPushNotifyIpaqReminder(args: SendWebPushArgs): void {
    // const receiver = args.receiver as User;
    const receiver = args.receiver as UserPromise;

    // TODO use messages from config in db
    const payload = this.buildPayload({
      title: `IPAQ Fragebogen ausfüllen`,
      body: `Bitte erneut IPAQ Fragebogen ausfüllen`,
      actionTitle: 'Zum Fragebogen'
    })

    this.sendNotificationToUser(receiver, payload);
  }

  private sendPushNotifyPhqReminder(args: SendWebPushArgs): void {
    // const receiver = args.receiver as User;
    const receiver = args.receiver as UserPromise;
    // TODO use messages from config in db
    const payload = this.buildPayload({
      title: `PHQ Fragebogen ausfüllen`,
      body: `Bitte erneut PHQ Fragebogen ausfüllen`,
      actionTitle: 'Zum Fragebogen'
    });
    this.sendNotificationToUser(receiver, payload);
  }

  private sendPushNotEnoughActivitiesUser(args: SendWebPushArgs): void {
    // const receiver = args.receiver as User;
    const receiver = args.receiver as UserPromise;
    // TODO use messages from config in db
    const payload = this.buildPayload({
      title: `Bitte aktivitäten Planen`,
      body: `Bisher sind zu wenige aktivitäten geplant`,
      actionTitle: 'explore',
    });
    this.sendNotificationToUser(receiver, payload);
  }

  private sendPushNotEnoughActivitiesBuddy(args: SendWebPushArgs): void {
    const receiver = args.receiver as UserPromise;

    // TODO use messages from config in db
    const payload = this.buildPayload({
      title: `Ihr Buddy hat zuwenig aktivitäten geplant`,
      body: `Sprechen Sie doch darüber`,
      actionTitle: 'explore',
    });
    this.sendNotificationToUser(receiver, payload);
  }

  private sendPushNotifyToMuchActivitiesBuddy(args: SendWebPushArgs): void {
    // const receiver = args.receiver as User;
    const receiver = args.receiver as UserPromise;

    const payload = this.buildPayload({
      title: `Ihr Buddy hat zu viele aktivitäten geplant`,
      body: `Sprechen Sie doch darüber`,
      actionTitle: 'Zum Chat'
    });
    this.sendNotificationToUser(receiver, payload);
  }

  private sendPushNotifyMissedActivityBuddy(args: SendWebPushArgs): void {
    const receiver = args.receiver as UserPromise;

    // TODO use messages from config in db
    const payload = this.buildPayload({
      title: `Ihr Buddy hat geplante Aktivtäten verpasst`,
      body: `Bitte unterstüzen Sie ihren Buddy`,
      actionTitle: 'Zum Chat'
    });
    this.sendNotificationToUser(receiver, payload);
  }


  /**
   * Sends a single remind message to a user
   * @param receiver, User that should receive the push notification
   * @param title, Title of the push notification
   * @param body, Body of the push notification
   * @param actionTitle, Title in the lower left corner of the push notification
   * @param icon, Icon that should be shown at the push notification
   * @param vibrate, Vibrate pattern of the device
   */
  // public sendRemindMessage(receiver: User,
  //   title: string,
  //   body: string,
  //   actionTitle: string,
  //   icon?: string,
  //   vibrate?: number[]): void {
  //   const notificationPayload = this.createPayload(
  //     title,
  //     body,
  //     (icon) ? icon : 'assets/icon-72x72.png',
  //     (vibrate) ? vibrate : [100, 50, 100],
  //     Date.now(),
  //     1,
  //     'explore',
  //     actionTitle
  //   );
  //   this.sendNotificationToUser(receiver, notificationPayload);
  // }

  /**
   * Sends a buddy-request push notification
   * @param receiver, User that should receive the push notification
   * @param sender, User that sends the push notification
   */
  public async sendIncomingBuddyRequestNotification(args: SendWebPushArgs): Promise<void> {
    const sender = args.sender as UserPromise;
    const senderName = await sender.username();
    const receiver = args.receiver as UserPromise;

    const payload = this.buildPayload({
      title: `${senderName} möchte dein Buddy werden`,
      body: `Schau dir ${senderName}'s Profil doch einmal an`,
      actionTitle: 'Schau doch mal in deine Buddy-Anfragen'
    });
    this.sendNotificationToUser(receiver, payload);
  }


  /**
   * Send a single push notification
   * @param receiver, User that should receive the push notification
   * @param payload, Payload that contains all the data of the push notification
   */
  public async sendNotificationToUser(receiver: UserPromise, payload: NotificationPayload): Promise<void> {

    //logT.info(`sending Notification with infos: ${logFormat(receiver.notificationInformation)}`);
    const notifications = await receiver.notifications();
    const pushInfos: webpush.PushSubscription[] = notifications.map(r => r.notificationInformation);

    for (const pushInfo of pushInfos) {
      await this.sendNotificationToUserEndpoint(receiver, payload, pushInfo);
    }
  }

  public async sendNotificationToUserEndpoint(receiver: UserPromise, payload: NotificationPayload, webPushInfo: any): Promise<boolean> {
    const pushInfo: webpush.PushSubscription = webPushInfo;
    const receiverName = await receiver.username();
    //logT.info(`sending Notification with infos: ${logFormat(receiver.notificationInformation)}`);
    if (pushInfo && pushInfo.endpoint && pushInfo.keys.auth && pushInfo.keys.p256dh) {
      // logT.info(`Try Notification send with infos: ${logFormat(ps)}`);

      const sendPromise = new Promise((resolve, reject): void => {
        webpush.sendNotification(
          webPushInfo,
          JSON.stringify(payload),
          // TODO:
          { proxy: SERVER_PROXY }
        ).then(() =>
          resolve('Notification send')
        ).catch((error) =>
          reject(error)
        );
      });
      sendPromise.catch((error) => logT.trace(`SendNotification ${error}`, error));
    } else {
      logT.info(`Push Notification send aborted - User ${receiverName} has no notification infos`);
      return false;
    }
    //logT.info(`sending Notification to ${receiver.username} with infos: ${logFormat(psj)}`);
    logT.info(`sending Notification to ${receiverName}`);
    return true;
  }


  public sendChatNotificationToUsers(senderName: string, receivers: UserPromise[], msgText: string): void {
    for (const r of receivers) {
      this.sendChatNotificationToUser(senderName, r, msgText);
    }
  }

  public async sendChatNotificationToUser(senderName: string, receiver: UserPromise, msgText: string): Promise<void> {
    const notifyInfos = await receiver.notifications();
    if (notifyInfos.length <= 0) {
      logT.info(`Push Notification send aborted - User ${receiver.username} has no notification infos`);
      return;
    }
    const payload: NotificationPayload = {
      notification: {
        title: `Neue Nachricht von ${senderName}`,
        body: msgText,
        icon: ICON_PATH,
        vibrate: VIBRATION_PATTERN,
      }
    }
    this.sendNotificationToUser(receiver, payload);
  }

  /**
 * Sends multiple push notifications
 * @param receivers, Users that should receive the push notifications (excludes the transmitting user automatically)
 * @param transmitter, User that sends the push notifications
 * @param payload, Payload that contains all the data of the push notification
 */
  // public sendNotificationToUsers(receivers: Array<User>, payload: NotificationPayload): void {
  //   logT.info(`Notification payload ${JSON.stringify(payload, null, ' ')}`)
  //   Promise.all(receivers.map((sub) => {
  //     webpush.sendNotification(
  //       JSON.parse(sub.notificationInformation),
  //       JSON.stringify(payload)
  //     ).then(() =>
  //       logT.info('Notification send')
  //     ).catch((error) =>
  //       logT.error(error.toString(), error)
  //     );
  //   })).then(() =>
  //     logT.info(`Notification send`)
  //   ).catch((error) =>
  //     logT.error(`Notification error ${error}`, error)
  //   );
  // }

}

export const notification = new NotificationService();
