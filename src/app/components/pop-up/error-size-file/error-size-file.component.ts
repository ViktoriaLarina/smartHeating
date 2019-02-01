import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { StaticData } from '../../../utils/static-data';

@Component({
  selector: 'app-error-size-file',
  templateUrl: './error-size-file.component.html',
  styleUrls: ['./error-size-file.component.css']
})
export class ErrorSizeFileComponent {
  constructor(public dialogRef: MatDialogRef<ErrorSizeFileComponent>) {
    setTimeout(() => this.closeDialogProfile(), StaticData.SET_TIME_BEFORE_CLOSE);
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }

}
