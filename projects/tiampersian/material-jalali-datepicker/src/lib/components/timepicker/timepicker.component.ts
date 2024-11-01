import { BaseInputComponent } from './../base-input.component';
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs from 'dayjs';
import { isString, range } from 'lodash-es';

@Component({
  selector: 'tp-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimepickerComponent), multi: true }
  ]
})
export class TimepickerComponent extends BaseInputComponent<Date> {
  defaultTime = new Date(2000, 1, 1, 0, 0, 0, 0);
  private _minuteGap = 5;
  @Input() isString = false;
  @Input() get minuteGap() {
    return this._minuteGap;
  }
  set minuteGap(value) {
    this._minuteGap = value;
    this.prepareMinuteData();
  }
  minuteData: Array<{ title: string; value: number }>;
  hourData = this.getRangeData(24);
  minute = 0;
  hour = 0;

  constructor() {
    super();
    this.prepareMinuteData();
  }


  prepareMinuteData() {
    this.minuteData = this.getRangeData(60).filter(x => !(x.value % this._minuteGap));
  }

  private getRangeData(value: number) {
    return range(0, value).map(x => {
      return { title: (x < 10 ? '0' : '') + x, value: x };
    });
  }

  onChangeHour(value: number) {
    this.defaultTime.setHours(value);
    this.onChangeValue(this.defaultTime);
  }

  onChangeMinute(value: number) {
    this.defaultTime.setMinutes(value);
    this.onChangeValue(this.defaultTime);
  }

  override onChangeValue(value: Date) {
    if (this.isString) {
      super.onChangeValue(dayjs(value).format('HH:mm:ss') as any);

      return;
    }

    super.onChangeValue(value);
  }

  protected override setNewValue(value: Date): void {
    if (isString(value)) {
      value = dayjs(value, 'HH:mm:ss').toDate();
    }

    super.setNewValue(value);
    if (!this.hasValue) {
      this.hour = 0;
      this.minute = 0;
      return;
    }

    this.hour = value.getHours();
    this.minute = value.getMinutes();
    if ((this.minute % this._minuteGap) > 0) {
      this.minuteData.unshift({ title: (this.minute < 10 ? '0' : '') + this.minute, value: this.minute })
    }

  }
}
