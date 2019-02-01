import { Component, Input } from '@angular/core';
import {UsersDataOut} from '../../../../models/dataOut/dataOut.model';

@Component({
  selector: 'app-desktop-user',
  templateUrl: './desktop-user.component.html',
  styleUrls: ['./desktop-user.component.css']
})
export class DesktopUserComponent {

  @Input() users: UsersDataOut[];

  constructor() {
  }

}
