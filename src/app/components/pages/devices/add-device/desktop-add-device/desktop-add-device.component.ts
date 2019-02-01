import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DeviceRegistrationDTO} from '../../../../../models/dataOut/device-registrationDTO';
import {Place} from '../../../../../models/places.model';
import {DeviceService} from '../../../../../services/device.service';
import {RegExpData} from '../../../../../utils/reqexp_data';
import {StaticData} from '../../../../../utils/static-data';
import {BaseDeviceModel} from '../../../../../models/baseDevice/baseDevice.model';

@Component({
  selector: 'app-desktop-add-device',
  templateUrl: './desktop-add-device.component.html',
  styleUrls: ['./desktop-add-device.component.css']
})
export class DesktopAddDeviceComponent {

  arrayOfPlaces: Place[];
  slidePage: number;
  pagesCount: number;
  isLoading = false;
  hasEmptyFields = false;
  isGoodRequestResult: boolean;
  isBadRequestResult: boolean;
  isTypeSelect: boolean;
  selectType: string;
  isHideForm: boolean;
  deviceRegistrationDto = new DeviceRegistrationDTO();
  placeType: string;

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
              public dialogRef: MatDialogRef<DesktopAddDeviceComponent>,
              public dialog: MatDialog) {
    this.slidePage = 1;
    this.pagesCount = 3;
    this.isTypeSelect = false;
    this.arrayOfPlaces = StaticData.Places;
  }

  prevPage() {
    if (this.slidePage > 1) {
      this.slidePage--;
    }
  }

  nextPage() {
    if (this.slidePage < this.pagesCount) {
      this.slidePage++;
    }
    if (this.slidePage === 3) {
      const found = this.arrayOfPlaces.find((item: Place) => item.value === this.selectType);
      if (found) {
        this.placeType = found.name;
      }
    }
  }

  checkIsDeviceWait() {
    this.hasEmptyFields = false;
    for (const key in this.newDevice.controls) {
      if (this.newDevice.hasOwnProperty(key)) {
        const control = this.newDevice.controls[key];
        control.markAsTouched();
        control.markAsDirty();
        this.hasEmptyFields = !control.value || this.hasEmptyFields;
      }
    }
    if (!this.newDevice.valid) {
      this.hasEmptyFields = true;
      return;
    }
    this.isBadRequestResult = false;
    this.isLoading = true;
    this.service.getIsDeviceReadyStatus(this.newDevice.controls['deviceId'].value).subscribe((result) => {
        this.successRegistration();
      }
      , (error2) => {
        this.isBadRequestResult = true;
        this.isLoading = false;
      });
  }

  createDto() {
    if (!this.selectType) {
      this.isTypeSelect = true;
    }
    this.hasEmptyFields = false;
    for (const key in this.newDeviceInfo.controls) {
      const control = this.newDeviceInfo.controls[key];
      control.markAsTouched();
      control.markAsDirty();
      this.hasEmptyFields = !control.value || this.hasEmptyFields;
    }
    this.hasEmptyFields = !this.selectType || this.hasEmptyFields;
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

    this.nextPage();
  }

  registrationNewDevice() {
    this.service.addDevice(this.deviceRegistrationDto).subscribe((data: BaseDeviceModel) => {
      this.closeDialogProfile();
      this.service.getDevices();
    }, (error2) => {
      this.closeDialogProfile();
    });
  }

  successRegistration() {
    this.isLoading = false;
    this.isGoodRequestResult = true;
    this.nextPage();
    this.isGoodRequestResult = false;
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }
}
