
import {DOCUMENT} from '@angular/common';
import {
  AfterViewChecked, AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit, QueryList,
  ViewChildren
} from '@angular/core';
import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {Subscription} from 'rxjs/Subscription';
import {AdminMessagesService} from '../../../services/admin-messages.service';
import {AdminPageService} from '../../../services/admin-page.service';
import {SupportMessagesService} from '../../../services/support-messages.service';
import {StaticData} from '../../../utils/static-data';
import {SupportComponent} from '../../pages/support/support.component';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css'],
  providers: [SupportMessagesService]
})
export class AdminMessagesComponent implements OnInit, AfterViewInit, OnDestroy {

  static RefreshInterval = 5000;
  MARK_AS_READ_TIMEOUT = 1500; // ms

  @ViewChildren('messages') messagesNgFor: QueryList<any>;

  arrayOfUsers: any[];
  selectConversation: boolean;
  mesaggesByUser: any;
  initialized: boolean;
  refreshTimer: any;
  refreshUsers: any;
  isAllUsers: boolean;
  findUsersSubscription: Subscription;
  unreadUsersSubscription: Subscription;
  newUser;

  items: any[];
  itemsCount: number;
  arrayOfCriteria: any[];
  criteria: any;
  searchInput: string;
  pageSizeOptions = [2, 5, 10, 25, 100];
  listSubscription: Subscription;
  countSubscription: Subscription;
  error: boolean;
  bindedOnMouseMove = this.onMouseMove.bind(this);
  isDirty: boolean;

  isScrollDownNeeded: boolean;
  isScrollSaveNeeded: boolean;
  savedBottomScrollPosition: number;
  lastMsgId: number;


  private _currentUserId: number;

  get currentUserId(): number {
    return this._currentUserId;
  }

  set currentUserId(value: number) {
    if (this._currentUserId === value) {
      return;
    }
    this._currentUserId = value;
    if (this.unreadUsersSubscription) {
      this.unreadUsersSubscription.unsubscribe();
    }
  }

  constructor(private messageService: AdminMessagesService,
              private pageScrollService: PageScrollService,
              private service: AdminPageService,
              @Inject(DOCUMENT) private document: any) {
    this.arrayOfCriteria = StaticData.AdminSearchUserCriterias;
    this.criteria = StaticData.AdminSearchUserCriterias[0].value;
    this.searchInput = '';
    this.selectConversation = false;
    this.initialized = false;
    console.dir(this.document);

    this.messageService.users.subscribe((data: any) => {
      this.arrayOfUsers = data;
      this.arrayOfUsers.reverse();
      if (!this.newUser) {
        return;
      }

      for (const users of this.arrayOfUsers) {
        if (users.interlocutor.id === this.newUser.id) {

          this.newUser = null;
          return;
        }
      }
    });

  }

  get searchQuery() {
    return this.searchInput.trim();
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

    if (!this.mesaggesByUser) {
      return;
    }

    const newMessages = this.mesaggesByUser.filter((item) => !item.readed && !item.admin);
    newMessages.forEach((item) => {
      item.readed = true;
      item.isFirstNew = false;
    });
    if (newMessages.length > 0) {
      this.messageService.markAsRead(newMessages.map((item) => item.id));
    }
  }

  ngOnInit() {
    this.messageService.findUsers();
    this.refreshUsers = setInterval(() => {
      this.messageService.findUsers();
    }, AdminMessagesComponent.RefreshInterval);
    window.addEventListener('mousemove', this.bindedOnMouseMove, false);
  }

  ngOnDestroy() {
    clearInterval(this.refreshTimer);
    clearInterval(this.refreshUsers);
    window.scrollTo(0, 0);
    this.service.searchParams.query = '';
    this.service.searchParams.criteria = '';

    if (this.listSubscription) {
      this.listSubscription.unsubscribe();
    }
    if (this.countSubscription) {
      this.countSubscription.unsubscribe();
    }
    window.removeEventListener('mousemove', this.bindedOnMouseMove, false);
  }

  ngAfterViewInit() {
    this.messagesNgFor.changes.subscribe((t) => {

      this.ngForRendered();
    });
  }


  // ngAfterViewChecked() {
  //   if (this.isDirty) {
  //     this.ngForRendered();
  //   }
  // }

  showAllUsers() {
    this.newUser = null;
    if (this.listSubscription) {
      this.listSubscription.unsubscribe();
    }
    // if (this.countSubscription) this.countSubscription.unsubscribe();
    // this.isAllUsers = true;

    this.service.searchParams.pageSize = 20;
    this.service.searchParams.pageNumber = 0;
    this.service.getUsers();
    this.listSubscription = this.service.usersToShow.subscribe((data) => {
      this.itemsCount = data.totalElementsInDB;
      this.items = data.elements;
      this.isDirty = true;
      for (let i = 0; i < this.items.length; i++) {
        for (const users of this.arrayOfUsers) {
          if (this.items[i].id === users.interlocutor.id) {
            this.items.splice(i, 1);
            i--;
          }
        }
      }
    });
  }

  setPage(e) {
    if (this.service.searchParams.pageSize !== e.pageSize) {
      this.service.searchParams.pageSize = e.pageSize;
      this.service.searchParams.pageNumber = 0;
    } else {
      this.service.searchParams.pageNumber = e.pageIndex;
    }
    this.startSearch();
  }

  startSearch() {
    this.error = false;
    const length = this.searchInput.trim().length;
    if (length <= 1 && length !== 0) {
      this.error = true;
      return;
    }
    this.service.searchParams.query = this.searchInput.trim();
    this.service.searchParams.criteria = this.criteria;
    this.service.getUsers();
  }

  openDialog(id) {
    if (this.isAllUsers) {
      this.listSubscription.unsubscribe();
      this.isAllUsers = false;
      for (const item of this.items) {
        if (item.id === id) {
          this.newUser = item;

        }
      }
    }

    clearInterval(this.refreshTimer);
    this.mesaggesByUser = [];
    this.selectConversation = true;
    this.currentUserId = id;
    this.initialized = false;
    this.messageService.onMessagesUpdate.subscribe((data) => {
      this.isScrollDownNeeded = false;
      this.isScrollSaveNeeded = false;

      for (let i = 0; i < data.length; i++) {
        const currMsg = data[i];
        if (i === 0) {
          currMsg.flag = true;
          continue;
        }

        const currDate = new Date(currMsg.date);
        const prevDate = new Date(data[i - 1].date);
        currDate.setHours(0, 0, 0, 0);
        prevDate.setHours(0, 0, 0, 0);
        currMsg.flag = currDate.getTime() !== prevDate.getTime();
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

      this.mesaggesByUser = data;
      this.isDirty = true;
    });
    this.messageService.userId = id;
    this.messageService.refreshMessages();
    this.refreshTimer = setInterval(() => {
      this.messageService.refreshMessages();
    }, AdminMessagesComponent.RefreshInterval);
  }

  getUnreadMsg() {
    this.unreadUsersSubscription = this.messageService.countUnreadDialog.subscribe((data: number) => {
      this.messageService.onUnreadMessagesCountUpdate.next(data);
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
        pageScrollDuration: duration
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
