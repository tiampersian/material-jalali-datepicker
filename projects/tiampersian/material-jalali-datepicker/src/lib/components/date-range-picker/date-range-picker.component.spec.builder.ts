import { AbstractFormViewManager, DateHelper } from '@tiba/core';
import { BaseCustomInputBuilder, ServiceMockHelper } from '@tiba/core-test';
import { DateRangePickerComponent } from './date-range-picker.component';
import { IDateRangePickerConfig } from '../../../../../core/src/lib/models/date-range-picker-config.model';
import dayjs from 'dayjs';

const m = dayjs as any;

export function expectedValue(value: string | number | Date, timezoneId: string): string {
  return m(m(value).tz(timezoneId).format('YYYY-MM-DDTHH:mm:ss')).tz(m.tz.guess()).toISOString();
}

export function expectedValueInTimezone(value: any, timezoneId: string): string {
  return m(value).tz(timezoneId).toISOString();
}


export class DateRangePickerComponentBuilder extends BaseCustomInputBuilder<DateRangePickerComponent>{
  viewManagerStub: AbstractFormViewManager;
  userTimezoneId = 'Atlantic/Cape_Verde'; // -01:00 offset
  isTimeZoneUTC: boolean;

  constructor() {
    super();

    this.viewManagerStub = ServiceMockHelper.formViewManager();
  }

  with_isTimeZoneUTC(value: boolean) {
    this.isTimeZoneUTC = value;
    return this;
  }

  with_userTimezoneId(value: string) {
    this.userTimezoneId = value;
    return this;
  }

  build(): DateRangePickerComponent {
    const stateService = ServiceMockHelper.stateServiceStub;
    stateService.setState({ userTimeZoneId: this.userTimezoneId });
    this.viewManagerStub.stateService = stateService;

    const sut = new DateRangePickerComponent(
      this.viewManagerStub,
      {} as IDateRangePickerConfig
    );
    sut.isRenderComplete = true;
    if (this.isTimeZoneUTC) {
      sut.displayValueInUTCTimeZone = this.isTimeZoneUTC;
    }
    this.afterBuild(sut);
    return sut;
  }
}
