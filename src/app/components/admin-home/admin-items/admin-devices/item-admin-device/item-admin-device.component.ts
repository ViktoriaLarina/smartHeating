import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Md2Accordion } from 'md2';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { AdminPageService } from '../../../../../services/admin-page.service';
import { DeviceService } from '../../../../../services/device.service';
import { CheckboxComponent } from '../../../../pages/history/checkbox/checkbox.component';

import { InteractionsService } from '../../../../../services/interactions.service';
import { StaticData } from '../../../../../utils/static-data';
import { PopupVerificationDeleteComponent } from '../../../../pop-up/popup-verification-delete/popup-verification-delete.component';

import { Place } from '../../../../../models/places.model';
import {DeviceTypesInfoModel} from '../../../../../models/DeviceTypesInfo.model';

@Component({
  selector: 'app-item-admin-device',
  templateUrl: './item-admin-device.component.html',
  styleUrls: ['./item-admin-device.component.css'],
  providers: [Md2Accordion]
})
export class ItemAdminDeviceComponent implements OnInit, OnDestroy {

  @Input() device: any;
  index: number;
  houseType: string;
  arrayOfPlaces: Place[];
  deviceType;
  subscription: Subscription;
  ChartPoints: object;
  arrayOfDeviceTypes: DeviceTypesInfoModel[];
  selected: boolean;
  arrayOfUsers: Array<any>;
  removeDate: string;
  deviceFullInfo: any;
  dataInfo;
  user: any;

  constructor(private service: InteractionsService,
              public dialog: MatDialog,
              private  deviceService: DeviceService,
              private adminServise: AdminPageService,
              private translateService: TranslateService) {
    this.arrayOfPlaces = StaticData.Places;
    this.arrayOfDeviceTypes = StaticData.DeviceTypesInfo;
    this.subscription = this.deviceService.ChartPoints.subscribe(data => {
      this.ChartPoints = data;
    });
  }

  ngOnInit() {
    this.index = 1;
    const device = StaticData.GetDeviceTypeInfo(this.device.deviceType);
    this.deviceType = device ? device.name : null;

    this.service.clickButtonShowHistory.subscribe(data => {
      if (this.device.id !== data) {
        this.selected = false;
      }
    });
    if (this.device.removeDate) {
      this.removeDate = moment(this.device.removeDate).format('DD.MM.YYYY HH:mm');
    }
  }

  showInfoUser(id) {
    this.adminServise.getUserFullInfo(id).subscribe(data => {
      this.user = data;
    });
  }

  getInfo() {
    this.adminServise.getdeviceFullInfo(this.device.id).subscribe(data => {
      this.deviceFullInfo = data;
      this.deviceFullInfo.latitude *= 1;
      this.deviceFullInfo.longitude *= 1;
      for (const places of this.arrayOfPlaces) { // old devices does not have deviceInfoDto
        if (!this.deviceFullInfo.deviceInfoDto) {
          return;
        }
        if (this.deviceFullInfo.deviceInfoDto.houseType === places.value) {
          this.houseType = places.name;
        }
      }
    });
  }

  getDataDevice() {
    this.index = 2;
    this.adminServise.getDeviceData(this.device.id).subscribe(data => {
      const config = StaticData.GetDeviceTypeInfo(this.device.deviceType).historyConfig;
      const d = data['data'];
      this.dataInfo = this.getFilteredInfo(d, config, 2);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  restoreDevice() {
    this.deviceService.restoreDevice(this.device.id).subscribe(data => {
      this.adminServise.getDevices();
    });
  }

  deleteDevice() {
    const dialogRef = this.dialog.open(PopupVerificationDeleteComponent, {
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.adminServise.removeDevice(this.device.id).subscribe((data) => {
          this.adminServise.getDevices();
        });
      }
    });
  }
  disabledDevice() {
    this.deviceService.removeDevice(this.device.id).subscribe((data) => {
        this.adminServise.getDevices();
      });
  }

  showUsers() {
    this.index = 3;
    this.adminServise.getDeviceUsers(this.device.id).subscribe((data: Array<any>) => {
      this.arrayOfUsers = data;
    });
  }

  showHistory() {
    this.service.clickButtonShowHistory.next(this.device.id);
    const dialogRef = this.dialog.open(CheckboxComponent, {
      disableClose: false,
      data: {
        type: this.device.deviceType,
        id: this.device.id
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selected = (this.service.historyChartId === this.device.id);
    });
  }

  getFilteredInfo(data, typeConfig, colsCount): any {
    const infos = [];
    let currentRow;
    for (const types of typeConfig) {
      const config = types;

      // check if needed to show current parameter
      if (config.showPredicate && !config.showPredicate(data)) {
        continue;
      }

      let value = data[config.param];
      if (Number(value)) {
        value = Math.round(value);
      }
      const valueStr = config.formatter ? config.formatter(value, this.translateService) : value;

      // separate params on rows
      if (!currentRow || (currentRow.length % colsCount === 0)) {
        currentRow = [];
        infos.push(currentRow);
      }

      currentRow.push({
        name: config.name,
        value: valueStr
      });
    }
    return infos;
  }
}
