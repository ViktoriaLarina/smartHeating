import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {AddUserModel} from '../../../../models/addUser.model';
import {UsersDataOut} from '../../../../models/dataOut/dataOut.model';
import {UsersService} from '../../../../services/users.service';
import {RegExpData} from '../../../../utils/reqexp_data';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  TIME_FOR_SHOW_POPUP_IF_NO_DEVICES = 5000;
  isOwnedDevicesFound: boolean;
  currentUserForOwned: UsersDataOut;
  addUser = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(RegExpData.EMAIL_VALIDATOR)
    ])
  });

  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
              private  service: UsersService,
              @Inject(MAT_DIALOG_DATA) public data: AddUserModel) {
    this.isOwnedDevicesFound = data.isDeviceFound;
    if (!this.isOwnedDevicesFound) {
      setTimeout(() => this.closeDialog(), this.TIME_FOR_SHOW_POPUP_IF_NO_DEVICES);
    }
  }

  checkEmail(okCallback: () => void) {
    if (!this.addUser.value.email || this.addUser.controls['email'].invalid) {
      this.addUser.controls['email'].markAsTouched();
      this.addUser.controls['email'].markAsDirty();
      return;
    }
    this.service.checkEmailforOwned(this.addUser.value.email).subscribe((data: UsersDataOut) => {
        this.currentUserForOwned = data;
        this.addUser.controls['email'].updateValueAndValidity();
        if (okCallback) {
          okCallback();
        }
      }, (error) => {
      console.log('123')
      this.addUser.controls['email'].markAsTouched();
      this.addUser.controls['email'].markAsDirty();
      }
    );
  }

  openNextPopup() {
    this.checkEmail(() => this.closeDialog(this.currentUserForOwned));
  }

  // refreshEmailValidity() {
  //   this.addUser.controls['email'].updateValueAndValidity();
  // }

  closeDialog(data?: UsersDataOut) {
    this.dialogRef.close(data);
  }
}
