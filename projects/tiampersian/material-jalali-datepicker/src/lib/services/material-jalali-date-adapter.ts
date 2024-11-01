import { Inject, InjectionToken, Optional, isDevMode } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import dayjs, { Dayjs } from 'dayjs';

export interface DayJsDateAdapterOptions {
    /**
     * Turns the use of utc dates on or off.
     * Changing this will change how Angular Material components like DatePicker output dates.
     * {@default false}
     */
    useUtc?: boolean;
}

/** InjectionToken for Dayjs date adapter to configure options. */
export const MAT_DAYJS_DATE_ADAPTER_OPTIONS =
    new InjectionToken<DayJsDateAdapterOptions>(
        'MAT_DAYJS_DATE_ADAPTER_OPTIONS',
        {
            providedIn: 'root',
            factory: MAT_DAYJS_DATE_ADAPTER_OPTIONS_FACTORY,
        }
    );

export function MAT_DAYJS_DATE_ADAPTER_OPTIONS_FACTORY(): DayJsDateAdapterOptions {
    return {
        useUtc: false,
    };
}

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

/** Adapts Dayjs Dates for use with Angular Material. */
export class MaterialJalaliDateAdapter extends DateAdapter<Dayjs> {
    private localeData: {
        firstDayOfWeek: number;
        longMonths: string[];
        shortMonths: string[];
        dates: string[];
        longDaysOfWeek: string[];
        shortDaysOfWeek: string[];
        narrowDaysOfWeek: string[];
    };
    calendarType: 'jalali' | 'gregory' = 'jalali';

    constructor(
        @Optional() @Inject(MAT_DATE_LOCALE) public dateLocale: string,
        @Optional()
        @Inject(MAT_DAYJS_DATE_ADAPTER_OPTIONS)
        private options?: DayJsDateAdapterOptions
    ) {
        super();

        this.initializeParser(dateLocale);
    }

    jEnData = {
        months: ["Farvardin", "Ordibehesht", "Khordaad", "Tir", "Mordaad", "Shahrivar", "Mehr", "Aabaan", "Aazar", "Dey", "Bahman", "Esfand"],
        shortMonths: ["Far", "Ord", "Kho", "Tir", "Amo", "Sha", "Meh", "Aab", "Aaz", "Dey", "Bah", "Esf"]
    };

    jFaData = {
        months: ("فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند").split("_"),
        shortMonths: "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split("_")
    };

    // TODO: Implement
    override setLocale(locale: string) {
        super.setLocale(locale);

        if (this.calendarType === 'jalali') {
            this.setJalaliData();
            return;
        }
        const dayJsLocaleData = this.dayJs().localeData();
        this.localeData = {
            firstDayOfWeek: dayJsLocaleData.firstDayOfWeek(),
            longMonths: dayJsLocaleData.months(),
            shortMonths: dayJsLocaleData.monthsShort(),
            dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
            longDaysOfWeek: range(7, (i) =>
                this.dayJs().set('day', i).format('dddd')
            ),
            shortDaysOfWeek: dayJsLocaleData.weekdaysShort(),
            narrowDaysOfWeek: dayJsLocaleData.weekdaysMin(),
        };
    }
    setJalaliData() {
        const dayJsLocaleData = this.dayJs().localeData();
        const temp = this.dateLocale.startsWith('fa') ? this.jFaData : this.jEnData;
        this.localeData = {
            firstDayOfWeek: 6,
            longMonths: temp.months,
            shortMonths: temp.shortMonths,
            dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D').toPerNumber()),
            longDaysOfWeek: range(7, (i) =>
                this.dayJs().set('day', i).format('dddd')
            ),
            shortDaysOfWeek: dayJsLocaleData.weekdaysShort(),
            narrowDaysOfWeek: dayJsLocaleData.weekdaysMin(),
        };
    }

    getYear(date: Dayjs): number {
        return this.dayJs(date).year();
    }

    getMonth(date: Dayjs): number {
        return this.dayJs(date).month();
    }

    getDate(date: Dayjs): number {
        return this.dayJs(date).date();
    }

    getDayOfWeek(date: Dayjs): number {
        return this.dayJs(date).day();
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        return style === 'long'
            ? this.localeData.longMonths
            : this.localeData.shortMonths;
    }

