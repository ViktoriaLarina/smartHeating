import {Component, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ServerError} from '../../models/models';
import {ErroeResponseInterceptor} from '../../services/erroe-response-interceptor';
import {InteractionsService} from '../../services/interactions.service';
import {StaticData} from '../../utils/static-data';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnDestroy {

  WAITING_TIME = 10000;

  @Input()
  public alerts: any[];
  errorsArray: ServerError[];
  alertSubscribe: Subscription;

  constructor(private ErroeResponseInterceptor: ErroeResponseInterceptor, private serviceInt: InteractionsService) {
    this.alerts = [];
    this.errorsArray = StaticData.Errors;
    this.alertSubscribe = this.serviceInt.alert.subscribe((data: string) => {
      if (data) {
      const temp = this.errorsArray.find((i: ServerError) => i.errorCode === data);
      let msg: string;
      let code: string;
      if (temp) {
        msg = temp.message;
        code = temp.errorCode;
      }
      this.errorsListen(msg, code);
      }
    });
  }

  ngOnDestroy() {
    this.alertSubscribe.unsubscribe();
  }

  errorsListen(msg: string, code: string): void {
    const temp = {
      message: msg,
      errCode: code
    };
    this.alerts.push(temp);
    setTimeout(() => this.closeAlert(alert), this.WAITING_TIME);
  }

  closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

}
