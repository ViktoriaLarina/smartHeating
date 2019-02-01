import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';

import 'rxjs/add/operator/map';

import {UsersDataOut} from '../../../models/dataOut/dataOut.model';
import {InteractionsService} from '../../../services/interactions.service';
import {UsersService} from '../../../services/users.service';
import {StaticData} from '../../../utils/static-data';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  isMobileSize: boolean;
  isShowMyProfile: boolean;
  usersArray: UsersDataOut[];

  constructor(public dialog: MatDialog, private  service: UsersService, private serviceInteraction: InteractionsService) {
    this.usersArray = [];
    this.isMobileSize = false;
    this.serviceInteraction.showMobileMyProfile.subscribe((isShow: boolean) => {
      this.isShowMyProfile = isShow;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkClientWidth();
  }

  ngOnInit(): void {

    this.checkClientWidth();
    this.service.displayingUsers.subscribe((users: UsersDataOut[]) => {
      this.usersArray = users;
    });
    this.service.getUsers();
  }

  checkClientWidth() {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
  }
}
