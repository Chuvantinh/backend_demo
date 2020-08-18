"use strict";
exports.__esModule = true;
exports.QuestionnaireHelper = void 0;
var apollo_server_1 = require("apollo-server");
/**
 * Interface for all questionnaires
 */
var QuestionnaireHelper = /** @class */ (function () {
    function QuestionnaireHelper() {
    }
    /**
     * Calculates when the next questionnaire should be filled out
     * @param days, Number of days after which the next questionnaire should be filled out
     * @returns Date, Point in time when the next questionnaire should be filled out
     */
    QuestionnaireHelper.calculateExpiryDate = function (days) {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + days);
        return expiry;
    };
    /**
     * Calculates the score a user has achieved for the questionnaire
     * @param answers, The questions of the questionnaire
     * @returns number, The resulting score
     */
    QuestionnaireHelper.calculateScorePhq = function (answers) {
        var score = 0;
        for (var _i = 0, answers_1 = answers; _i < answers_1.length; _i++) {
            var i = answers_1[_i];
            score += i;
        }
        return score;
    };
    QuestionnaireHelper.calculateScoreIpaq = function (answers) {
        var score = 0;
        // Multiplier for Hight - Mid - Low and No activity ratings
        // No activity does not influence score
        var MET = [8.0, 4.0, 3.3, 1.0];
        var MINUTES_IN_HOUR = 60;
        if (answers.length !== QuestionnaireHelper.NUM_IPAQ_ANSWERS) {
            throw new apollo_server_1.ValidationError('UNEXPECTED IPAQ Length');
        }
        // log.info('IPAQ answers ' + JSON.stringify(answers, null, ' '));
        // last answer is not relevant for scoring => (length -1)
        for (var i = 0; i < (answers.length - 1); ++i) {
            score += MET[i]
                * answers[i].numMinutes
                * (answers[i].numHours * MINUTES_IN_HOUR)
                * answers[i].numDays;
            // log.info('IPAQ score ' + score);
        }
        return score;
    };
    QuestionnaireHelper.NUM_IPAQ_ANSWERS = 4;
    return QuestionnaireHelper;
}());
exports.QuestionnaireHelper = QuestionnaireHelper;
