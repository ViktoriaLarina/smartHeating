import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {FirmwareOrFileModel} from '../../../models/firmwareOrFile.model';
import {Rout} from '../../../models/rout.model';
import {DeviceService} from '../../../services/device.service';
import {StaticData} from '../../../utils/static-data';

@Component({
  selector: 'app-firmware-and-instruction',
  templateUrl: './firmwareAndInstructions.component.html'
})
export class FirmwareAndInstructionsComponent implements OnInit, OnDestroy {

  instructionUrl: string;
  isMobileSize: boolean;
  dataArray: FirmwareOrFileModel[];
  subscription: Subscription;

  constructor(private deviceService: DeviceService, private rout: Router) {
  }

  @HostListener('window:resize')
  onResize() {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    this.isMobileSize = width >= StaticData.MOBILE_CLIENT_WIDTH;
  }

  ngOnInit(): void {

    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    this.isMobileSize = width >= StaticData.MOBILE_CLIENT_WIDTH;
    this.onRouteChange();
    this.subscription = this.rout.events.filter((event) => event instanceof NavigationStart).subscribe((event: NavigationStart) => {
      this.onRouteChange();
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onRouteChange() {

    const temp = StaticData.Routs.find((item: Rout) => item.name === 'instructionPage');
    if (temp) {
      this.instructionUrl = temp.path;
    }

    if (this.rout.url === this.instructionUrl) {
      this.deviceService.getFiles().subscribe((data: FirmwareOrFileModel[]) => {
        this.dataArray = data;
      });
      this.deviceService.isFirmware.next(false);
    } else {
      this.deviceService.getFirmwareUpdates().subscribe((data: FirmwareOrFileModel[]) => {
        this.dataArray = data;
      });
      this.deviceService.isFirmware.next(true);
    }
  }

}
