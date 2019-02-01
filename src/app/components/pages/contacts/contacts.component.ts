import { Component } from '@angular/core';
import { InteractionsService } from '../../../services/interactions.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html'
})
export class ContactsComponent {
  stateIsShown = true;

  constructor(private service: InteractionsService) {
    this.service.showPageContact.subscribe((isShown: boolean) => {
      this.stateIsShown = isShown;
    });
    this.service.showPageContact.next(this.stateIsShown);
  }
}
