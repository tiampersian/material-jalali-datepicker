import { AbstractFormViewManager, DateHelper } from '@tiba/core';
import { BaseCustomInputBuilder, ServiceMockHelper } from '@tiba/core-test';
import { DatePickerComponent } from './date-picker.component';
import { IDatePickerConfig } from '../../../../../core/src/lib/models/date-picker-config.model';
import dayjs from 'dayjs';

const m = dayjs as any;

export function expectedValue(value: string | number | Date, timezoneId: string): string {
  return m(m(value).tz(timezoneId).format('YYYY-MM-DDTHH:mm:ss')).tz(m.tz.guess()).toISOString();
}

export function expectedValueInTimezone(value: any, timezoneId: string): string {
  return m(value).tz(timezoneId).toISOString();
}


export class DatePickerComponentBuilder extends BaseCustomInputBuilder<DatePickerComponent>{
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

  build(): DatePickerComponent {
    const stateService = ServiceMockHelper.stateServiceStub;
    stateService.setState({ userTimeZoneId: this.userTimezoneId });
    this.viewManagerStub.stateService = stateService;

    const sut = new DatePickerComponent(
      this.viewManagerStub,
      {} as IDatePickerConfig
    );
    sut.isRenderComplete = true;
    if (this.isTimeZoneUTC) {
      sut.displayValueInUTCTimeZone = this.isTimeZoneUTC;
    }
    this.afterBuild(sut);
    return sut;
  }
}
