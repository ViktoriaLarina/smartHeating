import {Component, Input} from '@angular/core';
import {SupportMessagesService} from '../../../../services/support-messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class SupportMessageComponent {

  @Input() item: any;

  constructor(private service: SupportMessagesService) {
  }

  downloadData() {
    this.service.downloadFile(this.item['id'], this.item.fileName);
  }
}
