import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Md2Accordion } from 'md2';
import * as moment from 'moment';

import { UsersDataOut } from '../../../../../models/dataOut/dataOut.model';
import { AdminPageService } from '../../../../../services/admin-page.service';
import { StaticData } from '../../../../../utils/static-data';
import { ChangeUserInfoComponent } from './change-user-info/change-user-info.component';

@Component({
  selector: 'app-item-admin-user',
  templateUrl: './item-admin-user.component.html',
  styleUrls: ['./item-admin-user.component.css'],
  providers: [Md2Accordion]
})
export class ItemAdminUserComponent implements OnInit {

  index: number;
  previosId: number;
  userFullInfo: UsersDataOut;
  selectType: string[];
  devices: Array<any>;
  groupIn: UsersDataOut[];
  groupOwner: UsersDataOut[];
  item: any;
  @Input() user: any;
  lastOnline: string;

  constructor(private service: AdminPageService, public dialog: MatDialog) {
    this.index = 1;
    this.selectType = [];
  }

  ngOnInit() {
    if (this.user.lastOnline) {
      this.lastOnline = moment(this.user.lastOnline).format('MMMM Do YYYY, h:mm:ss a');
      console.dir(typeof this.lastOnline);
    }
  }

  ChangeUserInfo() {
    const dialogRef = this.dialog.open(ChangeUserInfoComponent, <any> {
      disableClose: true,
      data: {
        user: this.user
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  getInfo() {
    if (this.user.id === this.previosId) {
      return;
    }
    this.previosId = this.user.id;
    this.service.getUserFullInfo(this.user.id).subscribe((data: UsersDataOut) => {
      this.userFullInfo = data;
    });
  }

  showDeviceInfo(id) {
    this.service.getdeviceFullInfo(id).subscribe(data => {
      console.log(data);
      this.item = data;
    });
  }

  redirctToGoogle() {
    window.open('https://mail.google.com/mail/u/1/#inbox?compose=new', '_blank');
  }

  getUsersDevices() {
    this.index = 2;
    this.service.getUsersDevices(this.user.id).subscribe((data: Array<any>) => {
      this.devices = data;
      console.log(data);
      for (const device of this.devices) {
        this.selectType.push(StaticData.GetDeviceTypeInfo(device.deviceType).name);
      }
    });
  }

  findGroupOwner() {
    this.index = 3;
    this.service.findGroupOwner(this.user.id).subscribe((data: UsersDataOut[]) => {
      this.groupOwner = data;
    });
  }

  findGroupIn() {
    this.index = 4;
    this.service.findGroupIn(this.user.id).subscribe((data: UsersDataOut[]) => {
      this.groupIn = data;
    });
  }
}
