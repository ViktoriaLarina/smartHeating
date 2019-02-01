import { Component, Input, OnInit } from '@angular/core';

import { WaitingDeviceModel } from '../../../../models/waitingDevice.model';

@Component({
  selector: 'app-waiting-device-item',
  templateUrl: './waiting-device-item.component.html',
  styleUrls: ['./waiting-device-item.component.css']
})
export class WaitingDeviceItemComponent implements OnInit {

  @Input() device: WaitingDeviceModel;

  constructor() { }

  ngOnInit() {
  }

}
