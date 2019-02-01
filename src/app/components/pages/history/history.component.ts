import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {DeviceService} from '../../../services/device.service';
import {StaticData} from "../../../utils/static-data";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
  arrayOfData;
  isMobileSize: boolean;
  subscription;

  constructor(private service: DeviceService) {
    this.isMobileSize = false;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
  }

  ngOnInit(): void {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
    this.subscription = this.service.getHistory().subscribe(items => this.arrayOfData = items);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

