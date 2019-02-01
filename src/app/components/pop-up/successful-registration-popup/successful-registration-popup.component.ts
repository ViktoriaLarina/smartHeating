import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StaticData } from '../../../utils/static-data';

@Component({
  selector: 'app-successful-registration-popup',
  templateUrl: './successful-registration-popup.component.html',
  styleUrls: ['./successful-registration-popup.component.css']
})
export class SuccessfulRegistrationPopupComponent {

  isGoodResult: boolean;

  constructor(public dialogRef: MatDialogRef<SuccessfulRegistrationPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isGoodResult = data.isSuccess;
    setTimeout(() => this.closeDialogProfile(), StaticData.SET_TIME_BEFORE_CLOSE);
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }
}
