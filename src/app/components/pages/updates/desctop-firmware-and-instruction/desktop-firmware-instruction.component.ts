import { Component, Input, OnInit } from '@angular/core';
import {FirmwareOrFileModel} from '../../../../models/firmwareOrFile.model';
import { Helper } from '../../../../utils/helper';
import {Language} from '../../../../utils/language';

@Component({
  selector: 'app-desktop-firmware-instruction',
  templateUrl: './desktop-firmware-instruction.component.html',
  styleUrls: ['./desktop-firmware-instruction.component.css']
})
export class DesktopFirmwareAndInstructionsComponent implements OnInit {
  @Input() items: FirmwareOrFileModel[];

  sortfile: boolean;
  iconState: string;
  isUp: boolean;

  constructor() {
    this.iconState = 'name';
    this.isUp = false;
  }

  ngOnInit() {

    const lang = Language.getLang();
    this.sortfile = false;
    this.sortByName(this.iconState);
  }

  sortByName(name) {
    this.isUp = false;
    this.sortfile = !this.sortfile;
    this.iconState = name;
    if (this.sortfile) {
      this.items.sort(Helper.sortItems(name, this.isUp));
    } else {
      this.isUp = true;
      this.items.sort(Helper.sortItems(name, this.isUp));
    }
  }

}
