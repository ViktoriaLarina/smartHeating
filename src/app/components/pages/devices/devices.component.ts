import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MatDialog} from '@angular/material';

import {FiltersModel} from '../../../models/filters.model';
import {DeviceService} from '../../../services/device.service';
import {StaticData} from '../../../utils/static-data';
import {BaseDeviceModel} from '../../../models/baseDevice/baseDevice.model';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html'
})
export class DevicesComponent implements OnInit, OnDestroy {

  arrayShow: BaseDeviceModel[];
  refresh_interval: number;
  devices: BaseDeviceModel[];
  filters: FiltersModel;
  intervalTime: number;

  subscription: Subscription;
  subscriptionFlters: Subscription;

  constructor(public dialog: MatDialog, private service: DeviceService) {

    this.refresh_interval = StaticData.REFRESH_INTERVAL;
    this.subscriptionFlters = this.service.filters.subscribe((filters: FiltersModel) => {
      this.filters = filters;
      this.fillDevices();
    });
  }

  fillDevices() {
    if (!this.devices) {
      return;
    }
    this.arrayShow = this.devices.filter((d) => {
      const f = this.filters;
      if (!f) {
        return true;
      }

      if (f.devicesByTypesSelect.length !== 0 && !f.devicesByTypesSelect.some((typeFilter) => typeFilter.indexOf(d.deviceType) !== -1)) {
        return false;
      }
      if (d['deviceInfoDto']) { // TODO: delete [' ']
        if (f.devicesByBuildingSelect.length !== 0 && f.devicesByBuildingSelect.indexOf(d.deviceInfoDto.houseType) === -1) {
          return false;
        }
      }

      if (d.deviceType.toString() === StaticData.BIO_UNIVERSAL && f.devicesByStatusSelect.length !== 0 &&
        f.devicesByStatusSelect.indexOf(d.data.data['ACTUAL_STATE']) === -1) { // TODO: delete ['  ']
        return false;
      }
      if (d.deviceType.toString() === StaticData.PELLET_LEVEL && f.devicesByStatusSelect.length !== 0 &&
        f.devicesByStatusSelect.indexOf(d.isOnline ? 1 : 0) === -1 ) {
        return false;
      }
      return !(f.devicesByModelSelect.length !== 0 && f.devicesByModelSelect.indexOf(d.deviceType) === -1);

    });
  }

  ngOnInit(): void {
    this.subscription = this.service.displayingDevices.subscribe((items: BaseDeviceModel[]) => {
      this.devices = items;
      this.fillDevices();
    });
    this.service.getDevices();
    this.intervalTime = window.setInterval(() => {
      this.service.getDevices();
    }, this.refresh_interval);

  }

  ngOnDestroy() {
    clearInterval(this.intervalTime);
    this.subscriptionFlters.unsubscribe();
    this.subscription.unsubscribe();
  }
}
