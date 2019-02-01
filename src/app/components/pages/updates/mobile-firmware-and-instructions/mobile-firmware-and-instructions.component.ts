import {Component, Input} from '@angular/core';
import {FirmwareOrFileModel} from '../../../../models/firmwareOrFile.model';

@Component({
  selector: 'app-mobile-firmware-instruction',
  templateUrl: './mobile-firmware-and-instructions.component.html'
})
export class MobileFirmwareAndInstructionsComponent {
  @Input() items: FirmwareOrFileModel[];
}
