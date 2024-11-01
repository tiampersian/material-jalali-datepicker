import dayjs, { Dayjs, ManipulateType, OpUnitType, QUnitType } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import jalaliday from 'jalaliday';
import { isString } from "lodash-es";

dayjs.extend(jalaliday);
dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(localeData);
dayjs.extend(customParseFormat)

if (typeof window !== 'undefined') {
  window['dayjs'] = dayjs;
}

export class DateHelper {
  static TimeDefaultValue(useMaxTimeValue: boolean): Date {
    return useMaxTimeValue ? dayjs('2000/01/01 23:59:59').toDate() : dayjs('2000/01/01 00:00:00').toDate();
  }
  static ParseAsLocalAndConvertToUTC(value: Date, userTimeZoneId: string): Date {
    return this.ParseAsLocalAndConvertByLocale(
      this.getDayJsValue(value).format('YYYY/MM/DD HH:mm:ss'), 'YYYY/MM/DD HH:mm:ss', userTimeZoneId, null
    ).toDate();
  }
  static ParseAsUtcAndConvertToLocal(_inputValue: Date, userTimeZoneId: string): Date {
    return this.getDayJsValue(_inputValue, null, null).tz(userTimeZoneId).toDate();
  }
  static ParseAsLocalAndConvertByLocale(newValue: any, format: string, userTimeZoneId: string, calendarType: any): Dayjs {
    return this.getDayJsValue(newValue, null, format).calendar(calendarType);
  }

  static diff(from: Date, to: Date, unit?: QUnitType | OpUnitType, float?: boolean) {
    return dayjs(from).diff(to, unit);
  }

  static isLocaleIran(localeId: string): boolean {
    return localeId === 'fa-IR' || localeId === 'fa';
  }

  static getCalendarType(localeId: string): 'jalali' | 'gregory' {
    return this.isLocaleIran(localeId) ? 'jalali' : 'gregory';
  }

  static getDayJsValue(value?: Date | string, localeId?: string, format?: string): Dayjs {
    if (!isString(value)) {
      format = undefined;
    }

    if (!localeId) {
      return dayjs(value, format);
    }
    const calendarType = this.getCalendarType(localeId);
    const isJalali = calendarType === 'jalali';

    if (isJalali && isString(value)) {
      return dayjs(dayjs(value, format).format('YYYY/MM/DD HH:mm:ss'), { jalali: true } as any).calendar(calendarType).locale(localeId);
    }

    return dayjs(value, format).calendar(calendarType).locale(localeId);
  }

  static format(value: Date | string, format: string, locale: string): string {
    // this.getDayJsValue(value, locale)
    return dayjs(value).calendar(DateHelper.getCalendarTypeByLocale(locale)).locale(locale).format(format);
  }

  private static getCalendarTypeByLocale(locale: string): "jalali" | "gregory" {
    return locale.startsWith('fa') ? 'jalali' : 'gregory';
  }

  static add(dt: Date | string, value: number, unit?: ManipulateType): Date {
    return this.getDayJsValue(dt).add(value, unit).toDate();
  }
};
