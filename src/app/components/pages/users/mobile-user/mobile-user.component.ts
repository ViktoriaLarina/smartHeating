import { Component, Input } from '@angular/core';
import {UsersDataOut} from '../../../../models/dataOut/dataOut.model';

@Component({
  selector: 'app-mobile-user',
  templateUrl: './mobile-user.component.html'
})
export class MobileUserComponent {

  @Input() users: UsersDataOut[];

  constructor() {
  }

}
