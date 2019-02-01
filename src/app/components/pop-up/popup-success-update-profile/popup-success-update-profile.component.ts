import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StaticData } from '../../../utils/static-data';

@Component({
  selector: 'app-popup-success-update-profile',
  templateUrl: './popup-success-update-profile.component.html',
  styleUrls: ['./popup-success-update-profile.component.css']
})
export class PopupSuccessUpdateProfileComponent {

  constructor(public dialogRef: MatDialogRef<PopupSuccessUpdateProfileComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    setTimeout(() => this.closeDialogProfile(), StaticData.SET_TIME_BEFORE_CLOSE);
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }
}
