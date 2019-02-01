import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AdminMessagesService } from '../../services/admin-messages.service';
import { Language } from '../../utils/language';
import { StaticData } from '../../utils/static-data';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html'
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  RefreshInterval: number;
  subscription: Subscription;
  setIntervalFunc;

  constructor(private messageService: AdminMessagesService, private  router: Router) {
    this.RefreshInterval = 20000;
  }

  ngOnInit() {
    if (this.router.url === '/admin') {
      this.router.navigate(['admin/devices']);
      Language.saveLang(StaticData.Languages[0].value);
    }
    this.getUnreadMsg();
    this.setIntervalFunc = setInterval(() => this.getUnreadMsg(), this.RefreshInterval);
  }

  getUnreadMsg() {
    this.subscription = this.messageService.findUsersForUnreadedMessages();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.setIntervalFunc);
  }
}
