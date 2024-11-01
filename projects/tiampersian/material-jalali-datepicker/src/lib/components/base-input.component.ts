import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { isArray, isBoolean, isDate, isEmpty, isEqual, isNil, isNumber, noop } from "lodash-es";
import { Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Directive()
export class BaseInputComponent<T = any> implements ControlValueAccessor {

  private onChange = noop;
  private onTouch = noop;
  protected defaultValue: T = null;
  @Input() translateLabel: boolean = true;
  @Input() translatePlaceholder: boolean = true;
  @Input() showPlaceholder: boolean = true;
  @Input() loading = false;
  protected _multiple = false;
  isInitialized: boolean;
  @Output() focus = new EventEmitter<FocusEvent>();
  subs: Array<Subscription> = [];
  _timer: any = null;
  busySubs: Array<Subscription> = [];
  @Input() get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = value;
  }
  private _sub: Subscription;
  get sub(): Subscription {
    return this._sub;
  }
  set sub(value: Subscription) {
    if (this.sub?.closed === false) {
      this._sub.unsubscribe();
    }
    this._sub = value;
    this.setSubs = value;
  }
  set setSubs(value: Subscription) {
    this.subs.push(value);
  }
  set setBusy(value: Subscription) {
    this.busySubs.push(value);
  }
  get timer() { return this._timer; }
  set timer(value: any) {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = value;
  }
  protected _value: T = null;
  @Input() get value(): T { return this._value; }
  set value(value: T) {
    if (this.isEqual(value)) { return; }
    setTimeout(() => {
      this.setNewValue(value);
    });
  }
  private _label: string = '';
  @Input() get label(): string {
    return this._label;
  }
  set label(value: string) {
    this._label = value;
    this.prepareLabel();
    this.preparePlaceholder();
  }
  hasValue = false;
  $change: Subject<boolean>;
  @Output() valueChange = new EventEmitter();
  private _isDisabled = false;
  @HostBinding('class.tp-disabled')
  @Input() get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(value) {
    this._isDisabled = value;
    this.onChangeDisabled();
  }
  @Input() optional = true;
  protected _debounceTime = 0;
  @Input() get debounceTime() {
    return this._debounceTime;
  }
  set debounceTime(value) {
    this._debounceTime = value;
    this.setValueListener();
  }
  private _placeholder: string = null;
  private _initializedPlaceholder: string = null;
  @Input() get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    if (!this._initializedPlaceholder)
      this._initializedPlaceholder = value;
    this._placeholder = value;
  }

  @Input() @HostBinding('class.is-readonly') readonly = false;
  @HostListener('focusin', ['$event'])
  onClick($event: FocusEvent) {
    this.focus.emit($event);
    this.onTouch();

    this.afterClick();
  }

  protected afterClick() {
  }

  constructor() {

    this.setValueListener();
  }

  protected setValueListener() {
    this.$change = new Subject();
    this.$change.pipe(debounceTime(this.debounceTime)).subscribe(x => {
      this.onChange(this.mapValue());
      this.valueChange.emit(this.mapValue());
    });
  }

  resetToDefault() {
    this.onChangeValue(this.defaultValue);
  }

  onChangeValue(value: T) {
    this._value = value;
    this.updateValueAndValidity();
  }

  updateValueAndValidity() {
    this.onTouch();
    this.$change.next(true);
    this.setHasValue();
  }

  protected mapValue(): any {
    return this.value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: T): void {
    if (this.isEqual(value)) {
      return;
    }
    this.setNewValue(value);
  }

  protected setNewValue(value: T) {
    this._value = value;
    this.setHasValue();
    this.isInitialized = true;
  }

  protected isEqual(value: T) {
    return isEqual(value, this._value);
  }

  protected onChangeDisabled() {
  }

  protected setHasValue() {
    this.hasValue = !this.isEmpty(this.value);
  }

  protected isEmpty(value: any) {
    if (isNil(value)) {
      return true;
    }

    return !(isDate(value) ? true : isNumber(value) ? true : isArray(value) ? !!value.length : isBoolean(value) ? true : !isEmpty(value));
  }

  protected prepareLabel(): void {
    if (this._label && this._label.length > 0)
      return;
    this.translateLabel = false;
    this._label = null;
  }

  protected preparePlaceholder(): void {
    if (!this.showPlaceholder) {
      this.translatePlaceholder = false;
      this.placeholder = null;
      return;
    }
    if (this._initializedPlaceholder)
      return;

    this.placeholder = this.label;
    this._initializedPlaceholder = null;
    this.translatePlaceholder = this.translateLabel;
  }

  // protected override onSetScope(): void {
  //   super.onSetScope();
  //   ((['label', 'placeholder', 'showPlaceholder'] as Array<keyof BaseInputComponent<any>>) as Array<any>).forEach(key => {
  //     this[key] = this._scope[key];
  //   });
  // }

  protected stopEvents(e: Event) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  clear() {
    this.onChange(this.defaultValue);
  }
}
