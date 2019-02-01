import {Inject, Injectable} from '@angular/core';
import {BASE_URL_TOKEN} from '../../configs';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Subject} from 'rxjs/Subject';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export abstract class BaseMessageService {

  messagesList: Array<any>;
  unreadMessagesCount: number;

  isNewMessagesLoading: boolean;
  isOldMessagesLoading: boolean;

  onMessagesUpdate: Subject<any>;
  onUnreadMessagesCountUpdate: Subject<any>;

  loadSubscription: Subscription;
  oldLoadSubscription: Subscription;
  newLoadSubscription: Subscription;

  constructor(@Inject(BASE_URL_TOKEN) protected baseUrl: string, protected http: HttpClient) {
    this.onMessagesUpdate = new Subject<any>();
    this.onUnreadMessagesCountUpdate = new Subject<any>();
    this.onUnreadMessagesCountUpdate.subscribe(val => this.unreadMessagesCount = val);
  }

  abstract getMessagesUrl(startTime?, endTime?, count?);

  abstract refreshUnreadMsgCount();

  abstract downloadFile(id, fileName);

  abstract getAddFileUrl();

  abstract addMessage(msg);

  abstract markAsNew(arr);

  refreshMessages() {
    if (this.messagesList && this.messagesList.length > 0) {
      this.fillNewMessages();
    } else {
      this.fillMessages();
    }
  }

  fillMessages() {
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
    this.isNewMessagesLoading = true;
    this.isOldMessagesLoading = true;
    const finishTime = encodeURIComponent(moment().utc().add(1, 'day').format());
    const url = this.getMessagesUrl(null, finishTime, 5);
    this.loadSubscription = this.http.get(url).subscribe(data => {
      this.messagesList = [];
      this.addNewMessages(data);
      this.isNewMessagesLoading = false;
      this.isOldMessagesLoading = false;
    }, null, () => {
      this.isOldMessagesLoading = false;
      this.isNewMessagesLoading = false;
    });
  }

  fillNewMessages() {
    if (this.isNewMessagesLoading) {
      return;
    }

    if (this.newLoadSubscription) {
      this.newLoadSubscription.unsubscribe();
    }
    this.isNewMessagesLoading = true;
    const lastMsgDate = this.messagesList[this.messagesList.length - 1].date;
    const startTime = encodeURIComponent(moment(lastMsgDate).utc().format());
    const finishTime = encodeURIComponent(moment().utc().add(1, 'day').format());
    const url = this.getMessagesUrl(startTime, finishTime);
    this.newLoadSubscription = this.http.get(url).subscribe(data => {
      this.addNewMessages(data, true);
      this.isNewMessagesLoading = false;
    }, null, () => this.isNewMessagesLoading = false);
  }

  fillOlderMessages() {
    // if is already loading
    if (this.isOldMessagesLoading) {
      return;
    }

    if (this.oldLoadSubscription) {
      this.oldLoadSubscription.unsubscribe();
    }

    const firstMsgDate = moment(this.messagesList[0].date).utc();
    const finishTime = encodeURIComponent(firstMsgDate.format());
    const url = this.getMessagesUrl(null, finishTime, 10);
    this.isOldMessagesLoading = true;
    this.oldLoadSubscription = this.http.get(url).subscribe((data: any[]) => {
      console.log('loaded ' + data.length);
      this.addNewMessages(data);
      this.isOldMessagesLoading = false;
    }, null, () => this.isOldMessagesLoading = false);
  }

  addNewMessages(data, markAsNew = false) {
    const filteredMessages = data.filter(msg => !this.messagesList.find(m => m.id === msg.id));
    if (filteredMessages.length > 0) {
      if (markAsNew) {
        filteredMessages.forEach(msg => msg.readed = false);
      }
      this.messagesList.push.apply(this.messagesList, filteredMessages);
      this.messagesList.sort(this.compareDate);
      this.onMessagesUpdate.next(this.messagesList);
    } else if (this.messagesList.length === 0) {
      this.onMessagesUpdate.next(this.messagesList);
    }
    this.markAsNew(filteredMessages);
  }

  compareDate(a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  }

  downloadBlob(data: Response, fileName) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    const blobURL = (window.URL || window['webkitURL']).createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = blobURL;
    anchor.click();
  }

  addFile(file) {
    const fileToSend = new FormData();
    fileToSend.append('file', file);
    const url = this.getAddFileUrl();

    const req = new HttpRequest('POST', url, fileToSend, {
      reportProgress: true,
    });

    return new Observable<number>(subscriber => {
      this.http.request(req).subscribe(event => {
          // Via this API, you get access to the raw event stream.
          // Look for upload progress events.
          if (event.type === HttpEventType.UploadProgress) {
            // This is an upload progress event. Compute and show the % done:
            const percentDone = event.loaded / event.total;
            subscriber.next(percentDone);
          } else if (event instanceof HttpResponse) {
            subscriber.complete();
          }
        },
        error2 => subscriber.error(error2));
    });
  }
}
