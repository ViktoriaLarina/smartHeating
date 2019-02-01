import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceService } from '../../../services/device.service';
import { StaticData } from '../../../utils/static-data';
import { SettingsType2Component } from '../../pages/devices/settings-type2/settings-type2.component';
import * as moment from 'moment';
import { PalletLevelModel } from '../../../models/baseDevice/palletLevel.model';
import { DeviceTypesInfoModel } from '../../../models/DeviceTypesInfo.model';
import { Place } from '../../../models/places.model';
import { Permission } from '../../../utils/enums/permissionEnum.model';

@Component({
  selector: 'app-device-item-type2',
  templateUrl: './device-item-type2.component.html',
  styleUrls: ['./device-item-type2.component.css']
})
export class DeviceItemType2Component implements OnInit, OnDestroy {

  @Input() device: PalletLevelModel;

  name: string;
  arrayOfDeviceTypes: DeviceTypesInfoModel[];
  deviceType: string;
  houseType: string;
  error: number;
  arrayOfPlaces: Place[];
  deviceTypeToShow: number;
  sensor1: number;
  sensor2: number;
  relay: number;
  currentLevel: number;
  isRemoved: boolean;
  removeDate;
  intevalObj;
  day;
  hours;
  minutes;
  seconds;

  constructor(public dialog: MatDialog, private service: DeviceService) {
    this.arrayOfPlaces = StaticData.Places;
    this.arrayOfDeviceTypes = StaticData.DeviceTypesInfo;
  }

  ngOnInit() {
    if (this.device.removeDate) {
      this.isRemoved = true;
      this.startCountdown(this.device.removeDate);
    }
    this.name = this.device.name;
    for (let i = 0; i < this.arrayOfPlaces.length; i++) {
      if (this.device.deviceInfoDto) {
        if (this.arrayOfPlaces[i].value === this.device.deviceInfoDto.houseType) {
          this.houseType = this.arrayOfPlaces[i].name;
        }
      }
    }

    for (let i = 0; i < this.arrayOfDeviceTypes.length; i++) {
      if (this.device.deviceType) {
        if (this.arrayOfDeviceTypes[i].value === this.device.deviceType) {
          this.deviceType = this.arrayOfDeviceTypes[i].name;
          this.deviceTypeToShow = i;
        }
      }
    }
    if (!this.device.data) {
      return;
    }
    this.relay = this.device.data.data.RELAY_STATE;
    this.sensor1 = this.device.data.data.SENSOR_1_STATE;
    this.sensor2 = this.device.data.data.SENSOR_2_STATE;
    this.currentLevel = this.device.data.data.LEVEL_CURRENT;
  }

  ngOnDestroy() {
    if (this.intevalObj) {
      clearInterval(this.intevalObj);
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
      this.service.restoreDevice(this.device['id']).subscribe(data => {
        this.isRemoved = false;
        clearInterval(this.intevalObj);
      });
    }
  }

  openDialogSettings(): void {
    const dialogRef = this.dialog.open(SettingsType2Component, {
      disableClose: true,
      data: {device: this.device}
    });

    dialogRef.afterClosed().subscribe(result => {
      return result;
    });
  }

}
