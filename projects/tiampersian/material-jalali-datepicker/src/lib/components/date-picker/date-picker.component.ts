import { EventEmitter, Output } from '@angular/core';
import { Component, ElementRef, forwardRef, HostListener, Inject, Input, isDevMode, ViewChild } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import dayjs, { Dayjs } from 'dayjs';
import { isEqual, isString } from 'lodash-es';
import { BaseInputComponent } from '../base-input.component';
import { DATEPICKER_CONFIG } from '../../utils/keys';
import { MaterialJalaliDateAdapter } from '../../services/material-jalali-date-adapter';
import { IDatePickerConfig } from '../../models/date-picker-config.model';
import { DateHelper } from '../../utils/date.helper';
import { Subject } from 'rxjs';

/**
 * @ignore
 */
@Component({
  selector: 'tp-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DatePickerComponent), multi: true },
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true },
    { provide: MatFormFieldControl, useExisting: forwardRef(() => DatePickerComponent), multi: true }
  ],
})
export class DatePickerComponent extends BaseInputComponent<Date> {
  datepickerConfig: IDatePickerConfig = {} as any;
  @Output() stateChanges = new Subject();
  //#region props
  calendarTypes = {
    'gregory': $localize`:@@jalali:Jalali`,
    'jalali': $localize`:@@gregorian:Gregorian`,
  };
  isRenderComplete: boolean;
  inputValueAsDayjs: dayjs.Dayjs;
  private _inputValue: Date;
  lastPosition: number;
  fullFormat: string;
  prevValue: number;
  prevSelectionEnd: number;
  get inputValue(): Date {
    return this._inputValue;
  }
  set inputValue(value: Date) {
    if (isEqual(this._inputValue, value)) return;

    this._inputValue = value;
    this.inputValueAsDayjs = value ? dayjs(value) : null;
    this.updateOutputValue(value);
  }
  // inputValue: Date;
  timeValue: Date;
  userTimeZoneId: string;
  private _useMaxTimeValue = this.datepickerConfig?.useMaxTimeValue;

  @Input() get useMaxTimeValue() {
    return this._useMaxTimeValue;
  }
  set useMaxTimeValue(value) {
    if (!!this._useMaxTimeValue === value) { return; }

    this._useMaxTimeValue = value;
    this.timeValue = this.getTimeDefaultValue();
  }
  @Input() hideTimepicker = this.datepickerConfig?.hideTimepicker;
  private _timeFormat = this.datepickerConfig?.timeFormat || 'HH:mm:ss';
  @Input() get timeFormat() {
    return this._timeFormat;
  }
  set timeFormat(value) {
    this._timeFormat = value;
    this.prepareFullFormat();
  }
  private _activeView: 'month' | 'year' | 'decade' | 'century' = 'month';
  @Input() get activeView(): 'month' | 'year' | 'decade' | 'century' {
    return this._activeView;
  }
  set activeView(value: 'month' | 'year' | 'decade' | 'century') {
    this._activeView = value || 'month';
  }
  private _datePickerEl: MatDatepicker<any>;
  @ViewChild(MatDatepicker) get datePickerEl(): MatDatepicker<any> {
    return this._datePickerEl;
  }
  set datePickerEl(value: MatDatepicker<any>) {
    this._datePickerEl = value;
  }
  timeMinValue: Date;
  timeMaxValue: Date;
  outputValue = '';
  private _min2: Date;
  private _max2: Date;
  private _format = 'YYYY/MM/DD';
  @Input() get format(): string {
    return this._format;
  }
  set format(value: string) {
    this._format = value.replace(/d/g, 'D').replace(/y/g, 'Y');
    this.prepareFullFormat();
  }
  private _originalMin: Date;
  private _min: Date;
  @Input() get min(): Date {
    return this._min2;
  }
  set min(value: Date) {
    this._originalMin = value;
    this._min = this.normalizeValue(value);
    // TODO
    // this._min2 = DateHelper.DateToMinTime(this._min);
    this.prepareTimeMinValue();
  }
  private _originalMax: Date;
  private _max: Date;
  @Input() get max(): Date {
    return this._max2;
  }
  set max(value: Date) {
    this._originalMax = value;
    this._max = this.normalizeValue(value);
    // TODO
    // this._max2 = DateHelper.DateToMaxTime(this._max);
    this.prepareTimeMaxValue();
  }
  private _navigation = this.datepickerConfig?.navigation !== false;
  @Input() get navigation(): boolean { return this._navigation; }
  set navigation(value: boolean) {
    this._navigation = value;
  }
  @Input() filterDelay = 0;
  @Input() popupSettings: any;
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

