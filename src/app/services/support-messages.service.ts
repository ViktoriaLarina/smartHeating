import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {BaseMessageService} from '../components/base-components/base-message-service';

@Injectable()
export class SupportMessagesService extends BaseMessageService {

  getMessagesUrl(startTime?, endTime?, count?) {
    let url = `${this.baseUrl}/conversation/list?`;
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
    const url = `${this.baseUrl}/conversation/msg`;
    return this.http.post(url, message);
  }

  getAddFileUrl() {
    return `${this.baseUrl}/conversation/msg/attachment`;
  }

  refreshUnreadMsgCount() {
    const url = `${this.baseUrl}/conversation/new/count`;
    this.http.get(url).subscribe(data => {
      this.onUnreadMessagesCountUpdate.next(data);
    });
  }

  downloadFile(id, fileName) {
    const options = <any>{responseType : 'blob'};
    const url = `${this.baseUrl}/conversation/msg/${id}/attachment`;
    this.http.get(url, options).subscribe((data: any) => this.downloadBlob(data, fileName));
  }

  markAsRead(arr: any) {
    const url = `${this.baseUrl}/conversation/read`;
    return this.http.patch(url, arr).subscribe();
  }

  markAsNew(arr) {
    let oldest;
    for (let i = 0; i < arr.length; i++) {
      const msg = arr[i];
      if ((!oldest || oldest.date > msg.date) && msg.admin && !msg.readed) {
        oldest = msg;
      }
    }
    if (oldest) {
      oldest.isFirstNew = true;
    }
  }
}
