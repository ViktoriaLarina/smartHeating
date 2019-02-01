import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { AdminPageService } from '../../../../services/admin-page.service';

@Component({
  selector: '[app-item-login-history]',
  templateUrl: './item-login-history.component.html',
  styleUrls: ['./item-login-history.component.css']
})
export class ItemLoginHistoryComponent implements OnInit {

  @Input() item: any;
  @Input() isLogin: any;
  public dataToLoginHistoryTable: any;
  time;

  constructor(private service: AdminPageService) {
  }

  ngOnInit() {
    this.time = moment(this.item.timestamp).format('DD.MM.YYYY HH:mm');
  }
  showMap() {
    if (this.item.dataToLoginHistoryTable && this.item.dataToLoginHistoryTable.longitude) {
      this.item.dataToLoginHistoryTable = null;
      return;
    }
    this.service.clickButtonShowMap.next(this.item.id);
    const data = {
      latitude: +this.item.latitude,
      longitude: +this.item.longitude,
    };
    this.item.dataToLoginHistoryTable = data;
  }

  showFullInfoUser() {
    if (this.item.dataToLoginHistoryTable && this.item.dataToLoginHistoryTable.email) {
      this.item.dataToLoginHistoryTable = null;
      return;
    }

    this.service.getUserFullInfo(this.item.userId).subscribe(dataUser => {
      this.service.clickButtonShowUserInfo.next(this.item.id);
      this.item.dataToLoginHistoryTable = dataUser;
    });
  }

  showDeviceData() {
    if (this.item.dataToLoginHistoryTable && this.item.dataToLoginHistoryTable.permission) {
      this.item.dataToLoginHistoryTable = null;
      return;
    }

    this.service.getdeviceFullInfo(this.item.deviceId).subscribe(dataDevice => {
      this.service.clickButtonShowDeviceInfo.next(this.item.id);
      this.item.dataToLoginHistoryTable = dataDevice;
    });
  }
}
