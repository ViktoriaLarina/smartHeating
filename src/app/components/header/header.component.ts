import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { NavigationStart, Router } from '@angular/router';

import * as moment from 'moment';

import { UsersDataOut } from '../../models/dataOut/dataOut.model';
import { StaticdataLanguages } from '../../models/staticdata-languages.model';

import { DeviceService } from '../../services/device.service';
import { InteractionsService } from '../../services/interactions.service';
import { UsersService } from '../../services/users.service';

import { AddDeviceComponent } from '../pages/devices/add-device/add-device.component';
import { AddUserComponent } from '../pages/users/add-user/add-user.component';
import { UserEditComponent } from '../pages/users/edit-user/user-edit.component';
import { PopupSuccessUpdateProfileComponent } from '../pop-up/popup-success-update-profile/popup-success-update-profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

import { AddUserModel } from '../../models/addUser.model';
import { BaseDeviceModel } from '../../models/baseDevice/baseDevice.model';
import { Language } from '../../utils/language';
import { RegExpData } from '../../utils/reqexp_data';
import { StaticData } from '../../utils/static-data';
import { confirmPasswordValidator } from '../../validators/ConfirmPasswordValidator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('dateInput', {read: ElementRef}) dateInput: ElementRef;

  currentPage: string;
  supportRout: string;
  index: number;
  contactMenuIndex: number;
  isMobileMenuShown: boolean;
  isMobileSize: boolean;
  showMobileRegistrationUser: boolean;
  showMobileMyProfile: boolean;
  profileInfo: UsersDataOut;
  minDate: Date;
  maxDate: Date;
  startDate: moment.Moment;
  emailAlreadyTaken: boolean;
  phoneAlreadyTaken: boolean;
  hasEmptyFields: boolean;
  error: boolean;
  indexShowMyprofile: boolean;
  oldDataMyProfile: object;
  locale: string;
  arrayOfLanguages: StaticdataLanguages[];

  myProfile: FormGroup = new FormGroup({
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
  confirmPasswordControl = new FormControl('', confirmPasswordValidator(this.passwordControl));

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(RegExpData.MIN_LENGTH_PASSWORD)
    ]),
    password: this.passwordControl,
    confirmPassword: this.confirmPasswordControl
  });

  constructor(public dialog: MatDialog,
              private serviceUser: UsersService,
              public rout: Router,
              private serviceDevice: DeviceService,
              private serviseInteractions: InteractionsService) {

    const temp = StaticData.Routs.find((item) => item.name === 'isSupportPage');
    if (temp) {
      this.supportRout = temp.path;
      console.log(this.supportRout);
    }

    this.arrayOfLanguages = StaticData.Languages;
    this.setLanguageSite();
    this.error = false;
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - StaticData.MIN_AGE);
    this.minDate = StaticData.MIN_DATE;
    rout.events.filter((event) => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        this.showMobileMenu();
        this.showMobileMyProfile = false;
        this.SetNavigationState(event.url);
      });
    this.SetNavigationState(rout.url);

    this.index = 1;
    this.isMobileMenuShown = false;
    this.showMobileRegistrationUser = false;
    this.contactMenuIndex = 1;
    this.isMobileSize = false;
    this.indexShowMyprofile = true;
    this.serviseInteractions.showMobileMyProfile.subscribe((show: boolean) => {
      this.showMobileMyProfile = show;
      this.indexShowMyprofile = show;
      if (show) {
        this.createFormGroup();
        this.hasEmptyFields = false;
        this.emailAlreadyTaken = false;
        this.phoneAlreadyTaken = false;
      }
    });

    const self = this;
    this.serviseInteractions.showPageContact.subscribe((show: boolean) => self.contactMenuIndex = show ? 1 : 2);

    this.passwordControl.valueChanges.subscribe((data) => {
      this.confirmPasswordControl.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.isMobileSize = document.body.clientWidth > StaticData.MOBILE_CLIENT_WIDTH;
    this.serviseInteractions.mobileMenuState.subscribe((show: boolean) => this.isMobileMenuShown = show);
    this.getMyProfileInfo();
  }

  // ------language of site
  setLanguageSite() {
    this.locale = Language.getLang();
    if (!this.locale) {
      this.locale = StaticData.Languages[0].value;
    }
  }

  onChange(language: number) {
    this.serviceUser.sendLang(language);
    Language.saveLang(StaticData.Languages[language].value);
  }

  // ------language of site end

  getMyProfileInfo() {
    this.serviceUser.getInfoMyProfile().subscribe((data: UsersDataOut) => {
      this.profileInfo = data;
      this.startDate = moment(this.profileInfo.birthday, RegExpData.DATE_FORMAT);
      this.oldDataMyProfile = {
        firstName: data['firstName'],
        lastName: data['lastName'],
        login: data['login'],
        email: data['email'],
        birthday: moment(data['birthday'], RegExpData.DATE_FORMAT),
        phone: data['phone']
      };
    });
  }

  createFormGroup() {
    this.myProfile = new FormGroup({
      firstName: new FormControl(this.profileInfo.firstName, [
        Validators.required,
        Validators.pattern(RegExpData.NAME_VALIDATOR)
      ]),
      lastName: new FormControl(this.profileInfo.lastName, [
        Validators.required,
        Validators.pattern(RegExpData.SURNAME_VALIDATOR)
      ]),
      email: new FormControl(this.profileInfo.email),
      birthday: new FormControl(this.startDate),
      phone: new FormControl(this.profileInfo.phone, [
        Validators.required,
        Validators.pattern(RegExpData.PHONE_VALIDATOR_3)
      ])
    });
  }

  closeMyProfile() {
    this.showMobileMyProfile = false;
    this.serviseInteractions.showMobileMyProfile.next(false);
  }

  backTofirstPage() {
    this.hasEmptyFields = false;
    this.indexShowMyprofile = true;
    this.createFormGroup();
    this.changePasswordForm.reset();
  }

  showContactsContent(condition) {
    this.serviseInteractions.showPageContact.next(condition);
  }

  showMobileMenu() {
    this.isMobileMenuShown = !this.isMobileMenuShown;
    this.serviseInteractions.mobileMenuState.next(this.isMobileMenuShown);
  }

  openDialogAddDevice(): void {
    this.serviseInteractions.showMobileMyProfile.next(false);
    const dialogRef = this.dialog.open(AddDeviceComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      return result;
    });
  }

  openDialogProfile() {
    const dialogRef = this.dialog.open(MyProfileComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
  }

  openDialogAddUserForOwner(): void {
    this.serviseInteractions.showMobAddUser.next(true);
    this.serviseInteractions.showMobileMyProfile.next(false);
    this.serviseInteractions.showMobEditUser.next(false);
    this.serviceDevice.getOwnedDevices().subscribe((data: BaseDeviceModel[]) => {
      if (data.length > 0) {
        this.openMatDialog(true);
      } else {
        this.openMatDialog(false);
      }
    });

  }

  openMatDialog(isDeviceFound?) {
    const data = new AddUserModel();
    data.isDeviceFound = isDeviceFound;
    const dialogRef = this.dialog.open(AddUserComponent, {
      disableClose: true,
      data
    } as MatDialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openEditUsersPermissionDialog(result);
      }
    });
  }

  openEditUsersPermissionDialog(user): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      disableClose: true,
      data: {
        user
      }
    } as MatDialogConfig);
    dialogRef.afterClosed().subscribe();
  }

  showDevicesByFilter(stateString) {
    this.serviceDevice.setStateActive(stateString);
    this.serviceDevice.getDevices();
  }
  logout() {
    this.serviceUser.logout();
  }

  private SetNavigationState(url: string) {

    const temp = StaticData.Routs.find((item) => item.path === url);
    if (temp) {
      this.currentPage = temp.name;
    }
  }

  // -------------------------------------------------------------------------editMyProfile---------------
  getDateStringValidator(pattern: string): ValidatorFn {
    const input = this.dateInput;
    return (control: FormControl): ValidationErrors => {
      if (input && input.nativeElement.value.match(pattern)) {
        return null;
      }
      return {invalid: true};
    };
  }

  updateMyProfile() {
    this.hasEmptyFields = false;
    for (const key in this.myProfile.controls) {
      if (this.myProfile.controls.hasOwnProperty(key)) {
        const control = this.myProfile.controls[key];
        control.markAsTouched();
        control.markAsDirty();
        this.hasEmptyFields = !control.value || this.hasEmptyFields;
      }
    }
    this.myProfile.updateValueAndValidity();
    if (!this.myProfile.valid) {
      return;
    }
    const DataToSend = {};
    let hasChanges = false;
    for (const key in this.myProfile.controls) {
      if (this.myProfile.controls.hasOwnProperty(key)) {
        if (key === 'birthday') {
          if (this.oldDataMyProfile[key].diff(this.myProfile.controls[key].value) !== 0) {
            hasChanges = true;
          }
        } else if (this.oldDataMyProfile[key] !== this.myProfile.controls[key].value) {
          hasChanges = true;
        }
        DataToSend[key] = this.myProfile.controls[key].value;
      }
    }
    if (!hasChanges) {
      return;
    }
    DataToSend['birthday'] = DataToSend['birthday'].format(RegExpData.DATE_FORMAT);
    this.serviceUser.updateMyInfo(DataToSend).subscribe(() => {
      this.ShowPopUp(true);
      this.getMyProfileInfo();
    }, (error) => {
      this.ShowPopUp(false);
      this.getMyProfileInfo();
    });
  }

  sendNewPassword() {
    this.hasEmptyFields = false;
    for (const key in this.changePasswordForm.controls) {
      if (this.changePasswordForm.controls.hasOwnProperty(key)) {
        const control = this.changePasswordForm.controls[key];
        control.markAsTouched();
        control.markAsDirty();
        this.hasEmptyFields = !control.value || this.hasEmptyFields;
      }
    }
    this.changePasswordForm.updateValueAndValidity();
    if (!this.changePasswordForm.valid) {
      return;
    }
    const DataToSend = {};
    DataToSend['oldPassword'] = this.changePasswordForm.value['oldPassword'];
    DataToSend['newPassword'] = this.changePasswordForm.value['password'];
    DataToSend['matchingPassword'] = this.changePasswordForm.value['confirmPassword'];
    this.serviceUser.updateMyPassword(DataToSend).subscribe((result) => {
      this.ShowPopUp(true);
    }, (error) => this.ShowPopUp(false));
    this.changePasswordForm.reset();
  }

  ShowPopUp(data): void {
    const dialogRef = this.dialog.open(PopupSuccessUpdateProfileComponent, {
      data
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  changePage() {
    this.indexShowMyprofile = false;
    this.hasEmptyFields = false;
  }
}
