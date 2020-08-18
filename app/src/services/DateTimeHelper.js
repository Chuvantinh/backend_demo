"use strict";
exports.__esModule = true;
exports.toMomentDuration = void 0;
var moment = require("moment");
exports.toMomentDuration = function (span) {
    return moment.duration({
        days: span.days,
        hours: span.hours,
        minutes: span.minutes,
        seconds: span.seconds
    });
};
