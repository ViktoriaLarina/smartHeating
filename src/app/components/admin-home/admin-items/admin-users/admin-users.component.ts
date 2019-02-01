import { Component } from '@angular/core';
import { AdminPageService } from '../../../../services/admin-page.service';
import { StaticData } from '../../../../utils/static-data';
import { BaseSearchListComponent } from '../../../base-components/base-search-list/base-search-list.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: '../../../base-components/base-search-list/base-search-list.component.html',
  styleUrls: ['../../../base-components/base-search-list/base-search-list.component.css']
})
export class AdminUsersComponent extends BaseSearchListComponent {

  constructor(service: AdminPageService) {
    super(service);
    this.listSubscription = this.service.usersToShow.subscribe(data => {
      this.itemsCount = data.totalElementsInDB;
      this.items = data.elements;
    });
    this.arrayOfCriteria = StaticData.AdminSearchUserCriterias;
    this.criteria = StaticData.AdminSearchUserCriterias[0].value;
  }

  executeSearch() {
    this.service.getUsers();
  }
}

