import { Component, forwardRef, Inject, Input, isDevMode, OnInit } from '@angular/core';
import { AbstractControl, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs from 'dayjs';
import { isEqual, isString } from 'lodash-es';

/**
 * @ignore
 */
@Component({
  selector: 'tp-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerComponent), multi: true }
  ],
})
export class DateRangePickerComponent extends BaseCustomInput<[Date, Date]> implements OnInit {
  private _startCtrl = new FormControl();
  @Input() get startCtrl(): FormControl {
    return this._startCtrl;
  }
  set startCtrl(value: FormControl | AbstractControl) {
    this._startCtrl = value as FormControl || this._startCtrl;
  }
  private _endCtrl = new FormControl();
  @Input() get endCtrl(): FormControl {
    return this._endCtrl;
  }
  set endCtrl(value: FormControl | AbstractControl) {
    this._endCtrl = value as FormControl || this._endCtrl;
  }
  private _format = this.datePickerConfig?.format?.replace(/D/g, 'd') || 'yyyy/MM/dd';
  private _min2: Date;
  private _max2: Date;
  @Input() get format(): string {
    return this._format;
  }
  set format(value: string) {
    value.replace(/D/g, 'd');
    this._format = value;
  }
  private _originalMin: Date;
  private _min: Date;
  @Input() get min(): Date {
    return this._min2;
  }
  set min(value: Date) {
    this._originalMin = value;
    this._min = this.normalizeValue(value);
    this._min2 = DateHelper.DateToMinTime(this._min);
  }
  private _activeView: 'month' | 'year' | 'decade' | 'century' = 'month';
  @Input() get activeView(): 'month' | 'year' | 'decade' | 'century' {
    return this._activeView;
  }
  set activeView(value: 'month' | 'year' | 'decade' | 'century') {
    this._activeView = value || 'month';
  }
  @Input() popupSettings: any;
  private _openOnFocus = this.datePickerConfig?.openOnFocus || false;
  @Input() get openOnFocus(): boolean {
    return this._openOnFocus;
  }
  set openOnFocus(value: boolean) {
    this._openOnFocus = value;
  }
  private _navigation = this.datePickerConfig?.navigation !== false;
  @Input() get navigation(): boolean { return this._navigation; }
  set navigation(value: boolean) {
    this._navigation = value;
  }
  userTimeZoneId: string;
  private _originalMax: Date;
  private _max: Date;
  @Input() get max(): Date {
    return this._max2;
  }
  set max(value: Date) {
    this._originalMax = value;
    this._max = this.normalizeValue(value);
    this._max2 = DateHelper.DateToMaxTime(this._max);
  }
  private _displayValueInUTCTimeZone: boolean;
  @Input() get displayValueInUTCTimeZone(): boolean {
    return this._displayValueInUTCTimeZone;
  }
  set displayValueInUTCTimeZone(value: boolean) {
    if (value === undefined) {
      return;
    }
    this._displayValueInUTCTimeZone = value;
    if (value) {
      this.prepareTimezoneId('UTC');

      return;
    }

    this.prepareTimezoneId();
  }

  constructor(
    vm: AbstractViewManager,
    @Inject(DATEPICKER_CONFIG) private datePickerConfig: IDatePickerConfig
  ) {
    super(vm);
    this.prepareTimezoneId();
  }

  ngOnInit() {
    this.setListener();
  }

  private prepareTimezoneId(timezone?: string) {
    this.userTimeZoneId = timezone || this.vm.stateService.state.userTimeZoneId;
  }
  normalizeValue(value: Date): Date {
    return DateHelper.ParseAsUtcAndConvertToLocal(value, this.userTimeZoneId);
  }

  protected setListener(): void {
    [this.startCtrl, this.endCtrl].forEach((ctrl, ind) => {
      this.setSubs = ctrl.valueChanges.subscribe((value: Date) => {
        if (!this.value?.length) {
          this._value = [null, null];
        }

        if (!value) {
          this._value[ind] = null;
          this.updateValueAndValidity();

          return;
        }
        if (this.userTimeZoneId === 'UTC') {
          const dt = dayjs(value).format('YYYY-MM-DD') + 'T' + dayjs(DateHelper.TimeDefaultValue(!!ind)).format('HH:mm:ss') + 'Z';
          // todo remove toEnNumber()
          this._value[ind] = new Date(dt.toEnNumber());
        } else {
          value = this.getDateWithTimeValue(value, DateHelper.TimeDefaultValue(false));
          this._value[ind] = DateHelper.ParseAsLocalAndConvertToUTC(value, this.userTimeZoneId);
        }
        this.updateValueAndValidity();
      })
    })
  }

  private getDateWithTimeValue(value: Date, timeValue: Date): Date {
    if (!value) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return dayjs({
      year: value.getFullYear(), month: value.getMonth(), date: value.getDate(),
      hours: timeValue.getHours(), minutes: timeValue.getMinutes(), seconds: timeValue.getSeconds(), milliseconds: timeValue.getMilliseconds()
    } as any).toDate();
  }

  setNewValue(value: [Date, Date]): void {
    if (isEqual(value, this.value)) { return; }

    if (!value) {
      this._value = [null, null];
      super.setNewValue(value);

      return;
    }

    if (!isString(value?.[0])) {
      this._value = value;
      this.prepareInputValues();

      return;
    }

    value.forEach((x, i) => {
      if ((x as any as string).startsWith('9999-12-31')) {
        value[i] = null;
      } else {
        value[i] = new Date(x)
      }
    });

    this._value = value;
    this.prepareInputValues();
  }


  private prepareInputValues(): void {
    this._value.forEach((inputValue, i) => {
      this._value[i] = this.normalizeValue(inputValue);
      if (inputValue && (!inputValue?.getTime || isNaN(inputValue.getTime()))) {
        inputValue = null;
        if (isDevMode()) {
          debugger
        }
      }
    });
  }

  handleFocus(): void {

  }

  onFocus() {

  }

  handleBlur(): void {

  }

  disabledDates = (date: Date): boolean => {
    if (!date) return false;
    if (this.min && date.isBefore(this.min)) {
      return true;
    }
    if (this.max && date.isAfter(this.max)) {
      return true;
    }

    return false;
  }

  override setDisabledState(isDisabled: boolean) {
    super.setDisabledState(isDisabled);
    if (this.disabled) {
      this._startCtrl.disable();
      this._endCtrl.disable();
    } else {
      this._startCtrl.enable();
      this._endCtrl.enable();
    }
  }
}

