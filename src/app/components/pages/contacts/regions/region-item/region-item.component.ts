import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AdminPageService } from '../../../../../services/admin-page.service';

import { MatDialog } from '@angular/material';
import { PopupVerificationDeleteComponent } from '../../../../pop-up/popup-verification-delete/popup-verification-delete.component';

import { CountriesModel } from '../../../../../models/countries.model';
import { RegionDto } from '../../../../../models/regionDto/regionDto.model';
import { UsersService } from '../../../../../services/users.service';
import { StaticData } from '../../../../../utils/static-data';
import { Role } from '../../../../../utils/enums/roleEnum.model';

@Component({
  selector: 'app-region-item',
  templateUrl: './region-item.component.html',
  styleUrls: ['./region-item.component.css']
})
export class RegionItemComponent implements OnInit {

  @Input() country: RegionDto;
  @Input() role: string;
  @Input() index: number;

  isMobileSize = false;
  arrayOfCountries: CountriesModel[];
  countryName: string;
  countryValue: string;

  constructor(private adminService: AdminPageService, public dialog: MatDialog, private userService: UsersService) {
    this.arrayOfCountries = StaticData.Countries;
  }

  @HostListener('window:resize')
  onResize() {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    this.isMobileSize = width <= StaticData.MOBILE_CLIENT_WIDTH;
  }

  ngOnInit(): void {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    this.isMobileSize = width <= StaticData.MOBILE_CLIENT_WIDTH;
    for (const item of this.arrayOfCountries) {
      if (this.country.country === item.value) {
        this.countryName = item.name;
        this.countryValue = item.value;
        break;
      }
    }
  }

  scrollToTop() {
    if (this.role === Role.USER) {
      window.scrollTo(0, 0);
    }
  }

  deleteContact(itemForRemoval, id): void {
    const dialogRef = this.dialog.open(PopupVerificationDeleteComponent, {
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result && itemForRemoval === 'region') {
        this.adminService.deleteRegion(id).subscribe((data) => {
          this.userService.getRegionsContacts();
        });
      } else {
        this.adminService.deleteOffice(id).subscribe((data) => {
          this.userService.getRegionsContacts();
        });
      }
    });
  }
}
