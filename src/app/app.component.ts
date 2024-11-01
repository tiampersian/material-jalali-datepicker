import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DatePickerType } from '@tiampersian/material-jalali-datepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
  ],

})
export class AppComponent {
  title = 'material-jalali-datepicker';
  public value: Date = new Date();
  rerender = true;
  locales = ['fa-IR', 'fa', 'en-US', 'en'];
  calendarTypes = Object.values(DatePickerType);
  calendarType = '';
  currentLocaleId = '';
  constructor(
    private cdr: ChangeDetectorRef
  ) {
    // this.calendarType = localeService.isJalali ? DatePickerType.jalali : DatePickerType.gregory;
    // this.currentLocaleId = localeService.localeId;
  }

  changeCalendarType(value: string): void {
    localStorage.setItem('locale', value);
    this.calendarType = value;
    // this.localeService.toggleType();
    // this.localeService.reload();
    // this.reload();

  }
  private reload(): void {
    // this.rerender = false;
    this.cdr.detectChanges();
    this.rerender = true;
  }

  changeLocaleId(value: any): void {
    localStorage.setItem('localeId', value);
    // this.localeService.changeLocaleId(value);
    // this.localeService.reload();
    this.currentLocaleId = value;
  }

  changeValue($event: any): void {
    this.value = $event;
  }
}

