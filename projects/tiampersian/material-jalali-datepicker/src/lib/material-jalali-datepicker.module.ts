import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DATEPICKER_CONFIG } from '@tiampersian/material-jalali-datepicker';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { MAT_DAYJS_DATE_FORMATS } from './services/dayjs_formats';
import { MaterialJalaliDateAdapter } from './services/material-jalali-date-adapter';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
// import { provideNativeDateAdapter } from '@angular/material/core';

@NgModule({
    imports: [
        NgClass,
        NgFor,
        NgIf,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule
    ],
    exports: [
        DatePickerComponent,
        TimepickerComponent
    ],
    declarations: [
        DatePickerComponent,
        TimepickerComponent
    ],
    providers: [
        // provideNativeDateAdapter(),
        { provide: DateAdapter, useClass: MaterialJalaliDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATE_FORMATS },
        { provide: DATEPICKER_CONFIG, useValue: {} },
    ],
})
export class MaterialJalaliDatePickerModule { }
