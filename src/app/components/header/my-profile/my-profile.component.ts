import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {UsersService} from '../../../services/users.service';
import {confirmPasswordValidator} from '../../../validators/ConfirmPasswordValidator';
import * as moment from 'moment';
import {PopupSuccessUpdateProfileComponent} from '../../pop-up/popup-success-update-profile/popup-success-update-profile.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  @ViewChild('dateInput', {read: ElementRef}) dateInput: ElementRef;

  profileInfo;
  minDate = new Date(1920, 0, 1);
  maxDate;
  startDate;
  oldDataMyProfile: object;
  phoneAlreadyTaken: boolean;
  hasEmptyFields: boolean;
  hasEmptyFieldsPassword: boolean;
  // selectPhone: any;
  error = false;
  // arrayOfPhone: Array<object>;
  index: number;
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
    Validators.minLength(5),
    Validators.pattern('^[A-Za-z0-9 !?@#$%^&_+*=\\-.,:;~(){}\\[\\]«»]{5,18}$')
  ]);
  confirmPasswordControl = new FormControl('', confirmPasswordValidator(this.passwordControl));

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: this.passwordControl,
    confirmPassword: this.confirmPasswordControl,
  });

  constructor(public dialogRef: MatDialogRef<MyProfileComponent>,
              private userService: UsersService,
              public dialog: MatDialog) {
    this.maxDate = new Date();
    this.maxDate.setYear(this.maxDate.getFullYear() - 16);
    this.passwordControl.valueChanges.subscribe(data => {
      this.confirmPasswordControl.updateValueAndValidity();
    });
    this.hasEmptyFields = false;
    this.phoneAlreadyTaken = false;
    this.index = 1;
  }

  ngOnInit() {
    this.getMyProfileInfo();
  }

  getMyProfileInfo() {
    this.userService.getInfoMyProfile().subscribe(data => {
      this.profileInfo = data;
      this.startDate = moment(this.profileInfo.birthday, 'YYYY-MM-DD');
      this.oldDataMyProfile = {
        firstName: data['firstName'],
        lastName: data['lastName'],
        email: data['email'],
        birthday: moment(data['birthday'], 'YYYY-MM-DD'),
        phone: data['phone']
      };
      this.myProfile = new FormGroup({
        firstName: new FormControl(this.profileInfo.firstName, [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я]{2,25}$')]),
        lastName: new FormControl(this.profileInfo.lastName, [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я]{3,35}$')]),
        email: new FormControl(this.profileInfo.email, [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]),
        birthday: new FormControl(this.startDate, Validators.required),
        phone: new FormControl(this.profileInfo.phone, [Validators.required, Validators.pattern('^[0-9()+-]{10,20}$')]),
      });
    });
  }

  showEditProfile(index) {
    this.index = index;
    if (index === 1) {
      this.getMyProfileInfo();
      this.changePasswordForm.reset();
      this.hasEmptyFieldsPassword = false;
    } else {
      this.hasEmptyFields = false;
    }
  }

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
    if (this.index === 1) {
    this.hasEmptyFields = false;
    for (const key in this.myProfile.controls) {
      const control = this.myProfile.controls[key];
      control.markAsTouched();
      control.markAsDirty();
      this.hasEmptyFields = !control.value || this.hasEmptyFields;
    }
    this.myProfile.updateValueAndValidity();
    if (!this.myProfile.valid) {
      return;
    }
    const DataToSend = {};
      let hasChanges = false;
      for (const key in this.myProfile.controls) {
        if (key === 'birthday') {
          if (this.oldDataMyProfile[key].diff(this.myProfile.controls[key].value) !== 0) {
            hasChanges = true;
          }
        } else if (this.oldDataMyProfile[key] !== this.myProfile.controls[key].value) {
          hasChanges = true;
        }
        DataToSend[key] = this.myProfile.controls[key].value;
      }
      if (!hasChanges) {
        return;
      }
      DataToSend['birthday'] = moment(DataToSend['birthday']).format('YYYY-MM-DD');
    this.userService.updateMyInfo(DataToSend).subscribe(() => {
      this.getMyProfileInfo();
      this.ShowPopUp(true);
    }, error2 => {
      this.getMyProfileInfo();
      this.ShowPopUp(false);
    });
    }
  }

  sendNewPassword() {
    if (this.index === 2) {
      this.hasEmptyFieldsPassword = false;
      for (const key in this.changePasswordForm.controls) {
        const control = this.changePasswordForm.controls[key];
        control.markAsTouched();
        control.markAsDirty();
        this.hasEmptyFieldsPassword = !control.value || this.hasEmptyFieldsPassword;
      }
      this.changePasswordForm.updateValueAndValidity();
      if (!this.changePasswordForm.valid) {
        return;
      }
        const DataToSend = {};
        DataToSend['oldPassword'] = this.changePasswordForm.value['oldPassword'];
        DataToSend['newPassword'] = this.changePasswordForm.value['password'];
        DataToSend['matchingPassword'] = this.changePasswordForm.value['confirmPassword'];
        this.userService.updateMyPassword(DataToSend).subscribe(() => {
          this.ShowPopUp(true);
        }, error2 => this.ShowPopUp(false));
    this.changePasswordForm.reset();
    }
  }

  ShowPopUp(data): void {
    const dialogRef = this.dialog.open(PopupSuccessUpdateProfileComponent, <any> {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }



  closeDialogProfile() {
    this.dialogRef.close();
  }
}
