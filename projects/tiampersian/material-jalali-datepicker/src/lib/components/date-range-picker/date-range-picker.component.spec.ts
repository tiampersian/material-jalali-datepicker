// import { BaseCustomInputTest } from '@tiba/core-test';
// import dayjs from 'dayjs';
// import { DateRangePickerComponent } from './date-range-picker.component';
// import { DateRangePickerComponentBuilder, expectedValue, expectedValueInTimezone } from './date-range-picker.component.spec.builder';


// describe('SUT: DateRangePickerComponent', () => {
//   let sut: DateRangePickerComponent;
//   let sutBuilder: DateRangePickerComponentBuilder;
//   const defaultTimeValue = new Date('2000/08/01 00:00:00');

//   beforeEach(() => {
//     sutBuilder = new DateRangePickerComponentBuilder();
//   });

//   it('should create properly', () => {
//     expect(sutBuilder.build()).toBeTruthy();
//   });

//   BaseCustomInputTest(() => sutBuilder);

//   it(`should set #inputValue with proper value when #value has value`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2020-02-02T05:00:00.000Z')).build();

//     // assert
//     expect(sut.inputValue.toISOString()).toBe(expectedValue('2020-02-02T05:00:00.000Z', sutBuilder.userTimezoneId));
//   });

//   it(`should set #inputValue with proper value when #value has value`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // assert
//     expect(sut.inputValue.toISOString()).toBe(expectedValue('2004-06-01T07:00:00.000Z', sutBuilder.userTimezoneId));
//   });

//   it(`should set #value when #inputValue is set`, () => {

//     // arrange
//     sut = sutBuilder.build();

//     // action
//     sut.changeInputValue(dayjs(new Date('2020-01-01T00:00:00')));

//     // assert
//     expect(sut.value.toISOString()).toBe('2020-01-01T01:00:00.000Z');
//   });

//   it(`should set #value with proper value when #payload data is string`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data('2020-02-02T05:00:00.000Z' as any as Date).build();


//     // assert
//     expect(sut.value.getTime()).toBe(new Date('2020-02-02T05:00:00.000Z').getTime());
//     expect(dayjs(sut.inputValue).format('M/D/YYYY, h:mm:ss A')).toBe('2/2/2020, 4:00:00 AM')
//   });

//   it(`should set #min with proper value when #min is set`, () => {

//     // arrange
//     sut = sutBuilder.build();
//     sut.min = new Date('2020-02-02T05:00:00.000Z');

//     // assert
//     expect(dayjs(sut.min).format('M/D/YYYY, h:mm:ss A')).toBe('2/2/2020, 12:00:00 AM')
//   });

//   it(`should set #max with proper value when #max is set`, () => {

//     // arrange
//     sut = sutBuilder.build();
//     sut.max = new Date('2020-02-02T05:00:00.000Z');

//     // assert
//     expect(dayjs(sut.max).format('M/D/YYYY, h:mm:ss A')).toBe('2/2/2020, 11:59:59 PM')
//   });

//   it(`should set #value with proper value when #payload data is empty`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data('' as any as Date).build();


//     // assert
//     expect(sut.value).toBeFalsy();
//     expect(sut.inputValue).toBeFalsy();
//   });

//   it(`should set #inputValue with proper value when #value has value`, () => {
//     // arrange
//     sut = sutBuilder.with_userTimezoneId('UTC').with_payload_data(new Date('2020-02-02T05:00:00.000Z')).build();

//     // assert
//     expect(dayjs(sut.inputValue).format('M/D/YYYY, h:mm:ss A')).toBe('2/2/2020, 5:00:00 AM')
//   });

//   it(`should set #inputValue with proper value when #value has value`, () => {
//     // arrange
//     sut = sutBuilder.with_userTimezoneId('UTC').with_payload_data(
//       new Date('2020-03-21T00:45:00.000Z')
//     ).build();

//     // assert
//     //TODO check
//     expect(dayjs(sut.inputValue).format('M/D/YYYY, h:mm:ss A')).toBe('3/21/2020, 1:45:00 AM');
//     expect(dayjs(sut.timeValue).format('M/D/YYYY, h:mm:ss A')).toBe('8/1/2000, 1:45:00 AM');
//   });

