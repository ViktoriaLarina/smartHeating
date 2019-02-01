import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AdminMessagesService } from '../../../../services/admin-messages.service';
import { BaseMessageInputComponent } from '../../../base-components/base-message-input/base-message-input.component';

@Component({
  selector: 'app-admin-message-input',
  templateUrl: '../../../base-components/base-message-input/base-message-input.component.html',
  styleUrls: ['../../../base-components/base-message-input/base-message-input.component.css', './admin-message-input.component.css']
})
export class AdminMessageInputComponent extends BaseMessageInputComponent {

  _currentUserId;

  constructor(dialog: MatDialog, messageService: AdminMessagesService) {
    super(dialog, messageService);
  }

  @Input()
  get currentUserId() {
    return this._currentUserId;
  }

  set currentUserId(value) {
    if (this._currentUserId === value) {
      return;
    }
    this._currentUserId = value;
    this.resetInput();
  }
}
