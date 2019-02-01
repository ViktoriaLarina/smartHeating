import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-popup-success-restore-pass',
  templateUrl: './popup-success-restore-pass.component.html',
  styleUrls: ['./popup-success-restore-pass.component.css']
})
export class PopupSuccessRestorePassComponent {

  constructor(public dialogRef: MatDialogRef<PopupSuccessRestorePassComponent>) {
    const self = this;
    setTimeout(() => self.closeDialogProfile(), 2000);
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }


}
