import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AdminMessagesService } from '../../../services/admin-messages.service';
import { InteractionsService } from '../../../services/interactions.service';

@Component({
  selector: 'app-admin-side-menu',
  templateUrl: './admin-side-menu.component.html',
  styleUrls: ['./admin-side-menu.component.css']
})
export class AdminSideMenuComponent implements OnInit, OnDestroy {

  isMobileMenu: boolean;
  countUnreadMsg: number;
  currentPage: number;
  subs: Subscription;
  subs1: Subscription;
  constructor(private serviceInteraction: InteractionsService,
              private rout: Router,
              private messageService: AdminMessagesService) {
    this.subs1 = this.serviceInteraction.mobileMenuState.subscribe((show: boolean) => {
      this.isMobileMenu = show;
    });

    this.subs = this.messageService.countUnreadDialog.subscribe((data: number) => {
      this.countUnreadMsg = data;
    });
  }

  ngOnInit() {
    this.isMobileMenu = false;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.subs1.unsubscribe();
  }
}
