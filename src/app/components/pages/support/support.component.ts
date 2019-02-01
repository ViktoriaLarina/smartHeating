import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {SupportMessagesService} from '../../../services/support-messages.service';
import {InteractionsService} from '../../../services/interactions.service';
import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
})
export class SupportComponent implements OnInit, OnDestroy, AfterViewInit {

  static RefreshInterval = 10000;
  static ScrollPosToLoad = 200;
  MARK_AS_READ_TIMEOUT = 1500; // ms

  @ViewChildren('messages') messagesNgFor: QueryList<any>;

  allDataOfMessages: Array<any>;
  showMobileMyProfile: boolean;
  index: number;
  initialized: boolean;
  unReadMsgCount: number;
  refreshTimer: any;
  isScrollDownNeeded: boolean;
  isScrollSaveNeeded: boolean;
  lastMsgId: number;
  savedBottomScrollPosition: number;
  isDirty: boolean;

  bindedOnMouseMove = this.onMouseMove.bind(this);

  constructor(private messageService: SupportMessagesService,
              private interactionsService: InteractionsService,
              private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
    this.initialized = false;
    this.interactionsService.showMobileMyProfile.subscribe((show: boolean) => {
      this.showMobileMyProfile = show;
    });
    this.unReadMsgCount = 0;
  }

  ngOnInit() {
    this.messageService.onMessagesUpdate.subscribe((data: Array<any>) => {
      this.isScrollDownNeeded = false;
      this.isScrollSaveNeeded = false;

      this.allDataOfMessages = data;
      this.isDirty = true;
      // console.log(data)

      // Mark onMessagesUpdate date borders
      for (let i = 0; i < this.allDataOfMessages.length; i++) {
        const currMsg = this.allDataOfMessages[i];
        if (i === 0) {
          currMsg.flag = true;
          continue;
        }

        const currDate = new Date(currMsg.date);
        const prevDate = new Date(this.allDataOfMessages[i - 1].date);
        currDate.setHours(0, 0, 0, 0);
        prevDate.setHours(0, 0, 0, 0);
        if (currDate.getTime() !== prevDate.getTime()) {
          currMsg.flag = true;
        } else {
          currMsg.flag = false;
        }
      }

      // Check if last message changed
      let lastId;
      for (const msg of data) {
        if (!lastId || lastId < msg.id) {
          lastId = msg.id;
        }
      }
      if (this.lastMsgId !== lastId) {
        this.isScrollDownNeeded = true;
        this.lastMsgId = lastId;
      } else {
        this.savedBottomScrollPosition = this.getDocumentHeight() - this.getScrollPosition();
        this.isScrollSaveNeeded = true;
      }
    });

    window.addEventListener('mousemove', this.bindedOnMouseMove, false);
    this.messageService.refreshMessages();
    this.refreshTimer = setInterval(() => this.messageService.refreshMessages(), SupportComponent.RefreshInterval);
  }

  onMouseMove($event) {
    if (this.isDirty) {
      this.isDirty = false;
      setTimeout(() => {
        this.markAsRead();
      }, this.MARK_AS_READ_TIMEOUT);
    }
  }

  markAsRead() {
    const newMessages = this.allDataOfMessages.filter(item => !item.readed && item.admin);
    newMessages.forEach(item => {
      item.readed = true;
      item.isFirstNew = false;
    });
    if (newMessages.length > 0) {
      this.messageService.markAsRead(newMessages.map(item => item.id));
    }
  }

  ngOnDestroy() {
    clearInterval(this.refreshTimer);
    this.messageService.messagesList = [];
    window.scrollTo(0, 0);
  }

  ngAfterViewInit() {
    this.messagesNgFor.changes.subscribe((t) => {
      this.ngForRendered();
    });
  }

  ngForRendered() {
    if (this.isScrollDownNeeded) {
      if (this.initialized) {
        setTimeout(() => this.scrollDown(1200), 300);
      } else {
        setTimeout(() => this.scrollDown(0), 500);
        this.initialized = true;
      }
    }
    if (this.isScrollSaveNeeded) {
      const currentHeight = this.getDocumentHeight();
      const targetScrollPos  = currentHeight - this.savedBottomScrollPosition;
      window.scrollTo(0, targetScrollPos);
    }
  }

  scrollDown(duration): void {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance(
      {
        document: this.document,
        scrollTarget: '#scroll-down-target',
        pageScrollDuration: duration,
      });
    this.pageScrollService.start(pageScrollInstance);
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollTop = this.getScrollPosition();
    if (scrollTop <= SupportComponent.ScrollPosToLoad) {
      this.messageService.fillOlderMessages();
    }
  }

  getScrollPosition(): number {
    const html = this.document.documentElement;
    const body = this.document.body;

    let scrollTop = html.scrollTop || body && body.scrollTop || 0;
    scrollTop -= html.clientTop;
    return scrollTop;
  }

  getDocumentHeight() {
    const doc = this.document;
    return Math.max(
      doc.body.scrollHeight, doc.documentElement.scrollHeight,
      doc.body.offsetHeight, doc.documentElement.offsetHeight,
      doc.body.clientHeight, doc.documentElement.clientHeight
    );
  }
}

