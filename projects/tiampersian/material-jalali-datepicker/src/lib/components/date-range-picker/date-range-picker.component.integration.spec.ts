// import { CoreBrowserKendoModuleTestBedFactory } from '../../core-browser-kendo.module.spec.testbed';
// import { DateRangePickerComponentPage } from './date-range-picker.component.integration.spec.page';
// import { expectedValue } from './date-range-picker.component.spec.builder';

// describe('SUT(integration): DateRangePickerComponent', () => {
//   let sutPage: DateRangePickerComponentPage;

//   CoreBrowserKendoModuleTestBedFactory();

//   beforeEach(() => {
//     sutPage = new DateRangePickerComponentPage();
//   });

//   it(`should create properly`, () => {
//     // assert
//     expect(sutPage).toBeTruthy();
//   });

//   it(`should populate element binding with proper value`, async () => {

//     // arrange
//     await sutPage.withPayloadValue(new Date('2020-02-02T05:00:00.000Z')).detectChanges().whenStable();
//     sutPage.component.min = new Date('2020-02-02T05:00:00.000Z');
//     sutPage.component.max = new Date('2030-02-03T05:00:00.000Z');
//     await sutPage.detectChanges().whenStable();
//     sutPage.detectChanges();

//     // assert
//     expect(sutPage.kendoDateRangePicker).toHaveBeenConfiguredWith({
//       value: new Date(expectedValue('2020-02-02T05:00:00.000Z', sutPage.component.userTimeZoneId)),
//       min: sutPage.component.min,
//       max: sutPage.component.max,
//       format: sutPage.component.format,
//       navigation: sutPage.component.navigation
//     });

//     expect(sutPage.timePicker).toHaveBeenConfiguredWith({
//       value: new Date(expectedValue('2000-08-01T05:00:00.000Z', sutPage.component.userTimeZoneId)),
//       min: sutPage.component.timeMinValue,
//       format: sutPage.component.timeFormat,
//     });
//   });

//   it(`should populate element binding with proper value`, async () => {

//     // arrange
//     await sutPage.withPayloadValue(new Date('2020-02-02T05:00:00.000Z')).detectChanges().whenStable();
//     sutPage.component.min = new Date('2020-02-02T05:00:00.000Z');
//     sutPage.component.max = new Date('2030-02-03T05:00:00.000Z');
//     await sutPage.detectChanges().whenStable();
//     sutPage.detectChanges();

//     // assert
//     // const tem = sutPage.dateRangePickerDe.injector.get(NgControl)
//     // tem.control.setValue(dayjs('2030-02-03T05:00:00.000Z'))
//     // expect(sutPage.component.changeInputValue).toHaveBeenCalledWith('2030-02-03T05:00:00.000Z' as any);
//     expect(sutPage.timePicker).toHaveBeenConfiguredWith({
//       value: new Date(expectedValue('2000-08-01T05:00:00.000Z', sutPage.component.userTimeZoneId)),
//       min: sutPage.component.timeMinValue,
//       format: sutPage.component.timeFormat,
//     });
//   });

//   it(`should populate element binding with proper value`, async () => {

//     // arrange
//     await sutPage
//       .withPayloadValue(new Date('2030-02-03T05:00:00.000Z')).detectChanges().whenStable();
//     sutPage.component.max = new Date('2030-02-03T05:00:00.000Z');
//     await sutPage.detectChanges().whenStable();
//     sutPage.detectChanges();

//     // assert
//     expect(sutPage.timePicker).toHaveBeenConfiguredWith({
//       max: sutPage.component.timeMaxValue,
//     });
//   });

//   it(`should hide timepicker when hideTimepicker is truthy`, async () => {

//     // arrange
//     sutPage.component.hideTimepicker = true;
//     await sutPage.detectChanges().whenStable();

//     // assert
//     expect(sutPage.timePicker).toBeFalsy();
//   });


// });
