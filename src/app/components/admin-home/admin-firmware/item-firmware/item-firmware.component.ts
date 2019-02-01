import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';

import * as moment from 'moment';

import { Languages } from '../../../../utils/enums/languagesEnum.model';
import {DeviceTypesInfoModel} from '../../../../models/DeviceTypesInfo.model';
import {FirmwareOrFileModel} from '../../../../models/firmwareOrFile.model';
import {AdminPageService} from '../../../../services/admin-page.service';
import {DeviceService} from '../../../../services/device.service';
import {StaticData} from '../../../../utils/static-data';
import {PopupSuccessUpdateProfileComponent} from '../../../pop-up/popup-success-update-profile/popup-success-update-profile.component';
import {PopupVerificationDeleteComponent} from '../../../pop-up/popup-verification-delete/popup-verification-delete.component';


@Component({
  selector: '[app-item-firmware]',
  templateUrl: './item-firmware.component.html',
  styleUrls: ['./item-firmware.component.css']
})
export class ItemFirmwareComponent implements OnInit {
  @Input() item: FirmwareOrFileModel;
  @Input() isFirmware: boolean;
  confirm: boolean;
  display: boolean;
  changeDateFormat: any;
  typesDevices: DeviceTypesInfoModel[];
  selectType: string;

  editFirmware = new FormGroup({});

  constructor(public dialog: MatDialog,
              private service: AdminPageService,
              private deviceService: DeviceService) {
    this.confirm = false;
    this.typesDevices = StaticData.DeviceTypesInfo;
  }

  ngOnInit() {
    this.changeDateFormat = moment(this.item.dateCreation, 'DD.MM.YYYY').toDate();
    this.editFirmware = new FormGroup({
      name: new FormControl(this.item.name),
      editDescriptionRu: new FormControl( this.findDescription('ru') ),
      editDescriptionEn: new FormControl( this.findDescription('en') )
    });
    const device = StaticData.GetDeviceTypeInfo(this.item.deviceType);
    this.selectType = device ? device.name : null;   // TODO delete
    if (this.isFirmware) {
      this.display = this.item.show;
    } else {
      this.display = this.item.showInstruction;
    }
  }

  findDescription(lang: string) {
    const temp = this.item.descriptions.find((item) => item.locale.toString() === lang);
    if (temp) {
      return temp.text;
    }
    return '';
  }

  loadFirmware() {
    if (this.isFirmware) {
      this.deviceService.downloadUpdates(this.item.id).subscribe((data) => this.downloadBlob(data));
    } else {
      this.deviceService.downloadFile(this.item.id).subscribe((data) => this.downloadBlob(data));
    }
  }

  downloadBlob(data: Response) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    const blobURL = (window.URL || window['webkitURL']).createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.item.name;
    anchor.href = blobURL;
    anchor.click();
  }

  changeParamShowFirmwareForOwners() {
    if (this.isFirmware) {
      this.service.changeParamShowFirmwareForOwners(!this.display, this.item.id).subscribe((data) => {
        this.display = data['show'];
      });
    } else {
      this.service.changeParamShowInstruction(!this.display, this.item.id).subscribe((data) => {
        this.display = data['showInstruction'];
      });
    }
  }

  openDialogVerification(): void {
    const dialogRef = this.dialog.open(PopupVerificationDeleteComponent, {
      disableClose: true,
      data: {}
    } as any);
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.isFirmware) {
        this.service.removeFirmware(this.item.id);
      } else {
        this.service.removeInstruction(this.item.id);
      }
    });
  }

  saveChangeDescription() {
    const fileObject = (document.getElementById('file') as HTMLInputElement).files[0];
    if (this.editFirmware.valid && this.editFirmware.dirty) {
      this.editFirmware.markAsPristine();
      this.item['name'] = this.editFirmware.controls['name'].value;

      this.item.descriptions = [
        {
          locale: Languages.ru,
          text: this.editFirmware.controls['editDescriptionRu'].value
        },
        {
          locale: Languages.en,
          text: this.editFirmware.controls['editDescriptionEn'].value
        }
      ];

      if (this.isFirmware) {
        this.service.updateFirmware(this.item).subscribe((data) => {
          this.ShowPopUp(true);
          this.service.findAllFirmwares();
        }, (error2) => {
          this.ShowPopUp(false);
        });
      } else {
        this.service.updateInstruction(this.item).subscribe((data) => {
          this.ShowPopUp(true);
          this.service.findAllInstructions();
        }, (error2) => {
          this.ShowPopUp(false);
        });
      }

    }
    if (fileObject && this.isFirmware) {
      this.service.uploadFirmwareFile(fileObject, this.item.id).subscribe((data) => {
        this.ShowPopUp(true);
        this.service.findAllFirmwares();
      }, (error2) => {
        this.ShowPopUp(false);
      });
    } else if (fileObject && !this.isFirmware) {
      this.service.uploadInstructionFile(fileObject, this.item.id).subscribe((data) => {
        this.ShowPopUp(true);
        this.service.findAllInstructions();
      }, (error2) => {
        this.ShowPopUp(false);
      });
    }
  }

  ShowPopUp(data): void {
    const dialogRef = this.dialog.open(PopupSuccessUpdateProfileComponent, {
      data
    } as any);

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
