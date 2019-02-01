import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { RegionDto } from '../../../../models/regionDto/regionDto.model';
import { UsersService } from '../../../../services/users.service';
import { StaticData } from '../../../../utils/static-data';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit, OnDestroy {

  static CountriesPriorities = StaticData.CountriesPriorities;

  isMobileSize = false;
  arrayOfCountries: RegionDto[];
  countriesSubscription: Subscription;

  @Input() role: string;

  constructor(private service: UsersService) {
    this.countriesSubscription = this.service.arrayOfCountries.subscribe((data: RegionDto[]) => {
      this.arrayOfCountries = data.slice();
      this.arrayOfCountries.sort(this.sortCountries);
      for (const countries of this.arrayOfCountries) {
        if (countries.country === 'mainOffice') {
          this.arrayOfCountries.splice(-1, 1);
        }
      }
    });
    this.service.getRegionsContacts();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileSize = document.body.clientWidth > StaticData.MOBILE_CLIENT_WIDTH;
  }

  ngOnInit(): void {
    this.isMobileSize = document.body.clientWidth > StaticData.MOBILE_CLIENT_WIDTH;
  }

  ngOnDestroy() {
    this.countriesSubscription.unsubscribe();
  }

  sortCountries(a, b): number {
  const aIndex = RegionsComponent.CountriesPriorities.indexOf(a.country);
  const bIndex = RegionsComponent.CountriesPriorities.indexOf(b.country);

  if (aIndex > -1 && bIndex === -1) {
  return -1;
}
  if (aIndex === -1 && bIndex > -1) {
  return 1;
  }
  if (aIndex > -1 && bIndex > -1) {
  return aIndex > bIndex ? 1 : -1;
  }

  if (a < b) {
  return -1;
  }
  if (a > b) {
  return 1;
  }
  return 0;
  }
}
