import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceService} from '../../../services/device.service';
import {Subscription} from 'rxjs/Subscription';
import {InteractionsService} from '../../../services/interactions.service';
import {StaticData} from '../../../utils/static-data';
import {CheckboxComponent} from '../../pages/history/checkbox/checkbox.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-history-mob-item',
  templateUrl: './history-mob-item.component.html',
  styleUrls: ['./history-mob-item.component.css']
})
export class HistoryMobItemComponent implements OnInit, OnDestroy {
  @Input() card;
  ChartPoints: object;
  subscription: Subscription;
  deviceType: string;
  arrayOfDeviceTypes;
  deviceTypeToSend: string;


  constructor(private service: DeviceService, private serviseInteractions: InteractionsService, public dialog: MatDialog) {

    this.arrayOfDeviceTypes = StaticData.DeviceTypesInfo;

    this.subscription = this.service.ChartPoints.subscribe(data => {
      this.ChartPoints = data;
    });
  }

  ngOnInit() {
    for (let i = 0; i < this.arrayOfDeviceTypes.length; i++) {
      if (this.arrayOfDeviceTypes[i].value === this.card['deviceType']) {
        this.deviceType = this.arrayOfDeviceTypes[i].name;
        this.deviceTypeToSend = this.arrayOfDeviceTypes[i].value;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showHistory() {
    this.serviseInteractions.clickButtonShowHistory.next(this.card.id);
    const dialogRef = this.dialog.open(CheckboxComponent, <any> {
      disableClose: false,
      data: {
        type: this.deviceTypeToSend,
        id: this.card.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      return result;
    });
  }

}
