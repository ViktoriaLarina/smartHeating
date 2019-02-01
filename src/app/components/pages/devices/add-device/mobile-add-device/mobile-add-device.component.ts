import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DeviceRegistrationDTO} from '../../../../../models/dataOut/device-registrationDTO';
import {Place} from '../../../../../models/places.model';
import {DeviceService} from '../../../../../services/device.service';
import {RegExpData} from '../../../../../utils/reqexp_data';
import {StaticData} from '../../../../../utils/static-data';
import {PopupSuccessUpdateProfileComponent} from '../../../../pop-up/popup-success-update-profile/popup-success-update-profile.component';
import {BaseDeviceModel} from '../../../../../models/baseDevice/baseDevice.model';

@Component({
  selector: 'app-mobile-add-device',
  templateUrl: './mobile-add-device.component.html',
  styleUrls: ['./mobile-add-device.component.css']
})
export class MobileAddDeviceComponent {

  isShowLoader: boolean;
  isShowSuccess: boolean;
  isShowError: boolean;
  isButtonClick: boolean;
  hasEmptyFields = false;
  isTypeSelect: boolean;
  arrayOfPlaces: Place[];
  selectType: string;
  currentPage: number;
  deviceRegistrationDto = new DeviceRegistrationDTO();

  newDevice = new FormGroup({
    deviceId: new FormControl('', [Validators.required, Validators.pattern(RegExpData.DEVICE_ID)])
  });

  newDeviceInfo = new FormGroup({
    name: new FormControl('', Validators.required),
    square: new FormControl('', Validators.required),
    burnerAndPower: new FormControl('', Validators.required),
    boilerAndPower: new FormControl('', Validators.required)
  });

  constructor(private service: DeviceService,
              public dialogRef: MatDialogRef<MobileAddDeviceComponent>,
              public dialog: MatDialog) {
    this.selectType = '';
    this.currentPage = 1;
    this.isShowLoader = false;
    this.isShowSuccess = false;
    this.isShowError = false;
    this.isButtonClick = false;
    this.arrayOfPlaces = StaticData.Places;
  }

  checkIsDeviceWait() {
    this.isButtonClick = true;
    this.newDevice.updateValueAndValidity();
    if (!this.newDevice.valid) {
      return;
    }
    this.isShowLoader = true;
    this.service.getIsDeviceReadyStatus(this.newDevice.controls['deviceId'].value).subscribe((data) => {
        this.SuccessRegistration();
    }, error2 => {
      this.isShowLoader = false;
    });
  }

  registrationNewDevice() {
    if (!this.selectType) {
      this.isTypeSelect = true;
    }
    this.hasEmptyFields = false;
    for (const key in this.newDeviceInfo.controls) {
      if (this.newDeviceInfo.hasOwnProperty(key)) {
        const control = this.newDeviceInfo.controls[key];
        control.markAsTouched();
        control.markAsDirty();
        this.hasEmptyFields = !control.value || this.hasEmptyFields;
      }
    }
    this.hasEmptyFields = !this.selectType || this.hasEmptyFields;

    if (this.selectType) {
      this.isTypeSelect = false;
    }
    this.newDeviceInfo.updateValueAndValidity();
    if (!this.newDeviceInfo.valid || !this.selectType) {
      return;
    }

    this.deviceRegistrationDto.deviceId = this.newDevice.controls['deviceId'].value;
    this.deviceRegistrationDto.name = this.newDeviceInfo.controls['name'].value;
    this.deviceRegistrationDto.burnerAndPower = this.newDeviceInfo.controls['burnerAndPower'].value;
    this.deviceRegistrationDto.boilerAndPower = this.newDeviceInfo.controls['boilerAndPower'].value;
    this.deviceRegistrationDto.houseType = this.selectType;
    this.deviceRegistrationDto.square = this.newDeviceInfo.controls['square'].value;

    this.service.addDevice(this.deviceRegistrationDto).subscribe((data: BaseDeviceModel) => {
      this.ShowPopUp(true);
      this.closeDialogProfile();
      this.service.getDevices();
    }, (error2) => {
      this.ShowPopUp(false);
      this.closeDialogProfile();
    });
  }

  ShowPopUp(data): void {
    const dialogRef = this.dialog.open(PopupSuccessUpdateProfileComponent, {data} as any);
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  SuccessRegistration() {
    this.isShowSuccess = true;
    this.currentPage = 3;
  }

  // BadRegistration() {
  //   this.isShowLoader = false;
  //   this.isShowError = true;
  // }

  closeDialogProfile() {
    this.dialogRef.close();
  }
}
