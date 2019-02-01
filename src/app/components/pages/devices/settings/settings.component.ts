import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import * as moment from 'moment';
import 'rxjs/add/operator/switchMap';
import {Permission} from '../../../../utils/enums/permissionEnum.model';
import {SettingItem, WeeklySettingDtoModel} from '../../../../models/dataOut/weeklysettingdto.model';
import {DeviceUpdateDto} from '../../../../models/deviceUpdateDto.model';
import {TimeZone} from '../../../../models/timezones.model';
import {DeviceService} from '../../../../services/device.service';
import {StaticData} from '../../../../utils/static-data';
import {BaseDeviceModel} from '../../../../models/baseDevice/baseDevice.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  ONE_SECOND_FOR_COUNTER = 1000;
  VALUE_FOR_CHANGE_DEVICE_DATA = 1000;
  MOBILE_SIZE_FOR_SETTINGS_WINDOW = 996;

  device: BaseDeviceModel;
  arrayOfTimeZone: TimeZone[];
  timezone: number;
  workPriority;
  mobMenu: boolean;
  isMobileSize = false;
  range: number[];
  range1: number;
  range2: number;
  range3: number;
  range4: number;
  range5: number;
  range6: number;
  range7: number;
  range8: number;
  range9: number[];
  range10: number;
  range11: number;
  range12: number[];
  range13: number;
  range14: number;
  augerWorkMode: number;
  cleaningWork: number;
  cleaningSettingsFun: number;
  range15: number;
  range16: number[];
  range17: any;
  range18: number;
  range19: number;
  range20: number;
  range21: number[];
  range22: number;
  deviceId: string;
  deviceName: string;
  deviceIp: string;
  weekleySettingsCheckBox: boolean;
  isRemoved: boolean;
  removeDate;
  intevalObj;
  day;
  hours;
  minutes;
  seconds;
  weather: any;
  count: number;
  week: any[];
  weekForSettings;
  selectedDayIndex: number;
  notPresentData = false;
  notPresentData21 = false;
  notPresentData1 = false;
  notPresentData2 = false;
  notPresentData3 = false;
  notPresentData22 = false;
  notPresentData4 = false;
  notPresentData5 = false;
  notPresentData7 = false;
  notPresentData8 = false;
  notPresentData6 = false;
  notPresentData9 = false;
  notPresentData10 = false;
  notPresentData11 = false;
  notPresentData12 = false;
  notPresentData14 = false;
  notPresentData13 = false;
  notPresentData15 = false;
  notPresentData16 = false;
  notPresentData17 = false;
  notPresentData18 = false;
  notPresentData19 = false;
  notPresentData20 = false;
  notPresentData23 = false;
  notPresentData24 = false;
  notPresentData25 = false;
  notPresentData26 = false;

  constructor(public dialogRef: MatDialogRef<SettingsComponent>,
              private service: DeviceService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.arrayOfTimeZone = StaticData.TimeZones;
    this.count = 1;
    this.device = data['device'];
    this.selectedDayIndex = 0;
    let settings;
    this.service.getWeeklySettings(this.device.id).subscribe((data1: WeeklySettingDtoModel) => {
      settings = data1.settings;
      console.log(data1.settings);

      this.week = StaticData.Week.map((dayName, dayIndex) => {
        const hoursOfDay = settings ? settings.filter((hour) => hour.dayOfWeek === dayIndex) : null;
        const enable = Boolean(hoursOfDay) && hoursOfDay.some((hour) => hour.enabled);
        console.log(hoursOfDay.some((hour) => hour.enabled))
        if (hoursOfDay && hoursOfDay.length > 0) {
          data = hoursOfDay.map((hour) => hour.targetTemperature);
        } else {
          data = new Array(StaticData.HOURS_IN_DAY);
          data.fill(StaticData.DEFAULT_TEMPERATURE);
        }
        return {
          name: dayName,
          enable,
          data
        };
      });
    });
  }

  setDay(day) {
    this.week[day].enable = !this.week[day].enable;
  }

  showChartOfDay(numberOfDay) {
    this.selectedDayIndex = numberOfDay;
  }

  showMobMenu() {
    this.mobMenu = !this.mobMenu;
  }

  ngOnInit() {
    this.setTimeZone();
    this.getWeather();
    this.deviceId = this.device.devId;
    this.deviceName = this.device.name;
    this.deviceIp = this.device.ip;

    if (this.device['data'].data.FAN_POWER_DURING_IGNITION != null && this.device['data'].data.FAN_POWER_DURING_IGNITION_MAX != null) {
      this.range = [this.device['data'].data.FAN_POWER_DURING_IGNITION, this.device['data'].data.FAN_POWER_DURING_IGNITION_MAX];
    } else {
      this.range = [0, 1];
      this.notPresentData = true;
    }

    if (this.device['data'].data.EXTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION != null) {
      this.range1 = this.device['data'].data.EXTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION;
    } else {
      this.range1 = 0;
      this.notPresentData1 = true;
    }
    if (this.device['data'].data.INTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION != null) {
      this.range2 = this.device['data'].data.INTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION;
    } else {
      this.range2 = 0;
      this.notPresentData2 = true;
    }

    if (this.device['data'].data.OPTICAL_SENSOR_TEMPERATURE_GROWING != null) {
      this.range3 = this.device['data'].data.OPTICAL_SENSOR_TEMPERATURE_GROWING;
    } else {
      this.range3 = 1;
      this.notPresentData3 = true;
    }

    if (this.device['data'].data.WORK_PRIORITY != null) {
      this.workPriority = this.device['data'].data.WORK_PRIORITY;
    } else {
      this.workPriority = 0;
      this.notPresentData24 = true;
    }

    if (this.device['data'].data.INTERNAL_AUGER_CONVEYOR_WORK_TIME) {
      this.range4 = this.device['data'].data.INTERNAL_AUGER_CONVEYOR_WORK_TIME / this.VALUE_FOR_CHANGE_DEVICE_DATA;
    } else {
      this.range4 = 1;
      this.notPresentData4 = true;
    }

    if (this.device['data'].data.EXTERNAL_AUGER_CONVEYOR_PAUSE) {
      this.range5 = this.device['data'].data.EXTERNAL_AUGER_CONVEYOR_PAUSE / this.VALUE_FOR_CHANGE_DEVICE_DATA;
    } else {
      this.range5 = 1;
      this.notPresentData5 = true;
    }

    if (this.device['data'].data.CLEANING_CYCLES_COUNT != null) {
      this.range6 = this.device['data'].data.CLEANING_CYCLES_COUNT / this.VALUE_FOR_CHANGE_DEVICE_DATA;
    } else {
      this.range6 = 1;
      this.notPresentData6 = true;
    }

    if (this.device['data'].data.EXTERNAL_AUGER_CONVEYOR_WORK_TIME != null) {
      this.range7 = this.device['data'].data.EXTERNAL_AUGER_CONVEYOR_WORK_TIME / this.VALUE_FOR_CHANGE_DEVICE_DATA;
    } else {
      this.range7 = 1;
      this.notPresentData7 = true;
    }

    if (this.device['data'].data.CLEANING_WORK_TIME != null) {
      this.range8 = this.device['data'].data.CLEANING_WORK_TIME / this.VALUE_FOR_CHANGE_DEVICE_DATA;
    } else {
      this.range8 = 1;
      this.notPresentData8 = true;
    }

    if (this.device['data'].data.MIN_FAN_WORKING_POWER != null && this.device['data'].data.MAX_FAN_WORKING_POWER != null) {
      this.range9 = [this.device['data'].data.MIN_FAN_WORKING_POWER, this.device['data'].data.MAX_FAN_WORKING_POWER];
    } else {
      this.range9 = [0, 1];
      this.notPresentData9 = true;
    }

    if (this.device['data'].data.RESERVE_FAN_START_TIMEOUT != null) {
      this.range10 = this.device['data'].data.RESERVE_FAN_START_TIMEOUT;
    } else {
      this.range10 = 1;
      this.notPresentData10 = true;
    }

    if (this.device['data'].data.RESERVE_FAN_STOP_TIMEOUT != null) {
      this.range11 = this.device['data'].data.RESERVE_FAN_STOP_TIMEOUT;
    } else {
      this.range11 = 1;
      this.notPresentData11 = true;
    }

    if (this.device['data'].data.RESERVE_FAN_MIN_POWER != null && this.device['data'].data.RESERVE_FAN_WORKING_POWER != null) {
      this.range12 = [this.device['data'].data.RESERVE_FAN_MIN_POWER, this.device['data'].data.RESERVE_FAN_WORKING_POWER];
    } else {
      this.range12 = [0, 1];
      this.notPresentData12 = true;
    }

    if (this.device['data'].data.CENTRAL_HEATING_PUMP_START_TEMPERATURE != null) {
      this.range13 = this.device['data'].data.CENTRAL_HEATING_PUMP_START_TEMPERATURE;
    } else {
      this.range13 = 1;
      this.notPresentData13 = true;
    }

    if (this.device['data'].data.CENTRAL_HEATING_PUMP_HYSTERESIS != null) {
      this.range14 = this.device['data'].data.CENTRAL_HEATING_PUMP_HYSTERESIS;
    } else {
      this.range14 = 1;
      this.notPresentData14 = true;
    }

    if (this.device['data'].data.AUGER_CONVEYOR_WORK_MODE != null) {
      this.augerWorkMode = this.device['data'].data.AUGER_CONVEYOR_WORK_MODE;
    } else {
      this.augerWorkMode = 0;
      this.notPresentData25 = true;
    }

    if (this.device['data'].data.CLEANING_SETTINGS_CLEANER != null) {
      this.device['data'].data.CLEANING_SETTINGS_CLEANER ? this.cleaningWork = 1 : this.cleaningWork = 0;
    } else {
      this.cleaningWork = 0;
      this.notPresentData23 = true;
    }

    if (this.device['data'].data.CLEANING_SETTINGS_FAN != null) {
      this.device['data'].data.CLEANING_SETTINGS_FAN ? this.cleaningSettingsFun = 1 : this.cleaningSettingsFun = 0;
    } else {
      this.cleaningSettingsFun = 0;
      this.notPresentData26 = true;
    }

    if (this.device['data'].data.DEVICE_HYSTERESIS != null) {
      this.range15 = this.device['data'].data.DEVICE_HYSTERESIS;
    } else {
      this.range15 = 1;
      this.notPresentData15 = true;
    }

    if (this.device['data'].data.MIN_AUTOMATICS_POWER != null && this.device['data'].data.MAX_AUTOMATICS_POWER != null) {
      this.range16 = [this.device['data'].data.MIN_AUTOMATICS_POWER, this.device['data'].data.MAX_AUTOMATICS_POWER];
    } else {
      this.range16 = [1, 2];
      this.notPresentData16 = true;
    }

    if (this.device['data'].data.AUTOMATICS_POWER_DURING_SUPPLY != null) {
      this.range17 = this.device['data'].data.AUTOMATICS_POWER_DURING_SUPPLY;
    } else {
      this.range17 = 5;
      this.notPresentData17 = true;
    }

    if (this.device['data'].data.CLEANING_SETTINGS_FAN_EXTERN_POWER != null) {
      this.range18 = this.device['data'].data.CLEANING_SETTINGS_FAN_EXTERN_POWER;
    } else {
      this.range18 = 1;
      this.notPresentData18 = true;
    }

    if (this.device['data'].data.CLEANING_SETTINGS_FAN_POWER != null) {
      this.range19 = this.device['data'].data.CLEANING_SETTINGS_FAN_POWER;
    } else {
      this.range19 = 1;
      this.notPresentData19 = true;
    }

    if (this.device['data'].data.CLEANING_SETTINGS_WORK_TIME != null) {
      this.range20 = this.device['data'].data.CLEANING_SETTINGS_WORK_TIME;
    } else {
      this.range20 = 1;
      this.notPresentData20 = true;
    }

    this.weekleySettingsCheckBox = this.device.autoWeekly;

    if (this.device['data'].data.IGNITION_FAN_EXTERN_POWER_MIN != null && this.device['data'].data.IGNITION_FAN_EXTERN_POWER_MAX != null) {
      this.range21 = [this.device['data'].data.IGNITION_FAN_EXTERN_POWER_MIN, this.device['data'].data.IGNITION_FAN_EXTERN_POWER_MAX];
    } else {
      this.range21 = [0, 0];
      this.notPresentData21 = true;
    }

    if (this.device['data'].data.IGNITION_TIME != null) {
      this.range22 = this.device['data'].data.IGNITION_TIME;
    } else {
      this.range22 = 1;
      this.notPresentData22 = true;
    }

    this.service.isShowWeekleySettings.next(this.device.autoWeekly);

    this.onResize();
    if (this.device.removeDate) {
      this.service.getRemoveDate(this.device.id).subscribe((data) => {
        this.isRemoved = true;
        this.startCountdown(data);
      });
    }
  }

  ngOnDestroy() {
    if (this.intevalObj) {
      clearInterval(this.intevalObj);
    }
    this.service.tempChartSettings = null;
    this.weekForSettings = [];
    for (let i = 0; i < this.week.length; i++) {
      if (this.week[i]) {
        this.weekForSettings[i + 1] = i + 1;
      }
    }

  }

  setTimeZone() {
    const temp = StaticData.TimeZones.find((timezone) => timezone.value === this.device.timezone);
    if (temp) {
      this.timezone = temp.value;
    }
  }

  getWeather() {
    this.service.getWeather(this.device.latitude, this.device.longitude).subscribe((data) => {
      this.weather = {
        day: moment().format('DD.MM.YYYY'),
        city: data['name'],
        temperature: Math.round(data['main'].temp - 273.15),
        img: 'http://openweathermap.org/img/w/' + data['weather'][0].icon + '.png'
      };
    });
  }

  getWeatherWebSite() {
    if (this.weather.city) {
      window.open(`https://openweathermap.org/find?q=${this.weather.city}`, '_blank');
    }
  } // TODO: fix in feature

  changeAugerWorkMode(nubm) {
    this.augerWorkMode = this.augerWorkMode ? 1 : 0;
  }

  changeCleaningWork() {
    this.cleaningWork = this.cleaningWork ? 1 : 0;
  }

  changeCleaningSettingsFun() {
    this.cleaningSettingsFun = this.cleaningSettingsFun ? 1 : 0;
  }

  deleteDevice() {
    if (this.device.isOnline && this.device.permission === Permission.WRITE) {
      const deviceId = this.device.id;
      this.service.removeDevice(deviceId)
        .switchMap((data) => this.service.getRemoveDate(deviceId))
        .subscribe((data: number) => {
          if (data) {
            this.isRemoved = true;
            this.startCountdown(data);
          }
        });
    }
  }

  startCountdown(data: number) {
    const endTime = moment(data).valueOf();
    this.intevalObj = setInterval(() => {
        this.removeDate = moment.duration(endTime - moment().valueOf());
        this.day = this.removeDate.days();
        this.hours = this.removeDate.hours();
        this.minutes = this.removeDate.minutes();
        this.seconds = this.removeDate.seconds();
      },
      this.ONE_SECOND_FOR_COUNTER);
  }

  restoreDevice() {
    if (this.device.isOnline && this.device.permission === Permission.WRITE) {
      this.service.restoreDevice(this.device.id).subscribe((data) => {
        this.isRemoved = false;
        clearInterval(this.intevalObj);
      });
    }
  }

  changeWeekleySettingsCheckBox() {
    this.service.isShowWeekleySettings.next(this.weekleySettingsCheckBox);
  }

  changeWeeklySettings() {
    const dto = new WeeklySettingDtoModel();
    dto.on = this.weekleySettingsCheckBox;
    dto.settings = [];
    console.log(this.week)
    this.week.forEach((day, dayIndex) => {
      day.data.forEach((temperature, hourIndex) => {
        const hour = new SettingItem();
        hour.dayOfWeek = dayIndex;
        hour.enabled = day.enable;
        hour.hourOfDay = hourIndex;
        hour.targetTemperature = temperature;
        dto.settings.push(<SettingItem>hour);
      });

    });
    console.log(dto)

    this.service.PutWeeklySettings(dto, this.device.id).subscribe((data: any) => {
      this.service.getDevices();
    }, (error2) => {
      this.service.getDevices();
    });
  }

  changeName() {
    if (this.deviceName !== this.device.name) {
      this.service.changeNameDevice(this.deviceName, this.device.id).subscribe();
    }
  }

  changeTimeZone() {
    const dto = {
      timezone: this.timezone,
      devId: this.device.devId
    };
    this.service.changeTimeZone(dto, this.device.id).subscribe((data: any) => {
      this.service.getDevices();
    }, (error2) => {
      this.service.getDevices();
    });
  }

  changeState() {
    if (this.device.isOnline && this.device.permission === Permission.WRITE) {
      const data = this.device.data.data;
      this.changeName();
      this.changeWeeklySettings();

      if (this.device.timezone !== this.timezone) {
        console.log(this.device.timezone);
        console.log(this.timezone);
        this.changeTimeZone();
      }

      const dto = {data: {}, id: this.device.data.id};
      if (!this.notPresentData) {
        this.setIfChanged('FAN_POWER_DURING_IGNITION', data, this.range[0], dto.data);
        this.setIfChanged('FAN_POWER_DURING_IGNITION_MAX', data, this.range[1], dto.data);
      }
      if (!this.notPresentData1) {
        this.setIfChanged('EXTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION', data, this.range1, dto.data);
      }
      if (!this.notPresentData2) {
        this.setIfChanged('INTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION', data, this.range2, dto.data);
      }
      if (!this.notPresentData3) {
        this.setIfChanged('OPTICAL_SENSOR_TEMPERATURE_GROWING', data, this.range3, dto.data);
      }
      if (!this.notPresentData24) {
        this.setIfChanged('WORK_PRIORITY', data, this.workPriority, dto.data);
      }
      if (!this.notPresentData4) {
        this.setIfChanged('INTERNAL_AUGER_CONVEYOR_WORK_TIME', data, this.range4 * this.VALUE_FOR_CHANGE_DEVICE_DATA, dto.data);
      }
      if (!this.notPresentData5) {
        this.setIfChanged('EXTERNAL_AUGER_CONVEYOR_PAUSE', data, this.range5 * this.VALUE_FOR_CHANGE_DEVICE_DATA, dto.data);
      }
      if (!this.notPresentData6) {
        this.setIfChanged('CLEANING_CYCLES_COUNT', data, this.range6 * this.VALUE_FOR_CHANGE_DEVICE_DATA, dto.data);
      }
      if (!this.notPresentData7) {
        this.setIfChanged('EXTERNAL_AUGER_CONVEYOR_WORK_TIME', data, this.range7 * this.VALUE_FOR_CHANGE_DEVICE_DATA, dto.data);
      }
      if (!this.notPresentData8) {
        this.setIfChanged('CLEANING_WORK_TIME', data, this.range8 * this.VALUE_FOR_CHANGE_DEVICE_DATA, dto.data);
      }
      if (!this.notPresentData9) {
        this.setIfChanged('MIN_FAN_WORKING_POWER', data, this.range9[0], dto.data);
        this.setIfChanged('MAX_FAN_WORKING_POWER', data, this.range9[1], dto.data);
      }
      if (!this.notPresentData10) {
        this.setIfChanged('RESERVE_FAN_START_TIMEOUT', data, this.range10, dto.data);
      }
      if (!this.notPresentData11) {
        this.setIfChanged('RESERVE_FAN_STOP_TIMEOUT', data, this.range11, dto.data);
      }
      if (!this.notPresentData12) {
        this.setIfChanged('RESERVE_FAN_MIN_POWER', data, this.range12[0], dto.data);
        this.setIfChanged('RESERVE_FAN_WORKING_POWER', data, this.range12[1], dto.data);
      }
      if (!this.notPresentData13) {
        this.setIfChanged('CENTRAL_HEATING_PUMP_START_TEMPERATURE', data, this.range13, dto.data);
      }
      if (!this.notPresentData14) {
        this.setIfChanged('CENTRAL_HEATING_PUMP_HYSTERESIS', data, this.range14, dto.data);
      }
      if (!this.notPresentData25) {
        this.setIfChanged('AUGER_CONVEYOR_WORK_MODE', data, this.augerWorkMode, dto.data);
      }
      if (!this.notPresentData23) {
        this.setIfChanged('CLEANING_SETTINGS_CLEANER', data, this.cleaningWork, dto.data, true);
      }
      if (!this.notPresentData26) {
        this.setIfChanged('CLEANING_SETTINGS_FAN', data, this.cleaningSettingsFun, dto.data, true);
      }
      if (!this.notPresentData15) {
        this.setIfChanged('DEVICE_HYSTERESIS', data, this.range15, dto.data);
      }
      if (!this.notPresentData16) {
        this.setIfChanged('MIN_AUTOMATICS_POWER', data, this.range16[0], dto.data);
        this.setIfChanged('MAX_AUTOMATICS_POWER', data, this.range16[1], dto.data);
      }
      if (!this.notPresentData17) {
        this.setIfChanged('AUTOMATICS_POWER_DURING_SUPPLY', data, this.range17, dto.data);
      }
      if (!this.notPresentData18) {
        this.setIfChanged('CLEANING_SETTINGS_FAN_EXTERN_POWER', data, this.range18, dto.data);
      }
      if (!this.notPresentData19) {
        this.setIfChanged('CLEANING_SETTINGS_FAN_POWER', data, this.range19, dto.data);
      }
      if (!this.notPresentData20) {
        this.setIfChanged('CLEANING_SETTINGS_WORK_TIME', data, this.range20, dto.data);
      }
      if (!this.notPresentData21) {
        this.setIfChanged('IGNITION_FAN_EXTERN_POWER_MIN', data, this.range21[0], dto.data);
        this.setIfChanged('IGNITION_FAN_EXTERN_POWER_MAX', data, this.range21[1], dto.data);
      }
      if (!this.notPresentData22) {
        this.setIfChanged('IGNITION_TIME', data, this.range22, dto.data);
      }

      let found = false;
      for (const prop in dto.data) {
        if (dto.data.hasOwnProperty(prop)) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.closeDialog();
        return;
      }

      this.service.changeDeviceState(dto, this.device.id, (d) => {
        this.closeDialog();
      }, (error2) => {
        this.closeDialog();
      });
    }
  }

  setIfChanged(propName, oldData, newValue, target, inverse = false) {
    if (oldData[propName] !== newValue) {
      if (inverse) {
        switch (typeof(newValue)) {
          case 'boolean':
            newValue = !newValue;
            break;
          case 'number':
            newValue = newValue == 0 ? 1 : 0;
            break;
        }
      }
      target[propName] = newValue;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onFirstValueChange(event) {
    this.range = [event, this.range[1]];
  }

  onSecondValueChange(event) {
    this.range = [this.range[0], event];
  }

  @HostListener('window:resize')
  onResize() {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width; // document.body.clientWidth
    this.isMobileSize = width > this.MOBILE_SIZE_FOR_SETTINGS_WINDOW;
  }
}
