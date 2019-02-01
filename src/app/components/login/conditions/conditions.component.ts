import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Language} from '../../../utils/language';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})
export class ConditionsComponent implements OnInit {

  language: string;

  constructor(public dialogRef: MatDialogRef<ConditionsComponent>) {
  }

  closeDialogProfile() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.language = Language.getLang();
  }

}
