
export class DateValidator {
  public static isActivityDateInWeek(activityDate: Date | string, week: { start: Date | string,
    end: Date | string}): boolean {
  const start: Date = new Date(week.start);
  const end: Date = new Date(week.end);
  const activity: Date = new Date(activityDate);
  return start <= activity && end >= activity;
}

    public static weekConsistsOfSevenDays(start: Date | string, end: Date | string): boolean {
  const begin: Date = new Date(start);
  const finish: Date = new Date(end);
  return finish.getTime() - begin.getTime() === DateValidator.WEEKDAYS * DateValidator.DAY_IN_MILLISECONDS;
}
    private static readonly WEEKDAYS: number = 6;
    private static readonly DAY_IN_MILLISECONDS: number = 864 * Math.pow(10, 5);
}
