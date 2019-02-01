import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import * as moment from 'moment';

import { BioUniversalModel } from '../../../models/baseDevice/bioUniversal.model';
import { DeviceService } from '../../../services/device.service';

import { DeviceTypesInfoModel } from '../../../models/DeviceTypesInfo.model';
import { Place } from '../../../models/places.model';
import { Permission } from '../../../utils/enums/permissionEnum.model';
import { StaticData } from '../../../utils/static-data';
import { SettingsComponent } from '../../pages/devices/settings/settings.component';

@Component({
  selector: 'app-device-item-type1',
  templateUrl: './device-item-type1.component.html',
  styleUrls: ['./device-item-type1.component.css']
})
export class DeviceItemType1Component implements OnInit, OnDestroy {

  WAITING_TIME = 5000;

  @Input() device: BioUniversalModel;

  currentTemperature1: number;
  rangeTemperature1: number;
  currentTemperature2: number;
  rangeTemperature2: number;
  oldRangeTemperature1: number;
  oldRangeTemperature2: number;
  minTemperature: number;
  maxTemperature: number;
  opticalSensor: number;
  actualState: number;
  actualStateSwitch: boolean;
  name: string;
  arrayOfDeviceTypes: DeviceTypesInfoModel[];
  deviceType: string;
  houseType: string;
  workingPower: number;
  sensorType: number;
  error: number;
  workPriority: number;

  arrayOfPlaces: Place[];
  deviceTypeToShow: number;
  onMouseUpBind: any;
  onMouseDownBind: any;
  isRemoved: boolean;
  usedFuel: number;
  removeDate;
  intevalObj;
  day;
  hours;
  minutes;
  seconds;
  isWaiting;
  isWaitingBtn;
  previousData;

  constructor(public dialog: MatDialog, private service: DeviceService) {
    this.isWaitingBtn = false;
    this.previousData = this.device;
    this.minTemperature = 40;
    this.maxTemperature = 90;
    this.arrayOfPlaces = StaticData.Places;
    this.arrayOfDeviceTypes = StaticData.DeviceTypesInfo;

    this.onMouseUpBind = this.onMouseUp.bind(this);
    document.body.addEventListener('mouseup', this.onMouseUpBind, true);
    this.onMouseDownBind = this.onMouseDown.bind(this);
    document.body.addEventListener('mousedown', this.onMouseDownBind, true);
  }

  ngOnInit() {
    if (!this.device.data) {
      return;
    }
    if (this.device.removeDate) {
      this.isRemoved = true;
      this.startCountdown(this.device.removeDate);
    }
    this.name = this.device['name'];

    if (this.device['deviceInfoDto']) {

        const found = this.arrayOfPlaces.find((item: Place) => item.value === this.device['deviceInfoDto'].houseType);
        if (found) {
          this.houseType = found.name;
        }
    }
    for (let i = 0; i < this.arrayOfDeviceTypes.length; i++) {
      if (this.device['deviceType']) {
        if (this.arrayOfDeviceTypes[i].value === this.device['deviceType']) {
          this.deviceType = this.arrayOfDeviceTypes[i].name;
          this.deviceTypeToShow = i;
        }
      }
    }
    this.rangeTemperature1 = this.device['data'].data.CENTRAL_HEATING_TEMPERATURE;
    this.rangeTemperature2 = this.device['data'].data.CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE;

    this.currentTemperature1 = this.device['data'].data.EXTERNAL_CENTRAL_HEATING_TEMPERATURE;
    this.currentTemperature2 = this.device['data'].data.EXTERNAL_CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE;
    this.opticalSensor = this.device['data'].data.OPTICAL_SENSOR_VALUE;
    this.actualState = this.device['data'].data.ACTUAL_STATE;

    this.actualStateSwitch = this.device['deviceState'] === 'START';

    this.workingPower = this.device['data'].data.WORKING_POWER_IN_PERCENT;
    this.sensorType = this.device['data'].data.SENSOR_TYPE;
    this.error = this.device['data'].data.ACTUAL_ERROR;
    this.workPriority = this.device['data'].data.WORK_PRIORITY;
    this.usedFuel = this.device['data'].data.FUEL_AMOUNT;

    this.oldRangeTemperature1 = this.currentTemperature1;
    this.oldRangeTemperature2 = this.currentTemperature2;
  }

  ngOnDestroy() {
    if (this.intevalObj) {
      clearInterval(this.intevalObj);
    }
    document.body.removeEventListener('mouseup', this.onMouseUpBind, true);
    document.body.removeEventListener('mousedown', this.onMouseDownBind, true);
    this.service.blockFullRefresh = false;
  }

  openDialogSettings(): void {
    const dialogRef = this.dialog.open(SettingsComponent, {
      disableClose: true,
      data: {device: this.device}
    } as any);

    dialogRef.afterClosed().subscribe((result) => {
      return result;
    });
  }

  changeDeviceSetate() {
    this.isWaitingBtn = true;
    const dto = {
      data: {
        ACTUAL_STATE_TRIGGER: 1,
        ACTUAL_STATE: this.device['data'].data.ACTUAL_STATE
      },
      id: this.device.id
    };
    this.putChangeData(dto);
  }

  putChangeData(data) {
    if (this.device.isOnline && this.device.permission === Permission.WRITE) {
      this.isWaiting = true;
      this.service.needFullRefresh = true;
      this.service.changeDeviceState(data, this.device.id, (result) => {
        this.setWaitingTime();
      }, (error) => {
        this.setWaitingTime();
      });
    }
  }

  onValueChangeMinus(temperature) {
    if (this[temperature] > this.minTemperature) {
      --this[temperature];
      this.onMouseUp();
    }
  }
  onValueChangePlus(temperature) {
    if (this[temperature] < this.maxTemperature) {
      ++this[temperature];
      this.onMouseUp();
    }
  }

  startCountdown(data) {
    const endTime = moment(data).valueOf();
    this.setRemoveTimer(endTime);
    this.intevalObj = setInterval(() => this.setRemoveTimer(endTime),
      1000);
  }

  setRemoveTimer(endTime) {
    this.removeDate = moment.duration(endTime - moment().valueOf());
    this.day = this.removeDate.days();
    this.hours = this.removeDate.hours();
    this.minutes = this.removeDate.minutes();
    this.seconds = this.removeDate.seconds();
  }

  restoreDevice() {
    if (this.device.permission === Permission.WRITE) {
      this.service.restoreDevice(this.device['id']).subscribe((data) => {
        this.isRemoved = false;
        clearInterval(this.intevalObj);
      });
    }
  }

  @HostListener('window:touchend')
  onMouseUp() {
    this.service.blockFullRefresh = false;
    if (this.oldRangeTemperature1 !== this.currentTemperature1) {
      const dto = {
        data: {EXTERNAL_CENTRAL_HEATING_TEMPERATURE: this.currentTemperature1},
        id: this.device.id
      };
      this.putChangeData(dto);
      this.oldRangeTemperature1 = this.currentTemperature1;
    } else if (this.oldRangeTemperature2 !== this.currentTemperature2) {
      const dto = {
        data: {EXTERNAL_CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE: this.currentTemperature2},
        id: this.device.id
      };
      this.putChangeData(dto);
      this.oldRangeTemperature2 = this.currentTemperature2;
    } else if (this.service.needFullRefresh) {
      this.service.getDevices();
    }
  }

  onMouseDown() {
    this.service.blockFullRefresh = true;
  }

  private setWaitingTime() {
    setTimeout(() => {
        this.isWaiting = false;
        this.isWaitingBtn = false;
      },
      this.WAITING_TIME
    );
  }
}