  // private _months = this.datepickerConfig?.months || 1;
  // @Input()
  // get months(): void {
  //   return this._months;
  // }
  // set months(value) {
  //   this._months = value;
  // }
  private _openOnFocus = this.datepickerConfig?.openOnFocus || false;
  @Input() get openOnFocus(): boolean {
    return this._openOnFocus;
  }
  set openOnFocus(value: boolean) {
    this._openOnFocus = value;
  }
  @ViewChild(MatFormFieldControl) control: MatFormFieldControl<any>;
  //#endregion

  //#region ctor
  constructor(
    @Inject(DateAdapter) public dateAdaptor: MaterialJalaliDateAdapter,
    @Inject(DATEPICKER_CONFIG) datepickerConfig: IDatePickerConfig
  ) {
    super();

    this.prepareTimezoneId();
    this.timeValue = this.getTimeDefaultValue();
    this.format = this.datepickerConfig?.format || 'YYYY/MM/DD';
  }
  //#endregion

  //#region default methods

  toggleCalendarType() {
    const calendar = this.datePickerEl['_componentRef'].instance._calendar as MatCalendar<any>;
    const selected = calendar.selected?.toDate();
    this.dateAdaptor.toggleCalendarType();
    // this.datePickerEl['_calendar'].selected=(this.datePickerEl.datepicker._componentRef.instance._model.selection.add(4,'days').toDate())
    calendar._goToDateInView(this.dateAdaptor.dayJs(selected), calendar.currentView);
    calendar.selected = this.dateAdaptor.dayJs(selected);
    calendar['_getCurrentViewComponent']()._init();
  }

  @HostListener('click', ['$event']) onClick1(event?: Event): void {
    event?.stopPropagation();
  }

  private prepareTimezoneId(timezone?: string) {
    this.userTimeZoneId = timezone;
  }

  changeInputValue(value: Dayjs | Date): void {

    value = dayjs.isDayjs(value) ? value?.toDate() : value;

    if (!value) {
      this._value = null;
      this.updateValueAndValidity();
      this.setTimeValues();

      return;
    }
    if (this.userTimeZoneId === 'UTC') {
      const dt = dayjs(value).format('YYYY-MM-DD') + 'T' + dayjs(this.timeValue).format('HH:mm:ss') + 'Z';
      // todo remove toEnNumber()
      this._value = new Date(dt.toEnNumber());
    } else {
      value = this.getDateWithTimeValue(value);
      this._value = DateHelper.ParseAsLocalAndConvertToUTC(value, this.userTimeZoneId);
    }
    this.updateValueAndValidity();
    this.setTimeValues();
  }

  updateValueAndValidity(): void {
    super.updateValueAndValidity();
    this.valueChange.emit(this._value);
    this.inputValue = this._value;
  }

  setNewValue(value: Date): void {
    if (isEqual(value, this.value)) { return; }

    debugger
    if (!value) {
      this._value = null;
      this.timeValue = this.getTimeDefaultValue();
      this.inputValue = null;
      this.inputValueAsDayjs = null;
      super.setNewValue(value);

      return;
    }

    if (!isString(value)) {
      this._value = value;
      this.prepareInputValues();

      return;
    }

    if (value.startsWith('9999-12-31')) {
      this.timeValue = this.getTimeDefaultValue();
      this._value = null;
      this.inputValue = null;
      this.inputValueAsDayjs = null;
      super.setNewValue(null);

      return;
    }

    this._value = new Date(value);
    this.prepareInputValues();
  }

  private prepareInputValues(): void {
    this.inputValue = this.normalizeValue(this._value);
    if (this.inputValue && (!this.inputValue?.getTime || isNaN(this.inputValue.getTime()))) {
      this.inputValue = null;
      if (isDevMode()) {
        // eslint-disable-next-line no-debugger
        debugger
      }
    }
    this.min = this._originalMin;
    this.max = this._originalMax;
    // TODO
    // this.timeValue = this.normalizeTimeValue(DateHelper.ParseAsUtcAndConvertToLocalTime(this._value, this.userTimeZoneId)) || this.getTimeDefaultValue();
    this.setTimeValues();
  }

  private setTimeValues(): void {
    this.prepareTimeMinValue();
    this.prepareTimeMaxValue();
  }

  private prepareTimeMinValue(): void {
    this.timeMinValue = null;
    if (!this._min) {
      return;
    }
    if (!this.inputValue) {
      return;
    }
    if (!dayjs(this.inputValue).isSame(this._min, 'day')) {
      return;
    }
    this.timeMinValue = this.normalizeTimeValue(this._min);
  }

