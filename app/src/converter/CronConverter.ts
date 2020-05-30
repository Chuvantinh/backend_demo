/**
 * Class to convert time intervals to an cron format
 */
export class CronConverter {
    private static readonly MINUTESOFHOUR: number = 59;
    private static readonly HOURSADAY: number = 23;
    private static readonly DAYSAMONTH: number = 31;

    /**
     * Converts an interval in minutes to an cron formatted interval
     * @param startTime, Starting point in time
     * @param minuteInterval, Interval in minutes
     * @returns string, The cron formatted interval
     */
    static convertToCronMinuteInterval(startTime: Date, minuteInterval: number): string {
        let result: string = '';
        const interval: number[] = CronConverter.calculateMinuteInterval(startTime, minuteInterval);
        for (const elem of interval) {
            result += elem + ',';
        }
        result = result.slice(0, result.length - 1);
        return result;
    }

    /**
     * Converts an interval in hours to an cron formatted interval
     * @param startTime, Starting point in time
     * @param hourInterval, Interval in hours
     * @returns string, The cron formatted interval
     */
    static convertToCronHourInterval(startTime: Date, hourInterval: number): string {
        let result: string = '';
        const interval: number[] = CronConverter.calculateHourInterval(startTime, hourInterval);
        for (const elem of interval) {
            result += elem + ',';
        }
        result = result.slice(0, result.length - 1);
        return result;
    }

    /**
     * Converts an interval in days to an cron formatted interval
     * @param startTime, Starting point in time
     * @param dayInterval, Interval in days
     * @returns string, The cron formatted interval
     */
    static convertToCronDayInterval(startTime: Date, dayInterval: number): string {
        let result: string = '';
        const interval: number[] = CronConverter.calculateDayInterval(startTime, dayInterval);
        for (const elem of interval) {
            result += elem + ',';
        }
        result = result.slice(0, result.length - 1);
        return result;
    }

    /**
     * Calculates a time interval for one hour
     * @param startTime, Starting point in time
     * @param minuteInterval, Interval in minutes
     * @returns number[], Array of minutes that fits the interval for one hour
     */
    private static calculateMinuteInterval(startTime: Date, minuteInterval: number): number[] {
        let result: number[] = [];
        let interval: number = startTime.getMinutes();
        while (true) {
            if (interval > CronConverter.MINUTESOFHOUR && interval - CronConverter.MINUTESOFHOUR > startTime.getMinutes()) {
                break;
            } else if (interval > CronConverter.MINUTESOFHOUR) { result.push(interval - (CronConverter.MINUTESOFHOUR + 1)); }
            else { result.push(interval); }
            interval += minuteInterval;
        }
        result = result.sort(CronConverter.compareNumbers);
        return result;
    }

    /**
     * Calculates a time interval for one day
     * @param startTime, Starting point in time
     * @param hourInterval, Interval in hours
     * @returns number[], Array of hours that fits the interval for one day
     */
    private static calculateHourInterval(startTime: Date, hourInterval: number): number[] {
        let result: number[] = [];
        let interval: number = startTime.getHours();
        while (true) {
            if (interval > CronConverter.HOURSADAY && interval - CronConverter.HOURSADAY > startTime.getHours()) {
                break;
            } else if (interval > CronConverter.HOURSADAY) {result.push(interval - (CronConverter.HOURSADAY + 1));}
            else { result.push(interval); }
            interval += hourInterval;
        }
        result = result.sort(CronConverter.compareNumbers);
        return result;
    }

    /**
     * Calculates a time interval for one month
     * @param startTime, Starting point in time
     * @param dayInterval, Interval in days
     * @returns number[], Array of days that fits the interval for one month
     */
    private static calculateDayInterval(startTime: Date, dayInterval: number): number[] {
        let result: number[] = [];
        let interval: number = startTime.getDate();
        while (true) {
            if (interval > CronConverter.DAYSAMONTH && interval - CronConverter.DAYSAMONTH > startTime.getDate()) {
                break;
            } else if (interval > CronConverter.DAYSAMONTH) { result.push(interval - (CronConverter.DAYSAMONTH)); }
            else { result.push(interval); }
        }
        result = result.sort(CronConverter.compareNumbers);
        return result;
    }

    /**
     * Comparator to numeric sorting algorithms
     * @param a, First variable
     * @param b, Second variable
     * @returns
     *  - 1 if a is greater than b
     *  - 0 if a and b are equal
     *  - -1 if a is less than b
     */
    private static compareNumbers(a: number, b: number): number {
        return a - b;
    }
}
