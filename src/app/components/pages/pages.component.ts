import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupportMessagesService} from '../../services/support-messages.service';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {

  REFRESH_INTERVAL = 60000; // ms

  allDataOfMessages: Array<any>;
  items;
  subscription: Subscription;
  tintervalTime: any;

  constructor(private messageService: SupportMessagesService, private rout: Router) {
    this.subscription = this.messageService.onMessagesUpdate.subscribe(items => {
      this.getAllMsg(items);
      this.items = items;
    });
  }

  ngOnInit() {
    this.getMessagesCount();
    this.tintervalTime = setInterval(() => this.getMessagesCount(), this.REFRESH_INTERVAL);
  }

  ngOnDestroy() {
    clearInterval(this.tintervalTime);
    this.subscription.unsubscribe();
  }

  getMessagesCount() {
    if (this.rout.url !== '/home/support') {
      this.messageService.refreshUnreadMsgCount();
    }
  }

  getAllMsg(data) {
    this.allDataOfMessages = [];
    for (const date in data) {
      if (data.hasOwnProperty(date)) {
        const day = data[date];
        for (const i in day) {
          if (day.hasOwnProperty(i)) {
            const msg = day[i];
            this.allDataOfMessages.push(msg);
          }
        }
      }
    }
  }
}
