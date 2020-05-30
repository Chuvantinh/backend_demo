import { IpaqAnswersCreateWithoutQuestInput } from '../../generated/prisma-client';
import { log } from '../../logger';
import { ApolloError, ValidationError } from 'apollo-server';

/**
 * Interface for all questionnaires
 */
export class QuestionnaireHelper {

  /**
   * Calculates when the next questionnaire should be filled out
   * @param days, Number of days after which the next questionnaire should be filled out
   * @returns Date, Point in time when the next questionnaire should be filled out
   */
  public static calculateExpiryDate(days: number): Date {
    const expiry: Date = new Date();
    expiry.setDate(expiry.getDate() + days);
    return expiry;
  }
  /**
   * Calculates the score a user has achieved for the questionnaire
   * @param answers, The questions of the questionnaire
   * @returns number, The resulting score
   */
  public static calculateScorePhq(answers: number[]): number {
    let score: number = 0;
    for (const i of answers) {
      score += i;
    }
    return score;
  }

  public static calculateScoreIpaq(answers: IpaqAnswersCreateWithoutQuestInput[]): number {
    let score: number = 0;
    // Multiplier for Hight - Mid - Low and No activity ratings
    // No activity does not influence score
    const MET: number[] = [8.0, 4.0, 3.3, 1.0];
    const MINUTES_IN_HOUR: number = 60;

    if (answers.length !== QuestionnaireHelper.NUM_IPAQ_ANSWERS) {
      throw new ValidationError('UNEXPECTED IPAQ Length');
    }

    // log.info('IPAQ answers ' + JSON.stringify(answers, null, ' '));
    // last answer is not relevant for scoring => (length -1)
    for (let i = 0; i < (answers.length - 1); ++i) {
      score += MET[i]
        * answers[i].numMinutes
        * (answers[i].numHours * MINUTES_IN_HOUR)
        * answers[i].numDays;
      // log.info('IPAQ score ' + score);
    }
    return score;
  }
  private static readonly NUM_IPAQ_ANSWERS = 4;
}
