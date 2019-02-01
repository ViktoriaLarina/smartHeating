import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import {MatDialog} from '@angular/material';
import {DeviceType} from '../../models/deviceType.model';
import {DeviceTypesInfoModel} from '../../models/DeviceTypesInfo.model';
import {Place} from '../../models/places.model';
import {DeviceService} from '../../services/device.service';
import {InteractionsService} from '../../services/interactions.service';
import {SupportMessagesService} from '../../services/support-messages.service';
import {UsersService} from '../../services/users.service';
import {StaticData} from '../../utils/static-data';
import {Language} from '../../utils/language';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  index: number;
  locale: any;
  arrayOfLanguages: any[];
  indexShow: boolean;
  showMobMenu: boolean;
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  showMobProfile: boolean;
  countUnreadMsg: number;
  deviceNameToSearch: string;
  places;

  deviceTypes: DeviceType[] = [
    {
      code: 1,
      status: false,
      name: 'DEVICES_TYPE.TYPE_1',
      deviceTypes: ['BIO_UNIVERSAL', 'BIO_UNIVERSAL_OVEN']
    },
    {
      code: 2,
      status: false,
      name: 'DEVICES_TYPE.TYPE_2',
      deviceTypes: ['BIO_UNIVERSAL', 'BIO_UNIVERSAL_OVEN', 'BIO_UNIVERSAL_GEFEST']
    },
    {code: 3, status: false, name: 'DEVICES_TYPE.TYPE_3', deviceTypes: []},
    {code: 4, status: false, name: 'DEVICES_TYPE.TYPE_4', deviceTypes: []}
  ];

  private statusTypes = [
    {code: 1, status: false},
    {code: 0, status: false}
  ];

  modelsTypes;

  constructor(public dialog: MatDialog,
              private userService: UsersService,
              private service: DeviceService,
              private rout: Router,
              private serviceInteraction: InteractionsService,
              private messageService: SupportMessagesService) {
    this.arrayOfLanguages = StaticData.Languages;
    this.locale = Language.getLang();
    this.places = StaticData.Places.map( (item: Place) => {
      return {name: item.name, status: false, value: item.value};
    });

    this.modelsTypes = StaticData.DeviceTypesInfo.map( (item: DeviceTypesInfoModel) => {
      return {value: item.value, name: item.name, status: false};
    });
    this.serviceInteraction.mobileMenuState.subscribe((show: boolean) => {
        this.showMobMenu = show;
      }
    );
    this.serviceInteraction.showMobileMyProfile.subscribe((show: boolean) => {
      this.showMobProfile = show;
    });
  }

  ngOnInit() {

    this.showMobMenu = false;

    this.serviceInteraction.mobileMenuState.next(this.showMobMenu);

    this.checkRouteState();
    this.rout.events.filter((event) => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      this.checkRouteState();
    });

    this.countUnreadMsg = this.messageService.unreadMessagesCount;
    this.messageService.onUnreadMessagesCountUpdate.subscribe((data) => {
      this.countUnreadMsg = data;
    });
  }

  openYoutube() {
    this.index = 8;
    window.open('https://www.youtube.com/channel/UCDwU9kGTM2PgHNdfUShQUlQ', '_blank');
  }

  onChange(language: number) {
    this.userService.sendLang(language);
    Language.saveLang(StaticData.Languages[language].value);
  }

  checkRouteState() {
    this.serviceInteraction.showMobileMyProfile.next(false);
    this.indexShow = this.rout.url === '/home/devices' ;

    if (this.rout.url === '/home/support') {
      this.countUnreadMsg = 0;
    }

  }

  logout() {
    this.userService.logout();
  }

  searchByName() {
    if (this.deviceNameToSearch) {
      this.service.searchDeviceByName(this.deviceNameToSearch);
    }
  }

  showMobileMyProfile() {
    this.serviceInteraction.mobileMenuState.next(false);
    this.showMobProfile = !this.showMobProfile;
    this.serviceInteraction.showMobileMyProfile.next(this.showMobProfile);
    this.serviceInteraction.showMobEditUser.next(false);
  }

  applyFilter(): void {
    const devicesByTypesSelect = this.deviceTypes.filter((item: DeviceType) => item.status).map((item) => item.deviceTypes);
    const devicesByBuildingSelect = this.places.filter((item: DeviceType) => item.status).map((item) => item.value);
    const devicesByStatusSelect = this.statusTypes.filter((item: DeviceType) => item.status).map((item) => item.code);
    const devicesByModelSelect = this.modelsTypes.filter((item: DeviceType) => item.status).map((item) => item.value);
    this.service.filters.next({
      devicesByTypesSelect,
      devicesByBuildingSelect,
      devicesByStatusSelect,
      devicesByModelSelect
    });
  }

  applyTypeFilter(index: number, status: boolean): void {
    this.deviceTypes[index].status = status;
    this.applyFilter();
  }

  applyBuildFilter(index: number, status: boolean): void {
    this.places[index].status = status;
    this.applyFilter();
  }

  devicesByStatusSelect(index: number, status: boolean): void {
    this.statusTypes[index].status = status;
    this.applyFilter();
  }

  devicesByModelSelect(index: number, status: boolean): void {
    this.modelsTypes[index].status = status;
    this.applyFilter();
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000
        && Math.abs(direction[1]) < Math.abs(direction[0])
        && Math.abs(direction[0]) > 30) {
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        if (swipe === 'next') {
          this.InverseMenuState();
        }
      }
    }
  }

  private InverseMenuState() {
    this.showMobMenu = !this.showMobMenu;
    this.serviceInteraction.mobileMenuState.next(this.showMobMenu);
  }

}
