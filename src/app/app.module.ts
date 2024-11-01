import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import '@angular/localize/init';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialJalaliDatePickerModule } from '@tiampersian/material-jalali-datepicker';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialJalaliDatePickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    { provide: LOCALE_ID, useFactory: originalLocaleIdFactory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function originalLocaleIdFactory(originalLocalId: string): string {
  return localStorage.getItem('localeId') || 'fa-IR';
}

export function isRtl(): boolean {
  return localStorage.getItem('localeId')?.startsWith('fa');
}
