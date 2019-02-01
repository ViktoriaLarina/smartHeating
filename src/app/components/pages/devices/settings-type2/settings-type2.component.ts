import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import * as moment from 'moment';

import { DeviceService } from '../../../../services/device.service';
import { Permission } from '../../../../utils/enums/permissionEnum.model';
import {BaseDeviceModel} from '../../../../models/baseDevice/baseDevice.model';

@Component({
  selector: 'app-settings-type2',
  templateUrl: './settings-type2.component.html',
  styleUrls: ['./settings-type2.component.css']
})
export class SettingsType2Component implements OnInit, OnDestroy {

  device: BaseDeviceModel;
  deviceId: string;
  deviceName: string;
  deviceIp: string;
  isRemoved: boolean;
  removeDate;
  intevalObj;
  day;
  hours;
  minutes;
  seconds;
  isMobileSize: boolean;
  mobMenu: boolean;

  constructor(public dialogRef: MatDialogRef<SettingsType2Component>,
              private service: DeviceService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.device = data['device'];
  }

  ngOnInit() {
    this.deviceId = this.device.devId;
    this.deviceName = this.device.name;
    this.deviceIp = this.device.ip;
  }

  ngOnDestroy() {
    if (this.intevalObj) {
      clearInterval(this.intevalObj);
    }
  }

  deleteDevice() {
    if (this.device.isOnline && this.device.permission === Permission.WRITE) {
      this.service.removeDevice(this.device.id).subscribe((data) => {});
    }
  }

  startCountdown(data) {
    const endTime = moment(data).valueOf();
    this.intevalObj = setInterval(() => {
        this.removeDate = moment.duration(endTime - moment().valueOf());
        this.day = this.removeDate.days();
        this.hours = this.removeDate.hours();
        this.minutes = this.removeDate.minutes();
        this.seconds = this.removeDate.seconds();
      },
      1000);
  }

  restoreDevice() {
    if (this.device.isOnline && this.device.permission === Permission.WRITE) {
      this.service.restoreDevice(this.device.id).subscribe((data) => {
        this.isRemoved = false;
        clearInterval(this.intevalObj);
      });
    }
  }

  changeName() {
    if (this.deviceName !== this.device.name) {
      this.service.changeNameDevice(this.deviceName, this.device.id).subscribe((data) => {
        this.closeDialog();
      }, (error) => {
        this.closeDialog();
      });
    }
  }

  changeState() {
    if (this.device.isOnline && this.device.permission === Permission.WRITE) {
      this.changeName();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
