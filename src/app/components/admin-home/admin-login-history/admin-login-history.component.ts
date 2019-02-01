import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AdminPageService } from '../../../services/admin-page.service';

@Component({
  selector: 'app-admin-login-history',
  templateUrl: './admin-login-history.component.html',
  styleUrls: ['./admin-login-history.component.css']
})
export class AdminLoginHistoryComponent implements OnInit, OnDestroy {

  items;
  pageSize: number;
  pageNumber: number;
  target: string;
  totalElements: number;
  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  pageSizeOptions = [10, 20, 50, 100, 200];
  dataToLoginHistoryTable;
  constructor(private service: AdminPageService) {
    this.pageSize = this.pageSizeOptions[1];
    this.pageNumber = 0;

    this.subscription2 = this.service.clickButtonShowMap.subscribe((id) => {
      // Hide old chart
      this.hideOldData(id);
    });

    this.subscription3 = this.service.clickButtonShowUserInfo.subscribe((id) => {
      // Hide old data
      this.hideOldData(id);
    });
  }

  ngOnInit(): void {
    this.startSearch();
  }

  ngOnDestroy() {
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  setPage(e) {
    if (this.pageSize !== e.pageSize) {
      this.pageSize = e.pageSize;
      this.pageNumber = 0;
    } else {
      this.pageNumber = e.pageIndex;
    }
    this.startSearch();
  }

  devicesHistory(isTrue) {
    this.target = '';
    this.pageSize = this.pageSizeOptions[1];
    this.pageNumber = 0;
    if (isTrue) {
      this.target = 'login';
    }
    this.startSearch();
  }

  startSearch() {
    if (this.target) {
      this.service.getLogHistory(this.pageSize, this.pageNumber, this.target).subscribe(data => {
        console.dir(data);
        this.items = data['content'];
        this.totalElements = data['totalElements'];
      });
    } else {
      this.service.getLogHistory(this.pageSize, this.pageNumber).subscribe(data => {
        this.items = data['content'];
        this.totalElements = data['totalElements'];
      });
    }
  }
  private hideOldData(id) {
    for (const i in this.items) {
      if (this.items.hasOwnProperty(i)) {
        if (this.items[i].id !== id) {
          this.items[i].dataToLoginHistoryTable = null;
        }
      }
    }
  }
}
