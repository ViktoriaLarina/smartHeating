import {Component, Input, OnInit} from '@angular/core';
import {DeviceTypesInfoModel} from '../../../../../models/DeviceTypesInfo.model';
import {FirmwareOrFileModel} from '../../../../../models/firmwareOrFile.model';
import {DeviceService} from '../../../../../services/device.service';
import {Language} from '../../../../../utils/language';
import {StaticData} from '../../../../../utils/static-data';

@Component({
  selector: '[app-desktop-firmware-and-instructions-item]',
  templateUrl: './desktop-firmware-and-instructions-item.component.html',
  styleUrls: ['./desktop-firmware-and-instructions-item.component.css']
})
export class DesktopFirmwareAndInstructionsItemComponent implements OnInit {
  @Input() item: FirmwareOrFileModel;
  deviceType: string;
  isFirmware: boolean;
  description: string;
  constructor(private deviceService: DeviceService) {
    this.checkIsFirmware(this.deviceService.isFirmwareFlag);
    this.deviceService.isFirmware.subscribe((data: boolean) => {
      this.checkIsFirmware(data);
    });
  }

  checkIsFirmware(data) {
    this.isFirmware = data;
  }

  ngOnInit() {

    const found = StaticData.DeviceTypesInfo.find((item: DeviceTypesInfoModel) => item.value === this.item.deviceType.toString());
    if (found) {
      this.deviceType = found.name;
    }
    this.description = this.findDescription();
  }

  findDescription() {
    const lang = Language.getLang();
    const temp = this.item.descriptions.find((item) => item.locale.toString() === lang);
    if (temp) {
      return temp.text;
    }
    return '';
  }

  downloadFile() {
    if (this.isFirmware) {
      this.deviceService.downloadUpdates(this.item.id).subscribe((data: Response) => this.downloadBlob(data));

    } else {
      this.deviceService.downloadFile(this.item.id).subscribe((data: Response) => this.downloadBlob(data));

    }
  }

  downloadBlob(data: Response) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    const blobURL = (window.URL || window['webkitURL']).createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.item.name;
    anchor.href = blobURL;
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobURL);
    }, 0);
  }

}
