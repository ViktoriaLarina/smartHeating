import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { StaticData } from '../../../utils/static-data';

@Component({
  selector: 'app-successful-data-recovery',
  templateUrl: './successful-data-recovery.component.html',
  styleUrls: ['./successful-data-recovery.component.css']
})
export class SuccessfulDataRecoveryComponent {

  constructor(public dialogRef: MatDialogRef<SuccessfulDataRecoveryComponent>) {
    setTimeout(() => this.closeDialogProfile(), StaticData.SET_TIME_BEFORE_CLOSE);
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }
}
