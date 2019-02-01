import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-device-item-type3',
  templateUrl: './device-item-type3.component.html',
  styleUrls: ['./device-item-type3.component.css']
})
export class DeviceItemType3Component implements OnInit {

  state: boolean = true;
  isWaitingBtn: boolean = false;
  error: any;

  constructor() {
  }

  ngOnInit() {
  }

  openDialogSettings() {

  }

  changeDeviceSetate() {
    this.state = !this.state;
  }

}