    getDateNames(): string[] {
        return this.localeData.dates;
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (style === 'long') {
            return this.localeData.longDaysOfWeek;
        }
        if (style === 'short') {
            return this.localeData.shortDaysOfWeek;
        }
        return this.localeData.narrowDaysOfWeek;
    }

    getYearName(date: Dayjs): string {
        return this.dayJs(date).format('YYYY');
    }

    getFirstDayOfWeek(): number {
        return this.localeData.firstDayOfWeek;
    }

    getNumDaysInMonth(date: Dayjs): number {
        return this.dayJs(date).daysInMonth();
    }

    clone(date: Dayjs): Dayjs {
        return date.clone();
    }

    createDate(year: number, month: number, date: number): Dayjs {
        const returnDayjs = this.dayJs()
            .set('year', year)
            .set('month', month)
            .set('date', date);
        return returnDayjs;
    }

    today(): Dayjs {
        return this.dayJs();
    }

    parse(value: any, parseFormat: string): Dayjs | null {
        if (value && typeof value === 'string') {
            return this.dayJs(
                value,
                dayjs().localeData().longDateFormat(parseFormat),
                this.locale
            );
        }
        return value ? this.dayJs(value).locale(this.locale) : null;
    }

    format(date: Dayjs, displayFormat: string): string {
        if (!this.isValid(date)) {
            throw Error('DayjsDateAdapter: Cannot format invalid date.');
        }
        return date.locale(this.locale).format(displayFormat);
    }

    addCalendarYears(date: Dayjs, years: number): Dayjs {
        return date.add(years, 'year');
    }

    addCalendarMonths(date: Dayjs, months: number): Dayjs {
        return date.add(months, 'month');
    }

    addCalendarDays(date: Dayjs, days: number): Dayjs {
        return date.add(days, 'day');
    }

    toIso8601(date: Dayjs): string {
        return date.toISOString();
    }

    toggleCalendarType() {
        this.calendarType = this.calendarType === 'jalali' ? 'gregory' : 'jalali';
        this.setLocale(this.dateLocale);
    }

    /**
     * Attempts to deserialize a value to a valid date object. This is different from parsing in that
     * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
     * string). The default implementation does not allow any deserialization, it simply checks that
     * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
     * method on all of it's `@Input()` properties that accept dates. It is therefore possible to
     * support passing values from your backend directly to these properties by overriding this method
     * to also deserialize the format used by your backend.
     * @param value The value to be deserialized into a date object.
     * @returns The deserialized date object, either a valid date, null if the value can be
     *     deserialized into a null date (e.g. the empty string), or an invalid date.
     */
    override deserialize(value: any): Dayjs | null {
        let date;
        if (value instanceof Date) {
            date = this.dayJs(value);
        } else if (this.isDateInstance(value)) {
            // NOTE: assumes that cloning also sets the correct locale.
            return this.clone(value);
        }
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = this.dayJs(value).toISOString();
        }
        if (date && this.isValid(date)) {
            return this.dayJs(date); // NOTE: Is this necessary since Dayjs is immutable and Moment was not?
        }
        return super.deserialize(value);
    }

    isDateInstance(obj: any): boolean {
        return dayjs.isDayjs(obj);
    }

    isValid(date: Dayjs): boolean {
        return this.dayJs(date).isValid();
    }

    invalid(): Dayjs {
        return this.dayJs(null);
    }

    dayJs(input?: any, format?: string, locale?: string): Dayjs {
        locale ??= this.locale;
        if (!this.shouldUseUtc) {
            return dayjs(input, { format, locale }, locale).calendar(this.calendarType);
        }

        return dayjs(
            input,
            { format, locale, utc: this.shouldUseUtc },
            locale
        ).utc().calendar(this.calendarType);
    }

    private get shouldUseUtc(): boolean {
        const { useUtc }: DayJsDateAdapterOptions = this.options || {};
        return !!useUtc;
    }

    private initializeParser(dateLocale: string) {
        // if (this.shouldUseUtc) {
        //   dayjs.extend(utc);
        // }

        // dayjs.extend(LocalizedFormat);
        // dayjs.extend(customParseFormat);
        // dayjs.extend(localeData);
        this.setLocale(dateLocale);
    }
}
