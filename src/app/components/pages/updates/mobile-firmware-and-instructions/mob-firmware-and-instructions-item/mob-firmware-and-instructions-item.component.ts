import {Component, Input, OnInit} from '@angular/core';
import {FirmwareOrFileModel} from '../../../../../models/firmwareOrFile.model';
import {DeviceService} from '../../../../../services/device.service';
import {Language} from '../../../../../utils/language';
import {StaticData} from '../../../../../utils/static-data';

@Component({
  selector: 'app-mob-firmware-and-instructions-item',
  templateUrl: './mob-firmware-and-instructions-item.component.html',
  styleUrls: ['./mob-firmware-and-instructions-item.component.css']
})
export class MobFirmwareAndInstructionsItemComponent implements OnInit {
  @Input() item: FirmwareOrFileModel;
  deviceType: string;
  arrayOfDeviceTypes;
  isFirmware: boolean;
  description: string;

  constructor(private deviceService: DeviceService) {
    this.checkIsFirmware(this.deviceService.isFirmwareFlag);
    this.deviceService.isFirmware.subscribe((data: boolean) => {
      this.checkIsFirmware(data);
    });
  }

  ngOnInit() {
    console.log(this.item);
    this.arrayOfDeviceTypes = StaticData.DeviceTypesInfo;
    for (let i = 0; i < this.arrayOfDeviceTypes.length; i++) {
      if (this.arrayOfDeviceTypes[i].value === this.item['deviceType']) {
        this.deviceType = this.arrayOfDeviceTypes[i].name;
      }
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

  checkIsFirmware(data) {
    this.isFirmware = data;
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
    anchor.click();
  }

}
