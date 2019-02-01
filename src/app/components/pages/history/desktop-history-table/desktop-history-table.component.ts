import {Component, Input, OnDestroy} from '@angular/core';
import {InteractionsService} from '../../../../services/interactions.service';
import {DeviceService} from '../../../../services/device.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop-history-table.component.html',
  styleUrls: ['./desktop-history-table.component.css']
})
export class DesktopHistoryTableComponent implements OnDestroy {

  @Input() items: Array<any> = [];
  ChartPoints: object;
  subscription: Subscription;
  subscription2: Subscription;

  constructor(private serviceInteractions: InteractionsService, private deviceService: DeviceService) {
    this.subscription = this.deviceService.ChartPoints.subscribe(data => {

      this.ChartPoints = data;

      // Add new chart
      for (let index in this.items) {
        if (this.items[index].id === this.serviceInteractions.historyChartId) {
          this.items.splice(+index + 1, 0, {diagram: true, deviceType: this.items[index].deviceType});
          break;
        }
      }


    });

    this.subscription2 = this.serviceInteractions.clickButtonShowHistory.subscribe(index => {
      // Delete old chart
      for (let index in this.items) {
        if (this.items[index].diagram) {
          this.items.splice(+index, 1);
          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
