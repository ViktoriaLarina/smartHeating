import {ContentChild, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {AdminPageService} from '../../../services/admin-page.service';
import {Subscription} from 'rxjs/Subscription';

export abstract class BaseSearchListComponent implements OnDestroy, OnInit {

  @ContentChild(TemplateRef) template: TemplateRef<any>;

  items: Array<any>;
  itemsCount: number;
  arrayOfCriteria: Array<any>;
  criteria: any;
  searchInput: string;
  pageSizeOptions = [2, 5, 10, 25, 100];
  listSubscription: Subscription;
  countSubscription: Subscription;
  error: boolean;

  constructor(public service: AdminPageService) {
    this.searchInput = '';
    this.service.searchParams.pageSize = 20;
    this.service.searchParams.pageNumber = 0;
  }

  get searchQuery() {
    return this.searchInput.trim();
  }

  ngOnInit() {
    this.executeSearch();
  }

  ngOnDestroy() {
    this.service.searchParams.query = '';
    this.service.searchParams.criteria = '';
    if (this.listSubscription) this.listSubscription.unsubscribe();
    if (this.countSubscription) this.countSubscription.unsubscribe();
  }

  setPage(e) {
    if (this.service.searchParams.pageSize !== e.pageSize) {
      this.service.searchParams.pageSize = e.pageSize;
      this.service.searchParams.pageNumber = 0;
    } else {
      this.service.searchParams.pageNumber = e.pageIndex;
    }
    this.startSearch();
  }

  startSearch() {
    this.error = false;
    const length = this.searchInput.trim().length;
    if (length <= 1 && length !== 0) {
      this.error = true;
      return;
    }
    this.service.searchParams.query = this.searchInput.trim();
    this.service.searchParams.criteria = this.criteria;
    this.executeSearch();
  }

  abstract executeSearch();
}
