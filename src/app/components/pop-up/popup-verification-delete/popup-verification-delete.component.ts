import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-popup-verification-delete',
  templateUrl: './popup-verification-delete.component.html',
  styleUrls: ['./popup-verification-delete.component.css']
})
export class PopupVerificationDeleteComponent {

  constructor(public dialogRef: MatDialogRef<PopupVerificationDeleteComponent>) {
  }

  closeDialogProfile(data: boolean) {
    this.dialogRef.close(data);
  }
}
