import { Component, Input, OnInit } from '@angular/core';
import { BaseDeviceModel } from '../../../models/baseDevice/baseDevice.model';
import { DeviceTypesInfoModel } from '../../../models/DeviceTypesInfo.model';
import { StaticData } from '../../../utils/static-data';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html'
})
export class DeviceItemComponent implements OnInit {

  private _device: BaseDeviceModel;

  @Input()
  get device() {
    return this._device;
  }
  set device(value) {
    if (this._device === value) {
      return;
    }
    this._device = value;
    if (!this._device) {
      return;
    }

    const data = this._device.data.data;
    for (const key in data) {
      if (Number(data[key])) {
        data[key] = Math.round(data[key]);
      }
    }
  }

  deviceTypeToShow: number;
  arrayOfDeviceTypes: DeviceTypesInfoModel[];

  constructor() {
    this.arrayOfDeviceTypes = StaticData.DeviceTypesInfo;
  }

  ngOnInit() {
    for (let i = 0; i < this.arrayOfDeviceTypes.length; i++) {
      if (this.arrayOfDeviceTypes[i].value === this.device.deviceType) {
        this.deviceTypeToShow = i;
      }
    }
  }
}
