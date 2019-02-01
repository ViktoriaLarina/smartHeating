import {AgmCoreModule} from '@agm/core';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
// charts--------------------------------
import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {MomentModule} from 'angular2-moment';
import {MATERIAL_COMPATIBILITY_MODE, Md2Module} from 'md2';
import {OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {NouisliderModule} from 'ng2-nouislider';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {BASE_URL_TOKEN} from './configs';
import {ChangeDateMsPipe} from './pipes/change-date-ms.pipe';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {EnterAdminSiteGuard} from './components/login/enter-admin-site.guard';
import {EnterSiteGuard} from './components/login/enter-site.guard';
import {LoginGuard} from './components/login/login-guard';
import {ChangeBytePipe} from './pipes/change-byte.pipe';

import {AdminMessagesService} from '@services/admin-messages.service';
import {AdminPageService} from '@services/admin-page.service';
import {DeviceService} from '@services/device.service';
import {ErroeResponseInterceptor} from '@services/erroe-response-interceptor';
import {GoogleOauth2Service} from '@services/google-oauth2.service';
import {InteractionsService} from '@services/interactions.service';
import {RestorePasswordService} from '@services/restore-password.service';
import {SupportMessagesService} from '@services/support-messages.service';
import {TokenInterceptor} from '@services/token-interceptor';
import {UsersService} from '@services/users.service';

import {Language} from './utils/language';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {AdminContactsComponent} from './components/admin-home/admin-contacts/admin-contacts.component';
import {AdminFirmwareComponent} from './components/admin-home/admin-firmware/admin-firmware.component';
import {ItemFirmwareComponent} from './components/admin-home/admin-firmware/item-firmware/item-firmware.component';
import {AdminHeaderComponent} from './components/admin-home/admin-header/admin-header.component';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';
import {AdminDevicesComponent} from './components/admin-home/admin-items/admin-devices/admin-devices.component';
import {ItemAdminDeviceComponent} from './components/admin-home/admin-items/admin-devices/item-admin-device/item-admin-device.component';
import {AdminItemsComponent} from './components/admin-home/admin-items/admin-items.component';
import {AdminUsersComponent} from './components/admin-home/admin-items/admin-users/admin-users.component';
import {ChangeUserInfoComponent} from './components/admin-home/admin-items/admin-users/item-admin-user/change-user-info/change-user-info.component';
import {ItemAdminUserComponent} from './components/admin-home/admin-items/admin-users/item-admin-user/item-admin-user.component';
import {AdminLoginHistoryComponent} from './components/admin-home/admin-login-history/admin-login-history.component';
import {ItemLoginHistoryComponent} from './components/admin-home/admin-login-history/item-login-history/item-login-history.component';
import {AdminItemMessageComponent} from './components/admin-home/admin-messages/admin-item-message/admin-item-message.component';
import {AdminMessageInputComponent} from './components/admin-home/admin-messages/admin-message-input/admin-message-input.component';
import {AdminMessagesComponent} from './components/admin-home/admin-messages/admin-messages.component';
import {AdminWaitingDevicesComponent} from './components/admin-home/admin-waiting-devices/admin-waiting-devices.component';
import { WaitingDeviceItemComponent } from './components/admin-home/admin-waiting-devices/waiting-device-item/waiting-device-item.component';
import {AdminSideMenuComponent} from './components/admin-home/side-menu/admin-side-menu.component';
import {AlertComponent} from './components/alert/alert.component';
import {BaseMessageInputComponent} from './components/base-components/base-message-input/base-message-input.component';
import {HeaderComponent} from './components/header/header.component';
import {MyProfileComponent} from './components/header/my-profile/my-profile.component';
import {HomeComponent} from './components/home/home.component';
import {DeviceItemType1Component} from './components/items/device-item-type1/device-item-type1.component';
import {DeviceItemType2Component} from './components/items/device-item-type2/device-item-type2.component';
import {DeviceItemType3Component} from './components/items/device-item-type3/device-item-type3.component';
import {DeviceItemComponent} from './components/items/device-item/device-item.component';
import {HistoryItemComponent} from './components/items/history-item/history-item.component';
import {HistoryMobItemComponent} from './components/items/history-mob-item/history-mob-item.component';
import {ConditionsComponent} from './components/login/conditions/conditions.component';
import {LoginComponent} from './components/login/login.component';
import {RegistrationWithGoogleComponent} from './components/login/registration-with-google/registration-with-google.component';
import {ContactsComponent} from './components/pages/contacts/contacts.component';
import {GridComponent} from './components/pages/contacts/grid/grid.component';
import {MainOfficeMapComponent} from './components/pages/contacts/main-office/main-office-map/main-office-map.component';
import {MainOfficeComponent} from './components/pages/contacts/main-office/main-office.component';
import {RegionItemComponent} from './components/pages/contacts/regions/region-item/region-item.component';
import {RegionsComponent} from './components/pages/contacts/regions/regions.component';
import {AddDeviceComponent} from './components/pages/devices/add-device/add-device.component';
import {DesktopAddDeviceComponent} from './components/pages/devices/add-device/desktop-add-device/desktop-add-device.component';
import {MobileAddDeviceComponent} from './components/pages/devices/add-device/mobile-add-device/mobile-add-device.component';
import {DevicesComponent} from './components/pages/devices/devices.component';
import {SettingsType2Component} from './components/pages/devices/settings-type2/settings-type2.component';
import {WeatherChartComponent} from './components/pages/devices/settings/chart/chart.component';
import {SettingsComponent} from './components/pages/devices/settings/settings.component';
import {ChartHistoryComponent} from './components/pages/history/chart-history/chart-history.component';
import {CheckboxComponent} from './components/pages/history/checkbox/checkbox.component';
import {DesktopHistoryTableComponent} from './components/pages/history/desktop-history-table/desktop-history-table.component';
import {HistoryComponent} from './components/pages/history/history.component';
import {MobileHistoryCardWrapperComponent} from './components/pages/history/mobile-history-card-wrapper/mobile-history-card-wrapper.component';
import {PagesComponent} from './components/pages/pages.component';
import {MessageInputComponent} from './components/pages/support/message-input/message-input.component';
import {SupportMessageComponent} from './components/pages/support/support-message/message.component';
import {SupportComponent} from './components/pages/support/support.component';
import {DesktopFirmwareAndInstructionsComponent} from './components/pages/updates/desctop-firmware-and-instruction/desktop-firmware-instruction.component';
import {DesktopFirmwareAndInstructionsItemComponent} from './components/pages/updates/desctop-firmware-and-instruction/firmware-and-instructions-item/desktop-firmware-and-instructions-item.component';
import {FirmwareAndInstructionsComponent} from './components/pages/updates/firmwareAndInstructions.component';
import {MobFirmwareAndInstructionsItemComponent} from './components/pages/updates/mobile-firmware-and-instructions/mob-firmware-and-instructions-item/mob-firmware-and-instructions-item.component';
import {MobileFirmwareAndInstructionsComponent} from './components/pages/updates/mobile-firmware-and-instructions/mobile-firmware-and-instructions.component';
import {AddUserComponent} from './components/pages/users/add-user/add-user.component';
import {DesktopUserComponent} from './components/pages/users/desktop-user/desktop-user.component';
import {UserItemComponent} from './components/pages/users/desktop-user/user-item/user-item.component';
import {UserEditComponent} from './components/pages/users/edit-user/user-edit.component';
import {MobileUserComponent} from './components/pages/users/mobile-user/mobile-user.component';
import {UserMobItemComponent} from './components/pages/users/mobile-user/user-mob-item/user-mob-item.component';
import {UsersComponent} from './components/pages/users/users.component';
import {PaginatorComponent} from './components/paginator/paginator.component';
import {ErrorSizeFileComponent} from './components/pop-up/error-size-file/error-size-file.component';
import {PopupSuccessUpdateProfileComponent} from './components/pop-up/popup-success-update-profile/popup-success-update-profile.component';
import {PopupSuccessComponent} from './components/pop-up/popup-success/popup-success.component';
import {PopupVerificationDeleteComponent} from './components/pop-up/popup-verification-delete/popup-verification-delete.component';
import {SpinnerComponent} from './components/pop-up/spinner/spinner.component';
import {SuccessfulDataRecoveryComponent} from './components/pop-up/successful-data-recovery/successful-data-recovery.component';
import {SuccessfulRegistrationPopupComponent} from './components/pop-up/successful-registration-popup/successful-registration-popup.component';
import {BadCodePageComponent} from './components/restore-password/bad-code-page/bad-code-page.component';
import {PopupSuccessRestorePassComponent} from './components/restore-password/popup-success-restore-pass/popup-success-restore-pass.component';
import {RestorePasswordComponent} from './components/restore-password/restore-password.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {PipeTimezone} from "./pipes/timezone.pipe";

const itemRoutes: Routes = [
  {path: 'devices', component: DevicesComponent},
  {path: 'instruction', component: FirmwareAndInstructionsComponent},
  {path: 'firmware', component: FirmwareAndInstructionsComponent},
  {path: 'support', component: SupportComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'users', component: UsersComponent},
  {path: '**', redirectTo: 'devices'}
];

const itemAdminRoutes: Routes = [
  {path: 'devices', component: AdminItemsComponent},
  {path: 'users', component: AdminItemsComponent},
  {path: 'firmware', component: AdminFirmwareComponent},
  {path: 'instructions', component: AdminFirmwareComponent},
  {path: 'messages', component: AdminMessagesComponent},
  {path: 'loginHistory', component: AdminLoginHistoryComponent},
  {path: 'contacts', component: AdminContactsComponent},
  {path: 'waiting', component: AdminWaitingDevicesComponent},
  {path: '', pathMatch: 'full', redirectTo: 'devices'}
];

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [EnterSiteGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    children: itemRoutes,
    canActivate: [EnterSiteGuard]
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    canActivate: [EnterAdminSiteGuard]
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: itemAdminRoutes,
    canActivate: [EnterAdminSiteGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'registrationWithGoogle',
    component: RegistrationWithGoogleComponent
  },
  {
    path: 'newpass',
    component: RestorePasswordComponent
  },
  {
    path: 'badCode',
    component: BadCodePageComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

declare let require: any;

export function highchartsFactory() {
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  const draggablePoints = require('./highcharts-draggable-points/draggable-points');
  draggablePoints(hc);
  dd(hc);

  return hc;
}

@NgModule({
  declarations: [
    DeviceItemType1Component,
    AppComponent,
    PagesComponent,
    HeaderComponent,
    SideMenuComponent,
    FirmwareAndInstructionsComponent,
    DevicesComponent,
    SupportComponent,
    SupportMessageComponent,
    MessageInputComponent,
    ContactsComponent,
    HistoryComponent,
    UsersComponent,
    CheckboxComponent,
    HistoryItemComponent,
    DesktopHistoryTableComponent,
    MobileHistoryCardWrapperComponent,
    HistoryMobItemComponent,
    DesktopFirmwareAndInstructionsComponent,
    MobileFirmwareAndInstructionsComponent,
    MobFirmwareAndInstructionsItemComponent,
    DesktopUserComponent,
    MobileUserComponent,
    UserItemComponent,
    UserMobItemComponent,
    UserEditComponent,
    AddUserComponent,
    AddDeviceComponent,
    SettingsComponent,
    MyProfileComponent,
    DeviceItemComponent,
    DesktopAddDeviceComponent,
    MobileAddDeviceComponent,
    MainOfficeComponent,
    RegionsComponent,
    LoginComponent,
    GridComponent,
    WeatherChartComponent,
    HomeComponent,
    ConditionsComponent,
    RestorePasswordComponent,
    BadCodePageComponent,
    SuccessfulDataRecoveryComponent,
    SuccessfulRegistrationPopupComponent,
    AdminHomeComponent,
    AdminSideMenuComponent,
    AdminHeaderComponent,
    AdminDevicesComponent,
    AdminUsersComponent,
    AdminFirmwareComponent,
    AdminMessagesComponent,
    AdminLoginHistoryComponent,
    AdminMessageInputComponent,
    AdminItemMessageComponent,
    PopupVerificationDeleteComponent,
    ItemFirmwareComponent,
    PopupSuccessComponent,
    ItemLoginHistoryComponent,
    ItemAdminDeviceComponent,
    ItemAdminUserComponent,
    PopupSuccessRestorePassComponent,
    ChartHistoryComponent,
    MainOfficeMapComponent,
    RegistrationWithGoogleComponent,
    AdminContactsComponent,
    PopupSuccessUpdateProfileComponent,
    ChangeBytePipe,
    PipeTimezone,
    RegionItemComponent,
    SpinnerComponent,
    DesktopFirmwareAndInstructionsItemComponent,
    ErrorSizeFileComponent,
    ChangeDateMsPipe,
    DeviceItemType2Component,
    SettingsType2Component,
    PaginatorComponent,
    BaseMessageInputComponent,
    AdminItemsComponent,
    ChangeUserInfoComponent,
    AlertComponent,
    DeviceItemType3Component,
    AdminWaitingDevicesComponent,
    WaitingDeviceItemComponent
  ],
  entryComponents: [
    UserEditComponent,
    AddUserComponent,
    AddDeviceComponent,
    SettingsComponent,
    SettingsType2Component,
    MyProfileComponent,
    ConditionsComponent,
    SuccessfulDataRecoveryComponent,
    SuccessfulRegistrationPopupComponent,
    PopupVerificationDeleteComponent,
    PopupSuccessComponent,
    PopupSuccessRestorePassComponent,
    PopupSuccessUpdateProfileComponent,
    ErrorSizeFileComponent,
    CheckboxComponent,
    ChangeUserInfoComponent
  ],

  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    MomentModule,
    MatDialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Md2Module,
    NouisliderModule,
    FormsModule,
    ChartModule,
    Ng2PageScrollModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatNativeDateModule,
    MatStepperModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDcd2g0W3P0FwVgrALSMsNfF6Q37Voh87o'   // customers key

    }),
    MatProgressSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    DeviceService,
    UsersService,
    RestorePasswordService,
    EnterSiteGuard,
    EnterAdminSiteGuard,
    TokenInterceptor,
    ErroeResponseInterceptor,
    InteractionsService,
    LoginGuard,
    AdminPageService,
    GoogleOauth2Service,
    SupportMessagesService,
    AdminMessagesService,
    {
      provide: DateAdapter, useClass: MomentDateAdapter
    },
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
    {
      provide: BASE_URL_TOKEN,
      useValue: environment.baseUrl
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErroeResponseInterceptor,
      multi: true
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: Language.getLang()
    },
    {
      provide: MAT_DATE_FORMATS, useValue: {
      parse: {
        dateInput: 'L'
      },
      display: {
        dateInput: 'L',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
      }
    }
    },
    {provide: OWL_DATE_TIME_LOCALE, useValue: Language.getLang()},
    {
      provide: OwlDateTimeIntl, useValue: {
      setBtnLabel: Language.getButtonSelect(),
      cancelBtnLabel: Language.getButtonCancel()
    }
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
