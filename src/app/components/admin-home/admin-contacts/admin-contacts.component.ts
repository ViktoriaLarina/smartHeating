import { MapsAPILoader } from '@agm/core';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs/Subject';

import { CountriesModel } from '../../../models/countries.model';
import { RegionDto } from '../../../models/regionDto/regionDto.model';
import { TypeOfContacts } from '../../../models/typeOfContacts.model';
import { AdminPageService } from '../../../services/admin-page.service';
import { UsersService } from '../../../services/users.service';
import { StaticData } from '../../../utils/static-data';
import { PopupSuccessComponent } from '../../pop-up/popup-success/popup-success.component';

declare let google: any;

@Component({
  selector: 'app-admin-contacts',
  templateUrl: './admin-contacts.component.html',
  styleUrls: ['./admin-contacts.component.css']
})
export class AdminContactsComponent {
  index: number;
  selectCountry: string;
  arrayOfCountries: CountriesModel[];
  arrayOfTypes: TypeOfContacts[];
  error: boolean;
  googleError: boolean;
  googleResponse = new Subject<object>();
  selectContactType: string;

  newRegionContact = this.fb.group({
    title: ['', Validators.required],
    titleEn: ['', Validators.required],
    place: '',
    contacts: this.fb.array([
      this.getNewContactMainOffice()
    ]),
    workingHours: ['']
  });

  newMainOfficeContact = this.fb.group({
    title: ['', Validators.required],
    titleEn: ['', Validators.required],
    firstBlockOfArray: false,
    place: '',
    contacts: this.fb.array([
      this.getNewContact()
    ]),
    workingHours: ['']
  });

  constructor(private apiLoader: MapsAPILoader,
              private fb: FormBuilder,
              private service: AdminPageService,
              private userService: UsersService,
              public dialog: MatDialog) {
    this.googleError = false;
    this.error = false;
    this.index = 1;
    this.selectCountry = '';
    this.arrayOfTypes = StaticData.TypeOfContacts;
    this.arrayOfCountries = StaticData.Countries;
  }

  setPage(index) {
    if (index === 2) {
      this.newMainOfficeContact.reset();
      while ((<FormArray>this.newMainOfficeContact.controls['contacts']).length !== 1) {
        (<FormArray>this.newMainOfficeContact.controls['contacts']).removeAt(0);
      }
    }
    if (index === 1) {
      this.newRegionContact.reset();
      while ((<FormArray>this.newRegionContact.controls['contacts']).length !== 1) {
        (<FormArray>this.newRegionContact.controls['contacts']).removeAt(0);
      }
    }
    this.index = index;
    this.error = false;
  }

