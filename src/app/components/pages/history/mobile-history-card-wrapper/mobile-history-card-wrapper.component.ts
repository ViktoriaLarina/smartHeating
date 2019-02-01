import {Component, Input, OnDestroy} from '@angular/core';
import {InteractionsService} from '../../../../services/interactions.service';
import {Subscription} from 'rxjs/Subscription';
import {DeviceService} from '../../../../services/device.service';


@Component({
  selector: 'app-mobile',
  templateUrl: './mobile-history-card-wrapper.component.html',
  styleUrls: ['./mobile-history-card-wrapper.component.css']
})
export class MobileHistoryCardWrapperComponent implements OnDestroy {
  @Input() items;

  subscription: Subscription;
  subscription2: Subscription;

  constructor(private serviceInteractions: InteractionsService, private deviceService: DeviceService) {

    this.subscription = this.deviceService.ChartPoints.subscribe(data => {

      // Add new chart
      for (let index in this.items) {
        const item = this.items[index];
        if (item.id === this.serviceInteractions.historyChartId) {
          item.selected = true;
        }
        }
    });

    this.subscription2 = this.serviceInteractions.clickButtonShowHistory.subscribe(index => {
      // Delete old chart
      for (let index in this.items) {
        this.items[index].selected = false; // this.items[index].id === this.serviceInteractions.historyChartId;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
