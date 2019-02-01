import { Component, OnInit } from '@angular/core';

import { WaitingDeviceModel } from '../../../models/waitingDevice.model';
import { AdminPageService } from '../../../services/admin-page.service';

@Component({
  selector: 'app-admin-waiting-devices',
  templateUrl: './admin-waiting-devices.component.html',
  styleUrls: ['./admin-waiting-devices.component.css']
})
export class AdminWaitingDevicesComponent implements OnInit {

  arrayOfWaitingDevices: WaitingDeviceModel[];

  constructor(private service: AdminPageService) {
    this.service.getWaitingDevices().subscribe((data: WaitingDeviceModel[]) => {
      this.arrayOfWaitingDevices = data;
      console.log(data);
    });
  }

  ngOnInit() {
  }

}
