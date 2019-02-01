import {Component, Input, OnInit} from '@angular/core';
import {InteractionsService} from '../../../services/interactions.service';
import {StaticData} from '../../../utils/static-data';
import {MatDialog} from '@angular/material';
import {CheckboxComponent} from '../../pages/history/checkbox/checkbox.component';

@Component({
  selector: '[app-history-item]',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent implements OnInit {
  @Input() card;
  @Input() ChartPoints;
  deviceType: string;
  deviceTypeToSend: string;
  arrayOfDeviceTypes;


  constructor(private interactionsService: InteractionsService, public dialog: MatDialog) {
    this.arrayOfDeviceTypes = StaticData.DeviceTypesInfo;
  }

  ngOnInit() {
    for (let i = 0; i < this.arrayOfDeviceTypes.length; i++) {
      if (this.arrayOfDeviceTypes[i].value === this.card['deviceType']) {
        this.deviceType = this.arrayOfDeviceTypes[i].name;
        this.deviceTypeToSend = this.arrayOfDeviceTypes[i].value;
      }
    }
  }

  showHistory(): void {
      this.interactionsService.clickButtonShowHistory.next(this.card.id);
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