//   it(`should set #inputValue with proper value when #value has value`, () => {

//     // arrange
//     sut = sutBuilder.with_isTimeZoneUTC(true).with_payload_data(new Date('2020-02-02T05:00:00.000Z')).build();

//     // assert
//     expect(sut.userTimeZoneId).toBe('UTC')
//     expect(dayjs(sut.inputValue).format('M/D/YYYY, h:mm:ss A')).toBe('2/2/2020, 5:00:00 AM')
//   });

//   it(`should set #value when #inputValue is set`, () => {

//     // arrange
//     sut = sutBuilder.build();

//     // action
//     sut.changeInputValue(dayjs(new Date('2020-02-02T00:00:00')));

//     // assert
//     expect(sut.value.toISOString()).toBe('2020-02-02T01:00:00.000Z');
//     expect(sut.inputValue.toISOString()).toBe(expectedValueInTimezone('2020-02-02T00:00:00', sut.userTimeZoneId));
//     expect(sut.inputValue.getTime()).toBe(new Date('2/2/2020, 12:00:00 AM').getTime());
//     expect(sutBuilder.onChangeCallbackSpy).toHaveBeenCalled();
//   });

//   it(`should set #value when #inputValue is set with empty value`, () => {

//     // arrange
//     sut = sutBuilder.build();
//     sut.inputValue = '' as any;

//     // action
//     sut.changeInputValue(null);

//     // assert
//     expect(sut.value).toBeFalsy();
//     expect(sut.inputValue).toBeFalsy();
//     expect(sutBuilder.onChangeCallbackSpy).toHaveBeenCalled();
//   });

//   it(`should set #timeValue with proper value when #constructor called`, () => {
//     // arrange
//     sut = sutBuilder.build();

//     // assert
//     expect(sut.timeValue.getTime()).toBe(defaultTimeValue.getTime());
//   });

//   it(`should set timeValue with proper value when writValue called`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // assert
//     expect(sut.inputValue.toISOString()).toBe(expectedValue('2004-06-01T07:00:00.000Z', sutBuilder.userTimezoneId));
//     expect(dayjs(sut.timeValue).format('hh:mm:ss')).toBe(dayjs(expectedValue('2004-06-01T07:00:00.000Z', sutBuilder.userTimezoneId)).format('hh:mm:ss'));
//   });

//   it(`should set timeValue with proper value when changeInputValue called with null value`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // action
//     sut.changeInputValue(null)

//     // assert
//     expect(sut.timeValue.toISOString()).toBe(expectedValue('2000-08-01T07:00:00.000Z', sut.userTimeZoneId));
//     expect(sut.inputValue).toBeNull();
//   });

//   it(`should set timeValue with proper value when changeInputValue called with null value`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // action
//     sut.changeInputValue(null)

//     // assert
//     expect(sut.timeValue.toISOString()).toBe(expectedValue('2000-08-01T07:00:00.000Z', sutBuilder.userTimezoneId));
//     expect(sut.inputValue).toBeNull();
//   });

//   it(`should set timeValue with proper value when changeInputValue called`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // action
//     sut.changeTimeValue(null)

//     // assert
//     expect(sut.inputValue.toISOString()).toBe(expectedValue('2004-06-01T07:00:00.000Z', sut.userTimeZoneId))
//     expect(sut.timeValue.toISOString()).toBe(defaultTimeValue.toISOString());
//     expect(sut.value.toISOString()).toBe('2004-06-01T01:00:00.000Z')
//   });

//   it(`should set timeMinValue with proper value when set #min and value is empty`, () => {

//     // arrange
//     sut = sutBuilder.build();

//     // action
//     sut.min = new Date('2004-06-01T07:00:00.000Z');

//     // assert
//     expect(sut.inputValue).toBeFalsy();
//     expect(sut.timeMinValue).toBeFalsy();
//   });

//   it(`should set timeMinValue with proper value when set #min and value has value`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // action
//     sut.min = new Date('2004-06-01T07:00:00.000Z');

