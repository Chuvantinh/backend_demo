import { IIpaq, IUser } from '../../interfaces/';
import { BuddyMatch, Context } from '../../types';
import { Gender, Activity } from '../../generated/prisma-client';
import { log } from '../../logger';
import { userInfo } from 'os';


/**
 * Class to categories the questionnaire results
 */
export class Categories {


  private static readonly HOUR_TO_MINUTES: number = 60;
  private static readonly PHQ9_LOWER_GROUP_MIN: number = 10;
  private static readonly PHQ9_LOWER_GROUP_MAX: number = 18;
  private static readonly IPAQ_MODERATE_VIGOROUS_DAYS: number = 3;
  private static readonly IPAQ_MODERATE_VIGOROUS_MIN: number = 20;
  private static readonly IPAQ_MODERATE_MODERATE_DAYS: number = 5;
  private static readonly IPAQ_MODERATE_WALKING_MIN: number = 30;
  private static readonly IPAQ_MODERATE_COMBINATION_DAYS: number = 5;
  private static readonly IPAQ_MODERATE_COMBINATION_MET: number = 600;
  private static readonly IPAQ_HIGH_VIGOROUS_MET: number = 1500;
  private static readonly IPAQ_HIGH_VIGOROUS_DAYS: number = 3;
  private static readonly IPAQ_HIGH_COMBINATION_MET: number = 3000;
  private static readonly IPAQ_HIGH_COMBINATION_DAYS: number = 7;
  private static readonly CATEGORIES: number[] = [0, 1, 2];
  constructor() { }

  /**
   * Categorizes the phq9 questionnaire result
   * 0 -9 is not considered by this function
   * 10 - 18 score points is category 0
   * 19 - 27 score points is category 1
   * @param user, User whose phq9 score should be categorized
   * @returns number, Returns the category number
   */
  public getPhq9Category(user: IUser): number {
    // const score: number = user.phq9s[0].score;
    // if (score >= Categories.PHQ9_LOWER_GROUP_MIN && score <= Categories.PHQ9_LOWER_GROUP_MAX) {
    //     return Categories.CATEGORIES[0];
    // } else {
    //     return Categories.CATEGORIES[1];
    // }
    return 0;
  }

  /**
   * Categorizes the ipaq questionnaire result
   * @param user, User whose ipaq score should be categorized
   * @returns number, Returns:
   * - 0, if user has low sports activities
   * - 1, if user has moderate sports activities
   * - 2, if user has high sports activities
   */
  public getIpaqCategory(user: IUser): number {
    // const ipaq: IIpaq = user.quests.ipaqs[0];
    // if (this.isIpaqHigh(ipaq)) {
    //     return Categories.CATEGORIES[2];
    // } else if (this.isIpaqModerate(ipaq)) {
    //     return Categories.CATEGORIES[1];
    // } else {
    //     return Categories.CATEGORIES[0];
    // }
    return 0;
  }

  /**
   * Checks if the answered questions leads to a high sport activity
   * @param ipaq, Current ipaq questionnaire of the user
   * @returns true, if the answered questions leads to a high sport activity
   */
  private isIpaqHigh(ipaq: IIpaq): boolean {
    // Bedingung kann im Dokument "BuddyAnforderungsergaenzung-V1.3-07_05_2019" auf Seite 24
    // nachgelesen werden
    return (
      (ipaq.question_1_day + ipaq.question_2_day + ipaq.question_3_day)
      >= Categories.IPAQ_HIGH_COMBINATION_DAYS
      && ipaq.score >= Categories.IPAQ_HIGH_COMBINATION_MET
      || ipaq.question_1_day >= Categories.IPAQ_HIGH_VIGOROUS_DAYS
      && ipaq.score >= Categories.IPAQ_HIGH_VIGOROUS_MET
    );
  }

  /**
   * Checks if the answered questions leads to a moderate sport activity
   * @param ipaq, Current ipaq questionnaire of the user
   * @returns true, if the answered questions leads to a high sport activity
   */
  private isIpaqModerate(ipaq: IIpaq): boolean {
    // Bedingung kann im Dokument "BuddyAnforderungsergaenzung-V1.3-07_05_2019" auf Seite 24
    // nachgelesen werden
    return (
      (ipaq.question_1_day + ipaq.question_2_day + ipaq.question_3_day)
      >= Categories.IPAQ_MODERATE_COMBINATION_DAYS
      && ipaq.score >= Categories.IPAQ_MODERATE_COMBINATION_MET
      || (ipaq.question_2_day >= Categories.IPAQ_MODERATE_MODERATE_DAYS
        || (ipaq.question_3_hour * Categories.HOUR_TO_MINUTES + ipaq.question_3_minute)
        >= Categories.IPAQ_MODERATE_WALKING_MIN)
      || ipaq.question_1_day >= Categories.IPAQ_MODERATE_VIGOROUS_DAYS
      && ipaq.question_1_hour * Categories.HOUR_TO_MINUTES + ipaq.question_1_minute
      >= Categories.IPAQ_MODERATE_VIGOROUS_MIN
    );
  }
}
