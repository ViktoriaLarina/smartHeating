import { Component, Input, OnInit } from '@angular/core';
import { AdminMessagesService } from '../../../../services/admin-messages.service';
import { SupportMessagesService } from '../../../../services/support-messages.service';

@Component({
  selector: 'app-admin-item-message',
  templateUrl: '../../../pages/support/support-message/message.component.html',
  styleUrls: ['../../../pages/support/support-message/message.component.css']
})
export class AdminItemMessageComponent implements OnInit {

  @Input() item: any;

  constructor(private service: AdminMessagesService, private userMsgService: SupportMessagesService) {
  }

  downloadData() {
    this.userMsgService.downloadFile(this.item['id'], this.item['fileName']);
  }

  ngOnInit() {
  }
}
