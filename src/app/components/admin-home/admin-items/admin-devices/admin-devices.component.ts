import { Component } from '@angular/core';

import { AdminPageService } from '../../../../services/admin-page.service';
import { StaticData } from '../../../../utils/static-data';
import { BaseSearchListComponent } from '../../../base-components/base-search-list/base-search-list.component';

@Component({
  selector: 'app-admin-devices',
  templateUrl: '../../../base-components/base-search-list/base-search-list.component.html',
  styleUrls: ['../../../base-components/base-search-list/base-search-list.component.css']
})
export class AdminDevicesComponent extends BaseSearchListComponent {

  constructor(service: AdminPageService) {
    super(service);
    this.listSubscription = this.service.devicesToShow.subscribe(data => {
      this.itemsCount = data.totalElementsInDB;
      this.items = data.elements;
    });
    this.arrayOfCriteria = StaticData.AdminSearchDeviceCriterias;
    this.criteria = StaticData.AdminSearchDeviceCriterias[0].value;
  }

  executeSearch() {
    this.service.getDevices();
  }
}
