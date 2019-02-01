import { Component, Input } from '@angular/core';

import { MatDialog } from '@angular/material';

import {UsersDataOut} from '../../../../../models/dataOut/dataOut.model';
import {UsersService} from '../../../../../services/users.service';
import {PopupVerificationDeleteComponent} from '../../../../pop-up/popup-verification-delete/popup-verification-delete.component';
import {UserEditComponent} from '../../edit-user/user-edit.component';

@Component({
  selector: '[app-user-item]',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent {

  @Input() user: UsersDataOut;

  constructor(public dialog: MatDialog, private service: UsersService) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      disableClose: true,
      data: {
        user: this.user
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  deleteUser(): void {
    const dialogRef = this.dialog.open(PopupVerificationDeleteComponent, {
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.service.deleteOwnedUser(this.user.id).subscribe((data) => {
          this.service.getUsers();
        });
      }
    });
  }
}