  GetLocation(addressOfPlace) {
    this.googleError = false;
    this.apiLoader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      const address = addressOfPlace;
      geocoder.geocode({address: address}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          this.googleResponse.next({
            latitude: latitude,
            longitude: longitude
          });
        } else {
          this.googleError = true;
        }
      });
    });
  }

  openDialogVerification(): void {
    const dialogRef = this.dialog.open(PopupSuccessComponent, {
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe();
  }

  // -----------------------------------------------------------------------------------------main office

  getNewContactMainOffice() {
    return this.fb.group({
      title: '',
      titleEn: '',
      value: '',
      valueEn: '',
      prefix: this.selectContactType
    });
  }

  addNewContactMainOffice() {
    (<FormArray>this.newMainOfficeContact.controls['contacts']).push(this.getNewContactMainOffice());
  }

  sendDataMainOffice() {
    this.error = false;
    if (this.newMainOfficeContact.valid) {
      if (this.newMainOfficeContact.controls['place'].value) {
        this.GetLocation(this.newMainOfficeContact.controls['place'].value);
        this.googleResponse.subscribe((data: object) => {
          const dataToSend = this.createDataToSendMainOffice(data);
          this.sendNewContactMainOffice(dataToSend);
        }, (error) => {
          this.error = true;
        });
      } else {
        const dataToSend = this.createDataToSendMainOffice();
        this.sendNewContactMainOffice(dataToSend);
      }
    } else {
      this.error = true;
    }
  }

  sendNewContactMainOffice(dataToSend) {
    this.service.saveOrUpdateRegion(dataToSend).subscribe((data: RegionDto[]) => {
      while ((<FormArray>this.newMainOfficeContact.controls['contacts']).length !== 1) {
        (<FormArray>this.newMainOfficeContact.controls['contacts']).removeAt(0);
      }
      this.openDialogVerification();
      this.newMainOfficeContact.reset();
      this.userService.getRegionsContacts();
    });
  }

  onMainOfficeContactTypeChange(selectedIndex, contactIndex) {
    const contacts = <FormArray>this.newMainOfficeContact.controls['contacts'];
    const currentContact = <FormGroup>contacts.controls[contactIndex];
    currentContact.controls['prefix'].setValue(this.arrayOfTypes[selectedIndex]['value']);
  }

  onRegionContactTypeChange(selectedIndex, contactIndex) {
    const contacts = <FormArray>this.newRegionContact.controls['contacts'];
    const currentContact = <FormGroup>contacts.controls[contactIndex];
    currentContact.controls['prefix'].setValue(this.arrayOfTypes[selectedIndex]['value']);
  }

  createDataToSendMainOffice(data?: object) {
    const contacts = [];
    const controls = (<FormArray>this.newMainOfficeContact.controls['contacts']).controls;
    for (const index in controls) {
      const item = (<FormGroup>controls[index]).controls;
      contacts.push({
        link: item['prefix'].value,
        types: {
          ru: item['title'].value,
          en: item['titleEn'].value
        },
        values: {
          ru: item['value'].value,
          en: item['valueEn'].value
        }
      });
    }

    const dto = [
      {
        country: 'mainOffice',
        offices: [
          {
            dayOffs: null,
            departments: [
              {
                contacts: contacts,
                titles: {
                  ru: '',
                  en: ''
                }
              }
            ],
            latitude: data === undefined ? null : data['latitude'],
            longitude: data === undefined ? null : data['longitude'],
            main: this.newMainOfficeContact.controls['firstBlockOfArray'].value,
            titles: {
              ru: this.newMainOfficeContact.controls['title'].value,
              en: this.newMainOfficeContact.controls['titleEn'].value
            },
            workingHours: this.newMainOfficeContact.controls['workingHours'].value
          }
        ],
        titles: {
          ru: '',
          en: ''
        }
      }
    ];
    return dto;
  }

  // -----------------------------------------------------------------------------------------------regions

  getNewContact() {
    return this.fb.group({
      title: '',
      titleEn: '',
      value: '',
      valueEn: '',
      prefix: ''
    });
  }

  addNewContact() {
    (<FormArray>this.newRegionContact.controls['contacts']).push(this.getNewContact());
  }

  sendNewContact(dataToSend) {
    this.service.saveOrUpdateRegion(dataToSend).subscribe((data: RegionDto[]) => {
      while ((<FormArray>this.newRegionContact.controls['contacts']).length !== 1) {
        (<FormArray>this.newRegionContact.controls['contacts']).removeAt(0);
      }
      this.openDialogVerification();
      this.newRegionContact.reset();
      this.userService.getRegionsContacts();
    });
  }

  sendData() {
    this.error = false;
    if (this.newRegionContact.valid && this.selectCountry) {
      if (this.newRegionContact.controls['place'].value) {
        this.GetLocation(this.newRegionContact.controls['place'].value);
        this.googleResponse.subscribe((data: object) => {
          const dataToSend = this.createDataToSend(data);
          this.sendNewContact(dataToSend);
        }, (error) => {
          this.error = true;
        });
      } else {
        const dataToSend = this.createDataToSend();
        this.sendNewContact(dataToSend);
      }
    } else {
      this.error = true;
    }
  }


  createDataToSend(data?: object) {
    const contacts = [];
    const controls = (<FormArray>this.newRegionContact.controls['contacts']).controls;
    for (const index in controls) {
      const item = (<FormGroup>controls[index]).controls;
      contacts.push({
        link: item['prefix'].value,
        types: {
          en: item['titleEn'].value,
          ru: item['title'].value
        },
        values: {
          en: item['valueEn'].value,
          ru: item['value'].value
        }
      });
    }


    const dto = [
      {
        country: this.selectCountry,
        offices: [
          {
            dayOffs: '',
            departments: [
              {
                contacts: contacts,
                titles: {
                  ru: '',
                  en: ''
                }
              }
            ],
            latitude: data === undefined ? '' : data['latitude'],
            longitude: data === undefined ? '' : data['longitude'],
            main: false,
            titles: {
              en: this.newRegionContact.controls['titleEn'].value,
              ru: this.newRegionContact.controls['title'].value,
            },
            workingHours: this.newRegionContact.controls['workingHours'].value
          }
        ],
        titles: {
          ru: '',
          en: ''
        }
      }
    ];
    return dto;
  }
}
