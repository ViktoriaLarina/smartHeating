import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import * as moment from 'moment';

import { AdminPageService } from '../../../../../../services/admin-page.service';
import { UsersService } from '../../../../../../services/users.service';
import { RegExpData } from '../../../../../../utils/reqexp_data';
import { StaticData } from '../../../../../../utils/static-data';

import { OldDataUserProfile } from '../../../../../../models/oldDataUserProfile.model';
import { PopupSuccessUpdateProfileComponent } from '../../../../../pop-up/popup-success-update-profile/popup-success-update-profile.component';

@Component({
  selector: 'app-change-user-info',
  templateUrl: './change-user-info.component.html',
  styleUrls: ['./change-user-info.component.css']
})
export class ChangeUserInfoComponent implements OnInit {

  @ViewChild('dateInput', {read: ElementRef}) dateInput: ElementRef;

  profileInfo;
  minDate: Date;
  maxDate: Date;
  startDate: moment.Moment;
  phoneAlreadyTaken: boolean;
  emailAlreadyTaken: boolean;
  hasEmptyFields: boolean;
  error = false;
  index: number;
  oldDataUserProfile: OldDataUserProfile;
  userProfile: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    login: new FormControl(''),
    email: new FormControl(''),
    birthday: new FormControl(''),
    phone: new FormControl('')
  });

  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(RegExpData.MIN_LENGTH_PASSWORD),
    Validators.pattern(RegExpData.PASSWORD_VALIDATOR)
  ]);
  constructor(public dialogRef: MatDialogRef<ChangeUserInfoComponent>,
              private service: AdminPageService,
              private userService: UsersService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.profileInfo = data.user;
    this.minDate = StaticData.MIN_DATE;
    this.maxDate = StaticData.MAX_DATE;

    this.hasEmptyFields = false;
    this.phoneAlreadyTaken = false;

    this.startDate = moment(this.profileInfo.birthday, RegExpData.DATE_FORMAT);
    const birthdayString = moment(this.profileInfo['birthday'], RegExpData.DATE_FORMAT);
    this.oldDataUserProfile = new OldDataUserProfile(
      this.profileInfo['firstName'],
      this.profileInfo['lastName'],
      this.profileInfo['email'],
      birthdayString,
      this.profileInfo['phone']
  );
    this.userProfile = new FormGroup({
      firstName: new FormControl(this.profileInfo.firstName, [
        Validators.required,
        Validators.pattern(RegExpData.NAME_VALIDATOR)]),
      lastName: new FormControl(this.profileInfo.lastName, [
        Validators.required,
        Validators.pattern(RegExpData.SURNAME_VALIDATOR)]),
      email: new FormControl(this.profileInfo.email, [
        Validators.required,
        this.isEmailUnique(),
        Validators.pattern(RegExpData.EMAIL_VALIDATOR)]),
      birthday: new FormControl(this.startDate, Validators.required),
      phone: new FormControl(this.profileInfo.phone, [
        Validators.required,
        Validators.pattern(RegExpData.PHONE_VALIDATOR_3)
      ])
    });
  }

  ngOnInit() {
  }

  ShowPopUp(data): void {
    const dialogRef = this.dialog.open(PopupSuccessUpdateProfileComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  isEmailUnique(): ValidatorFn {
    return (control: FormControl): ValidationErrors => {
      return this.emailAlreadyTaken ? {invalid: true} : null;
    };
  }

  refreshEmailValidity() {
    this.emailAlreadyTaken = false;
    this.userProfile.controls['email'].updateValueAndValidity();
  }

  checkEmail() {
    if (this.userProfile.controls['email'].invalid || this.userProfile.controls['email'].value === this.oldDataUserProfile['email']) {
      return;
    }
    const email = this.userProfile.value.email;
    this.userService.checkEmailUser(email).subscribe((data: boolean) => {
        this.emailAlreadyTaken = !data;
        this.userProfile.controls['email'].updateValueAndValidity();
      }
    );
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }

  updateUserProfile() {
    this.hasEmptyFields = false;
    for (const key in this.userProfile.controls) {
      if (this.userProfile.controls.hasOwnProperty(key)) {
        const control = this.userProfile.controls[key];
        control.markAsTouched();
        control.markAsDirty();
        this.hasEmptyFields = !control.value || this.hasEmptyFields;
      }
    }
    this.userProfile.updateValueAndValidity();
    if (!this.userProfile.valid) {
      return;
    }
    const DataToSend = {};
    let hasChanges = false;
    for (const key in this.userProfile.controls) {
      if (this.userProfile.controls.hasOwnProperty(key)) {
        if (key === 'birthday') {
          if (this.oldDataUserProfile[key].diff(this.userProfile.controls[key].value) !== 0) {
            hasChanges = true;
          }
        } else if (this.oldDataUserProfile[key] !== this.userProfile.controls[key].value) {
          hasChanges = true;
        }
        DataToSend[key] = this.userProfile.controls[key].value;
      }
    }
    if (!hasChanges) {
      return;
    }
    DataToSend['birthday'] = moment(DataToSend['birthday']).format(RegExpData.DATE_FORMAT);
    this.service.forceUpdateUserInfo(DataToSend, this.profileInfo.id).subscribe((data) => {
      this.ShowPopUp(true);
      this.service.getUsers();
    }, (error) => {
      this.ShowPopUp(false);
    });
  }

}
