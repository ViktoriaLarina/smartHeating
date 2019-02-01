import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog} from '@angular/material';
import { Router} from '@angular/router';

import * as moment from 'moment';

import {Subscription} from 'rxjs/Subscription';
import { Languages } from '../../../utils/enums/languagesEnum.model';
import { FirmwareOrFileDTOModel } from '../../../models/dataOut/firmwareOrFileDTO.model';
import {DeviceTypesInfoModel} from '../../../models/DeviceTypesInfo.model';
import {FirmwareOrFileModel} from '../../../models/firmwareOrFile.model';
import {Rout} from '../../../models/rout.model';
import {AdminPageService} from '../../../services/admin-page.service';
import {Helper} from '../../../utils/helper';
import {StaticData} from '../../../utils/static-data';
import {PopupSuccessComponent} from '../../pop-up/popup-success/popup-success.component';


@Component({
  selector: 'app-admin-firmware',
  templateUrl: './admin-firmware.component.html',
  styleUrls: ['./admin-firmware.component.css']
})
export class AdminFirmwareComponent implements OnInit, OnDestroy {
  items: FirmwareOrFileModel[];
  dto = new FirmwareOrFileDTOModel();
  currentPage: number;
  isMobileSize: boolean;
  selectType: any;
  isErrorBlockShow: boolean;
  typesDevices: DeviceTypesInfoModel[];
  isServerError: boolean;
  isCheckboxChecked: boolean;
  isFirmware: boolean;
  isSortList: boolean;
  sortBy: string;
  isUp: boolean;
  adminFirmwareUrl: string;
  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;

  newFirmware = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    version: new FormControl(''),
    descriptionRu: new FormControl(''),
    descriptionEn: new FormControl('')
  });

  static AnyOfArrayValidator(formArray: FormArray) {
    return formArray.value.some((item) => item)
      ? true
      : {invalid: true};
  }

  constructor(public dialog: MatDialog, private service: AdminPageService, private rout: Router) {
    this.sortBy = 'file';
    this.isUp = false;
    this.isCheckboxChecked = false;
    this.currentPage = 1;
    this.isServerError = false;
    this.typesDevices = StaticData.DeviceTypesInfo;
  }

  ngOnInit(): void {
    this.onRouteChange();
    this.isSortList = false;
  }

  ngOnDestroy() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
    if (this.subscription3) {
      this.subscription3.unsubscribe();
    }
    if (this.subscription4) {
      this.subscription4.unsubscribe();
    }
  }

  onRouteChange() {

    const temp = StaticData.Routs.find((item: Rout) => item.name === 'adminFirmwarePage');
    if (temp) {
      this.adminFirmwareUrl = temp.path;
    }

    if (this.rout.url === this.adminFirmwareUrl) {
      this.isFirmware = true;
      this.subscription1 = this.service.firmwareArray.subscribe((data: FirmwareOrFileModel[]) => {
        this.items = data;
      });
      this.service.findAllFirmwares();

      this.subscription3 = this.service.deletedFirmware.subscribe((data: boolean) => {
        if (data) {
          this.service.findAllFirmwares();
        }
      });
    } else {
      this.subscription2 = this.service.instructionArray.subscribe((data: FirmwareOrFileModel[]) => {
        this.items = data;
      });
      this.service.findAllInstructions();

      this.subscription4 = this.service.deletedFileInstruction.subscribe((data: boolean) => {
        if (data) {
          this.service.findAllInstructions();
        }
      });
    }
  }

  sendData() {
    this.isServerError = false;
    const fileObject = (document.getElementById('addInstructionFile') as HTMLInputElement).files[0];
    this.isErrorBlockShow = false;
    this.newFirmware.updateValueAndValidity();
    if (!this.newFirmware.valid || !fileObject) {
      this.isErrorBlockShow = true;
    } else {
      const versionToDate = this.newFirmware.controls['version'].value ? moment(this.newFirmware.controls['version'].value).format('YYYY-MM-DD') : null;
      this.dto.descriptions = [
        {
          locale: Languages.ru,
          text: this.newFirmware.controls['descriptionRu'].value
        },
        {
          locale: Languages.en,
          text: this.newFirmware.controls['descriptionEn'].value
        }
      ];

      this.dto.deviceType = this.selectType;
      this.dto.name = this.newFirmware.controls['name'].value;
      console.log(this.dto);
      if (this.isFirmware) {
        this.dto.show = this.isCheckboxChecked;
        this.dto.version = versionToDate;
        this.service.createFirmware(this.dto).subscribe((data: FirmwareOrFileModel) => {
          this.service.uploadFirmwareFile(fileObject, data.id).subscribe((response: Response) => {
            this.newFirmware.reset();
            this.openDialogVerification();
            this.service.findAllFirmwares();
          }, (error) => { // TODO: delete and add server code
            this.isServerError = true;
          });
        });
      } else {
        this.dto.showInstruction = this.isCheckboxChecked;
        this.service.createInstruction(this.dto).subscribe((data: FirmwareOrFileModel) => {
          this.service.uploadInstructionFile(fileObject, data.id).subscribe((response: Response) => {
            this.newFirmware.reset();
            this.openDialogVerification();
            this.service.findAllInstructions();
          }, (error) => {  // TODO: delete and add server code
            this.isServerError = true;
          });
        });
      }

    }
  }

  setPage(pageNum: number) {
    if (pageNum === 1) {
      this.isCheckboxChecked = false;
    }
    this.currentPage = pageNum;
    this.newFirmware.reset();
    this.isErrorBlockShow = false;
    this.isServerError = false;
  }

  openDialogVerification(): void {
    const dialogRef = this.dialog.open(PopupSuccessComponent, {
      disableClose: true,
      data: {},
      panelClass: 'success-dialog'
    } as any);
    dialogRef.afterClosed().subscribe((result) => {
      return;
    });
  }

  sortByName(name: string) {
    this.isUp = false;
    this.isSortList = !this.isSortList;
    this.sortBy = name;
    if (this.isSortList) {
      this.items.sort(Helper.sortItems(name, this.isUp));
    } else {
      this.isUp = true;
      this.items.sort(Helper.sortItems(name, this.isUp));
    }
  }
}
