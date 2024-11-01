import { DebugElement } from '@angular/core';
import { DatePickerComponent as KendoDatePickerComponent, TimePickerComponent } from '@progress/kendo-angular-dateinputs';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { AbstractStateService } from '@tiba/core';
import { BaseCustomInputPage, ServiceMockHelper } from '@tiba/core-test';
import { DatePickerComponent } from './date-picker.component';


export class DatePickerComponentPage extends BaseCustomInputPage<DatePickerComponent>{

  get overrideProviders() {
    return [{
      token: AbstractStateService, provider: {
        useValue: ServiceMockHelper.makeStateServiceStub({
          userTimeZoneId: 'Atlantic/Cape_Verde'
        })
      }
    }];
  }
  constructor() {
    super(DatePickerComponent);

    this.with_timezone('Atlantic/Cape_Verde');
    spyOn(this.component, 'changeInputValue');
    // TestBed.overrideProvider(AbstractStateService, {
    //   useValue: ServiceMockHelper.stateServiceStub
    // })
  }

  get kendoDatePicker(): KendoDatePickerComponent {
    return this.selectComponentInstance('[item-id=datePicker]')
  }
  get datePickerDe(): DebugElement {
    return this.selectDebugElement('[item-id=datePicker]')
  }

  get timeZoneSelector(): DropDownListComponent {
    return this.selectComponentInstance('[item-id=timeZoneSelector]')
  }
  get timePicker(): TimePickerComponent {
    return this.selectComponentInstance('[item-id=timePicker]');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  with_timezone(value: string) {
    // const stateService: AbstractStateService = TestBed.inject(AbstractStateService);
    // stateService.setState({ userTimeZoneId: 'Atlantic/Cape_Verde' });
    // const stateService: AbstractStateService = this.getInjector(AbstractStateService);
    // spyOnProperty(stateService.state, 'userTimeZoneId', 'get').and.returnValue(value);
    return this;
  }
}
