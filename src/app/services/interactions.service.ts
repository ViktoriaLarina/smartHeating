import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InteractionsService {

  alert = new Subject<string>();
  mobileMenuState = new Subject<boolean>();
  showMobileMyProfile = new Subject<boolean>();
  showMobAddUser = new Subject<boolean>();
  showMobEditUser = new Subject<boolean>();
  showPageContact = new Subject<boolean>();
  clickButtonShowHistory = new Subject<number>();
  historyChartId: number;

  constructor() {
    this.clickButtonShowHistory.subscribe((index: number) => this.historyChartId = index);
  }
}
