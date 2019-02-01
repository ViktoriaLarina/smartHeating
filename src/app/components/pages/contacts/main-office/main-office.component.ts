import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';

import { AdminPageService } from '../../../../services/admin-page.service';
import { PopupVerificationDeleteComponent } from '../../../pop-up/popup-verification-delete/popup-verification-delete.component';

import { UsersService } from '@services/users.service';
import { RegionDto } from '../../../../models/regionDto/regionDto.model';

@Component({
  selector: 'app-main-office',
  templateUrl: './main-office.component.html',
  styleUrls: ['./main-office.component.css']
})
export class MainOfficeComponent implements OnDestroy {

  @Input() role: string;
  mainOffice: RegionDto;
  longitude: number;
  latitude: number;
  countriesSubscription: Subscription;

  constructor(private service: UsersService, private adminService: AdminPageService, public dialog: MatDialog) {
    this.service.getRegionsContacts();
    this.countriesSubscription = this.service.arrayOfCountries.subscribe((data: RegionDto[]) => {
      for (const mainOffice of data) {
        if (mainOffice.country === 'mainOffice') {
          this.mainOffice = mainOffice;
          this.mainOffice.offices.sort(this.sortOffices);
          for (const offices of this.mainOffice.offices) {
            if (offices.main) {
              this.latitude = offices.latitude;
              this.longitude = offices.longitude;
            }
          }
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this.countriesSubscription.unsubscribe();
  }

  sortOffices(a, b) {

    if (!a['main'] && b['main']) {
      return 1;
    }
    if (a['main'] && !b['main']) {
      return -1;
    }
    return 0;
  }

  deleteContact(id): void {
    const dialogRef = this.dialog.open(PopupVerificationDeleteComponent, {
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.adminService.deleteOffice(id).subscribe((data) => {
          this.service.getRegionsContacts();
        });
      }
    });
  }

}