//     // assert
//     expect(sut.timeMinValue.toISOString()).toBe(expectedValue('2000-08-01T07:00:00.000Z', sut.userTimeZoneId));
//   });

//   it(`should set timeMaxValue with proper value when set #max and value has value`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // action
//     sut.max = new Date('2004-06-01T07:00:00.000Z');

//     // assert
//     expect(sut.timeMaxValue.toISOString()).toBe(expectedValue('2000-08-01T07:00:00.000Z', sut.userTimeZoneId));
//   });

//   it(`should set #value with proper value when #changeInputValue called with payload data`, () => {

//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2020-01-01T08:00:00.000Z')).build();

//     // action
//     sut.changeInputValue(dayjs(new Date('2020-01-03T00:00:00')));

//     // assert
//     expect(sut.value.toISOString()).toBe('2020-01-03T08:00:00.000Z');
//   });

//   it(`should set #value with proper value when #inputValue has value #changeTimeValue called with payload data`, () => {

//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // action
//     sut.changeTimeValue(new Date('2000-08-02T03:30:00.000Z'));

//     // assert
//     expect(sut.inputValue.toISOString()).toBe(expectedValue('2004-06-01T07:00:00.000Z', sut.userTimeZoneId));
//     expect(sut.timeValue.toISOString()).toBe('2000-08-02T03:30:00.000Z');
//   });

//   it(`should set #value with proper value when #inputValue has value #changeTimeValue called with payload data`, () => {

//     sut = sutBuilder.with_isTimeZoneUTC(true).build();
//     sut.changeInputValue(dayjs(new Date('2020 03 20')));

//     // action
//     sut.changeTimeValue(new Date('2000/08/01 00:45:00'));

//     // assert
//     expect(sut.inputValue.toISOString()).toBe(expectedValueInTimezone(new Date('2020-03-20T00:00:00'), sut.userTimeZoneId));
//     expect(sut.timeValue.toISOString()).toBe(expectedValueInTimezone('2000-08-01T00:45:00.000', sut.userTimeZoneId));
//     expect(sut.value.toISOString()).toBe('2020-03-20T00:45:00.000Z');
//   });

//   it(`should set #value with empty value when payload data is max date`, () => {
//     // arrange
//     sut = sutBuilder.with_payload_data(new Date('2004-06-01T07:00:00.000Z')).build();

//     // action
//     sut.writeValue('9999-12-31T11:59:59' as any as Date);

//     // assert
//     expect(sut.value).toBeNull();
//     expect(sut.inputValue).toBeNull();
//     expect(sut.timeValue.getTime()).toBe(defaultTimeValue.getTime());
//   });

//   it(`should set #value with max time value when #useMaxTimeValue is truthy with Iran timeZone`, () => {

//     // arrange
//     sut = sutBuilder.with_userTimezoneId('Iran').build();
//     sut.useMaxTimeValue = true;
//     sut.hideTimepicker = true;

//     // action
//     sut.changeInputValue(dayjs(new Date('2020-02-02T00:00:00')));

//     // assert
//     expect(sut.value.toISOString()).toBe('2020-02-02T20:29:59.999Z');
//   });


//   it(`should set #value with min time value when #useMaxTimeValue is falsy with Iran timeZone`, () => {

//     // arrange
//     sut = sutBuilder.with_userTimezoneId('Iran').build();
//     sut.useMaxTimeValue = false;
//     sut.hideTimepicker = true;

//     // action
//     sut.changeInputValue(dayjs(new Date('2020-02-02T00:02:02')));

//     // assert
//     expect(sut.value.toISOString()).toBe('2020-02-01T20:30:00.000Z');
//   });

//   it(`should set #value with max time value when #useMaxTimeValue is truthy`, () => {

//     // arrange
//     sut = sutBuilder.build();
//     sut.useMaxTimeValue = true;
//     sut.hideTimepicker = true;

//     // action
//     sut.changeInputValue(dayjs(new Date('2020-02-02T00:02:02')));

//     // assert
//     expect(sut.value.toISOString()).toBe('2020-02-03T00:59:59.999Z');
//   });

// });
