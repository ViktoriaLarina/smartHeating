import {Component} from '@angular/core';
import {BaseMessageInputComponent} from '../../../base-components/base-message-input/base-message-input.component';
import {MatDialog} from '@angular/material';
import {SupportMessagesService} from '../../../../services/support-messages.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['../../../base-components/base-message-input/base-message-input.component.css', './message-input.component.css'],
})
export class MessageInputComponent extends BaseMessageInputComponent {

  constructor(dialog: MatDialog, messageService: SupportMessagesService) {
    super(dialog, messageService);
  }
}

