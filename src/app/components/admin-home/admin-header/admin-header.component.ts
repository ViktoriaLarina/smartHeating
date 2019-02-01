import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { InteractionsService } from '../../../services/interactions.service';
import { UsersService } from '../../../services/users.service';
import { MyProfileComponent } from '../../header/my-profile/my-profile.component';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  mobileMenu: boolean;

  constructor(private serviseInteractions: InteractionsService,
              private serviceUser: UsersService,
              public rout: Router,
              public dialog: MatDialog) {
    this.mobileMenu = false;
  }

  ngOnInit() {
  }

  openDialogProfile() {
    const dialogRef = this.dialog.open(MyProfileComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe();
  }

  logout() {
    this.serviceUser.logout();
  }
  showMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
    this.serviseInteractions.mobileMenuState.next(this.mobileMenu);
  }

}
