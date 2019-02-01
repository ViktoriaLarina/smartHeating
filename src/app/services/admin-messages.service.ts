import {Injectable} from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {BaseMessageService} from '../components/base-components/base-message-service';

@Injectable()
export class AdminMessagesService extends BaseMessageService {
  refreshUnreadMsgCount() {
  }

  downloadFile(id, fileName) {
  }

  countUnreadDialog = new Subject<number>();
  users = new Subject<any>();
  private _userId: number; // TODO: Make private and add set method

  get userId() {
    return this._userId;
  }
  set userId(value) {
    if (this._userId === value) {
      return;
    }

    this._userId = value;
    // reset all dialog data
    this.messagesList = [];
    this.onMessagesUpdate.next(this.messagesList);
    this.unreadMessagesCount = 0;
    this.onUnreadMessagesCountUpdate.next(this.unreadMessagesCount);

    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
    if (this.newLoadSubscription) {
      this.newLoadSubscription.unsubscribe();
    }
    if (this.oldLoadSubscription) {
      this.oldLoadSubscription.unsubscribe();
    }
  }

  findUsers() {
    const url = `${this.baseUrl}/admin/conversation/list`;
    this.http.get(url).subscribe((data: Array<any>) => {
      this.users.next(data);
    });
  }

  findUsersForUnreadedMessages() {
    const url = `${this.baseUrl}/admin/conversation/count/updated`;
    return this.http.get(url).subscribe((data: number) => this.countUnreadDialog.next(data));
  }

  // ------BaseMessageService------------

  getMessagesUrl(startTime, endTime, count) {
    let url = `${this.baseUrl}/admin/conversation/${this.userId}/list?`;
    if (count) {
      url += `count=${count}&`;
    }
    if (startTime) {
      url += `startTime=${startTime}&`;
    }
    if (endTime) {
      url += `endTime=${endTime}`;
    }
    return url;
  }

  addMessage(message) {
    const url = `${this.baseUrl}/admin/conversation/msg?userId=${this.userId}`;
    return this.http.post(url, message);
  }

  getAddFileUrl() {
    return `${this.baseUrl}/admin/conversation/msg/${this.userId}/attachment`;
  }

  markAsRead(arr: any) {
    const url = `${this.baseUrl}/admin/conversation/read`;
    return this.http.patch(url, arr).subscribe((data) => this.findUsers());
  }

  markAsNew(arr) {
    let oldest;
    for (let i = 0; i < arr.length; i++) {
      const msg = arr[i];
      if ((!oldest || oldest.date > msg.date) && !msg.admin && !msg.readed) {
        oldest = msg;
      }
    }
    if (oldest) {
      oldest.isFirstNew = true;
    }
  }

}