  private prepareTimeMaxValue(): void {
    this.timeMaxValue = null;
    if (!this._max) {
      return;
    }
    if (!this.inputValue) {
      return;
    }
    if (!dayjs(this.inputValue).isSame(this._max, 'day')) {
      return;
    }
    this.timeMaxValue = this.normalizeTimeValue(this._max);
  }

  private normalizeTimeValue(value: Date): Date {
    if (!value) { return null; }

    if (this.userTimeZoneId === 'UTC') {
      return new Date(
        this.timeValue.getFullYear(), this.timeValue.getMonth(), this.timeValue.getDate(),
        value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds()
      );
    }

    return new Date(
      this.timeValue.getFullYear(), this.timeValue.getMonth(), this.timeValue.getDate(),
      value.getHours(), value.getMinutes(), value.getSeconds()
    );
  }

  private getDateWithTimeValue(value: Date): Date {
    if (!value) {
      return null;
    }

    // if (this.displayValueInUTCTimeZone) {
    //   return dayjs({
    //     year: value.getUTCFullYear(), month: value.getUTCMonth(), date: value.getUTCDate(),
    //     hours: this.timeValue.getUTCHours(), minutes: this.timeValue.getUTCMinutes(), seconds: this.timeValue.getUTCSeconds()
    //   }).toDate();
    // }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return dayjs({
      year: value.getFullYear(), month: value.getMonth(), date: value.getDate(),
      hours: this.timeValue.getHours(), minutes: this.timeValue.getMinutes(), seconds: this.timeValue.getSeconds(), milliseconds: this.timeValue.getMilliseconds()
    } as any).toDate();
  }

  normalizeValue(value: Date): Date {
    return DateHelper.ParseAsUtcAndConvertToLocal(value, this.userTimeZoneId);
  }

  getTimeDefaultValue(): Date {
    return DateHelper.TimeDefaultValue(this.useMaxTimeValue);
  }

  changeTimeValue(value: Date): void {
    if (!value) {
      value = this.getTimeDefaultValue();
    }

    this.timeValue = value;
    if (!this.inputValue) { return; }
    this.changeInputValue(dayjs(this.inputValue));
  }

  handleFocus(): void {
    console.log('handleFocus');
    // this.onInputClick();
    setTimeout(() => {
      this._datePickerEl.open();

      if (this.openOnFocus && !this._datePickerEl.opened) {
        this._datePickerEl.open();
      }
    }, 100);
  }

  onFocus() {
    setTimeout(() => {
      if (this.openOnFocus && !this._datePickerEl.opened) {
        this._datePickerEl.open();
      }
    }, 100);
  }

  handleBlur(): void {
    this.datePickerEl.close();
    setTimeout(() => {
      if (this.openOnFocus && !this.datePickerEl.opened) {
        this.datePickerEl.close();
      }
    }, 200);
  }
  // TODO
  now = new Date();
  Today = new Date();

  goToNow() {
    this.onChangeValue(this.now);
    this.timeValue = (this.now);
    this._datePickerEl['_componentRef'].instance._calendar.activeDate = dayjs(this.now);
    (this._datePickerEl['_componentRef'].instance._calendar as MatCalendar<any>)._dateSelected({ value: dayjs(this.now).locale('fa'), event: {} as any })
    // this._datePickerEl['_componentRef'].instance._calendar._getCurrentViewComponent()._dateSelected({ value: moment(this.now).locale('fa').get('date') })
  }

  private getDayjsValue(value?: string | Date): dayjs.Dayjs {
    if (((value || this.currentValue) instanceof Date))
      return dayjs(value || this.currentValue).calendar(this.dateAdaptor.calendarType).locale(this.dateAdaptor['locale'] as string);

    return dayjs(value || this.currentValue, this.format).calendar(this.dateAdaptor.calendarType).locale(this.dateAdaptor['locale'] as string);
  }
  //#endregion

  inputEl: HTMLInputElement;
  @ViewChild('inputEl') set inputElChild(value: ElementRef<HTMLInputElement>) {
    this.inputEl = value?.nativeElement;
  }
  get currentPosition() {
    return this.inputEl.selectionStart;
  }

  @HostListener('focusin')
  @HostListener('click')
  onInputClick(e?: Event): void {
    console.log('clicked', this.currentPosition);
    if (!this.value) {
      this.outputValue = this.fullFormat;
    }
    this.timer = setTimeout(() => {
      this.selectCurrentPosition(e);
    });
  }

  onInputBlur(e: FocusEvent) {
    if (!this.value) {
      this.outputValue = '';
    }
    // this.clearTimers();
    // if (this._scope?.['inputFieldWrapper'])
    //   this._scope['inputFieldWrapper'].focused = false
  }

  private findCurrentPosition() {
    let startIndex = 0;
    let endIndex = this.currentValue.length;

    this.currentValue.split('').every((v, i) => {
      if (!this.splitterRegex.test(v)) return true;
      if (i < this.currentPosition) {
        startIndex = i + 1;
        return true;
      }

      endIndex = i;
      return false;
    });

    return { startIndex, endIndex };
  }

  private selectCurrentPosition(e?: Event) {
    const { startIndex, endIndex } = this.findCurrentPosition();
    if (e && this.inputEl.selectionStart === startIndex && this.inputEl.selectionEnd === endIndex) {
      this.stopEvents(e);
    }

    setTimeout(() => {
      this.inputEl.selectionStart = startIndex;
      this.inputEl.selectionEnd = endIndex;
      this.inputEl.focus();
      console.log('selectionStart', this.inputEl.selectionStart, 'selectionEnd', this.inputEl.selectionEnd, 'currentPosition', this.currentPosition, 'inputPosDic')
    });
  }

  private isArrowEvent(e: KeyboardEvent) {
    return e.key.toLowerCase().startsWith('arrow') || !!{ home: true, end: true }[e.key.toLowerCase()];
  }

  private isNumericEvent(e: KeyboardEvent) {
    return (+e.key >= 0 || +e.key <= 9);
  }

  get selectionStart() {
    return this.inputEl?.selectionStart;
  }
  get selectionEnd() {
    return this.inputEl?.selectionEnd;
  }
  get currentValue(): string {
    return this.inputEl?.value;
  }
  splitterRegex = new RegExp('[^a-zA-Z0-9]');
  counter = 0;

  private updateValueByKey(value: string) {
    const format = this.fullFormat.replace('MMMM', 'MM').replace('MMM', 'MM');
    const dayjsValue = (this.getDayjsValue(this.value || this.Today) as any).tz(this.userTimeZoneId);
    const remover = this.getRemover(dayjsValue);
    const selectionStart = this.selectionStart - remover;
    let selectionEnd = this.selectionEnd - remover;
    let autoMoveNext = true;
    const outputValue = dayjsValue.calendar(this.dateAdaptor.calendarType).format(format);
    debugger
    const maxValue = this.getMaxValueOfPart(format, selectionStart, selectionEnd);
    const maxLength = ('' + maxValue).length;
    if (maxLength === 1 && isDevMode()) {
      // eslint-disable-next-line no-debugger
      debugger
    }
    selectionEnd = outputValue.slice(selectionStart).search(this.splitterRegex) + selectionStart;
    if (selectionEnd <= selectionStart) {
      selectionEnd = outputValue.length;
    }
    let result = outputValue.slice(selectionStart, selectionEnd);

    ({ value, autoMoveNext } = this.handleArrowKeys(value, autoMoveNext, result, maxLength));

    if (this.lastPosition !== selectionStart) {
      result = value.padStart(maxLength, '0');
      this.counter = 1;
    } else {
      const prevValue = result;// (('' + +result).length >= maxLength) ? '' : result;
      let newValue = +(prevValue.slice(1) + value) > maxValue ? value : (prevValue.slice(1) + value);
      if (this.prevSelectionEnd === selectionEnd && this.prevValue === 0) {
        newValue = (this.prevValue + value);
      }
      result = newValue.slice(newValue.length - maxLength).padStart(maxLength, '0');
      this.counter++;
    }
    this.prevValue = +result;
    this.prevSelectionEnd = selectionEnd;
    this.lastPosition = selectionStart;

    this.saveCurrentPosition();
    if (autoMoveNext && (this.counter >= maxLength || +(value + '0') > maxValue)) {
      setTimeout(() => {
        this.moveNextStep();
      });
    }
    const newValue = outputValue.slice(0, selectionStart) + result + outputValue.slice(selectionEnd);
    // const dt = DateHelper.ParseAsLocalAndConvertToUTC(newValue, this.userTimeZoneId);
    const dt = DateHelper.ParseAsLocalAndConvertByLocale(newValue, format, this.userTimeZoneId, this.dateAdaptor.calendarType);
    console.log('new value on update value by key => ', outputValue, ' => ', result);
    console.log('newValue => ', newValue, ' => ', dt.toDate());
    if (!dt.isValid() && isDevMode()) {
      debugger
    }
    return dt.toDate();
  }

  private handleArrowKeys(value: string, autoMoveNext: boolean, result: string, maxLength: number) {
    if (value.startsWith('+')) {
      autoMoveNext = false;
      value = ('' + (+result + 1)).padStart(maxLength, '0');
    } else if (value.startsWith('-')) {
      autoMoveNext = false;
      value = ('' + (+result - 1)).padStart(maxLength, '0');
    }
    return { value, autoMoveNext };
  }

  private getRemover(dayjsValue: dayjs.Dayjs) {

    if (this.fullFormat.search('MMM') === -1) {
      return 0;
    }

    const monthFormat = this.fullFormat.search('MMMM') > -1 ? 'MMMM' : 'MMM';

    if (this.selectionStart > dayjsValue.format(this.fullFormat.split('M')[0] + 'M').length - 1)
      return dayjsValue.format(monthFormat).length - 2;

    return 0;
  }

  private getMaxValueOfPart(format: string, selectionStart: number, selectionEnd: number) {
    const part = format.slice(selectionStart, selectionEnd);

    if (part.startsWith('Y')) {
      return 9999;
    }
    if (part.startsWith('M')) {
      return 12;
    }
    if (part.startsWith('D')) {
      return 31;
    }

    if (part.toLowerCase().startsWith('h')) {
      return 24;
    }
    if (part.startsWith('m')) {
      return 60;
    }

    if (part.toLowerCase().startsWith('s')) {
      return 60;
    }

    return 0;
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.altKey || e.shiftKey || e.ctrlKey || e.key === 'Tab' || e.key.startsWith('F')) {
      return;
    }

    let key = e.key;
    if (this.isArrowEvent(e)) {
      this.applyArrowEvent(e);
      return;
    }

    this.stopEvents(e);


    if (key === 'Backspace' || key === 'Delete') {
      key = this.handleDeleteKey(key);

    } else if (!this.isNumericEvent(e)) {
      return;
    }

    if (!key) return;

    this.updateValue(key);
  }

  private handleDeleteKey(key: string) {
    if (!this.selectionStart && this.selectionEnd === this.outputValue.length) {
      this.clear();
      return null;
    }
    key = '0';
    this.lastPosition = null;
    this.counter = 0;
    return key;
  }

  private updateValue(key: string) {
    const newValue = this.updateValueByKey(key);

    if (newValue.getFullYear() < 620) {
      console.log(this.currentValue, 'is less than 620');
      this._value = newValue;
      this.inputValue = newValue;
      return;
    }

    this.onChangeValue(newValue);
  }

  private saveCurrentPosition() {
    const selectionStart = this.selectionStart;
    setTimeout(() => {
      this.inputEl.selectionStart = selectionStart;
      this.selectCurrentPosition();
    });
  }

  private isActionKey(e: KeyboardEvent): boolean {
    return e.key.length > 1 && !e.key.startsWith('Arrow') && !e.key.startsWith('Delete') && !e.key.startsWith('Backspace');
  }

  private applyArrowEvent(e: KeyboardEvent) {
    const key = e.key;

    this.stopEvents(e);

    if (key === 'Home') {
      this.inputEl.selectionStart = 0;
      this.selectCurrentPosition();
      return;
    }

    if (key === 'End') {
      this.inputEl.selectionStart = this.outputValue.length;
      this.selectCurrentPosition();
      return;
    }

    if (key === 'ArrowLeft') {
      this.movePrevStep();

      return;
    }
    if (key === 'ArrowRight') {
      this.moveNextStep();
      return;
    }

    if (key === 'ArrowUp') {
      this.updateValue('+1')
      return;
    }

    this.updateValue('-1')
  }

  private moveNextStep() {
    const { endIndex } = this.findCurrentPosition();
    if (endIndex === this.currentValue.length) return;
    this.inputEl.selectionStart = endIndex + 2;
    this.counter = 0;
    this.selectCurrentPosition();
  }

  private movePrevStep() {
    const { startIndex } = this.findCurrentPosition();
    if (startIndex === 0) return;
    this.counter = 0;
    this.inputEl.selectionStart = startIndex - 2;
    this.selectCurrentPosition();
  }


  private prepareFullFormat() {
    this.fullFormat = this._format + ' ' + this.timeFormat;
  }

  private updateOutputValue(value: Date) {
    this.outputValue = !value ? '' : this.getDayjsValue(
      DateHelper.ParseAsUtcAndConvertToLocal(this._inputValue, this.userTimeZoneId)
    ).format(this.fullFormat);
    console.log('outputValue => ', this.outputValue);
  }

  // protected onSetScope(): void {
  //   super.onSetScope();
  //   // this._scope.onClick.bind(this, this.onInputClick as any);
  // }
  setDescribedByIds() {
  }
  onContainerClick() {
  }
}
