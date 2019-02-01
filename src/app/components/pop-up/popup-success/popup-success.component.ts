import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { StaticData } from '../../../utils/static-data';

@Component({
  selector: 'app-popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.css']
})
export class PopupSuccessComponent {

  constructor(public dialogRef: MatDialogRef<PopupSuccessComponent>) {
    setTimeout(() => this.closeDialogProfile(), StaticData.SET_TIME_BEFORE_CLOSE);
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }

}
