import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {StaticData} from '../../../../utils/static-data';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html'

})
export class AddDeviceComponent implements OnInit {
  isMobileSize: boolean;

  constructor(public dialogRef: MatDialogRef<AddDeviceComponent>) {
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
  }

  ngOnInit(): void {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
