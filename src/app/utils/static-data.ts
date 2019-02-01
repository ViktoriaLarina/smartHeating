import { TranslateService } from '@ngx-translate/core';

import { Formatters } from './Formatters';

import { DeviceTypesInfoModel } from '../models/DeviceTypesInfo.model';
import { Place } from '../models/places.model';
import { Rout } from '../models/rout.model';

import { ServerError } from '../models/models';
import { StaticdataLanguages } from '../models/staticdata-languages.model';

import { TimeZone } from '../models/timezones.model';
import { TypeConfig1 } from '../models/Type-config-1.model';

import { CountriesModel } from '../models/countries.model';
import { TypePermission } from '../models/dataOut/typePermission.model';
import { TypeOfContacts } from '../models/typeOfContacts.model';

export class StaticData {

  static MOBILE_CLIENT_WIDTH = 790;
  static MIN_AGE = 16;
  static MIN_DATE = new Date(1920, 0, 1);
  static MAX_DATE = new Date(2002, 0, 1);

  static DEFAULT_TEMPERATURE = 40;
  static HOURS_IN_DAY = 24;
  static SET_TIME_BEFORE_CLOSE = 2000;
  static ROUTE_LOGIN = '/login';
  static ROUTE_ADMIN = '/admin';
  static ROUTE_HOME = '/home';

  static BIO_UNIVERSAL = 'BIO_UNIVERSAL';
  static PELLET_LEVEL = 'PELLET_LEVEL';
  static BIO_UNIVERSAL_GEFEST = 'BIO_UNIVERSAL_GEFEST';
  static BIO_UNIVERSAL_OVEN = 'BIO_UNIVERSAL_OVEN';
  static SMART_SOCKET = 'SMART_SOCKET';

  static TimeZones: TimeZone[] = [
    {value: -12, name: 'TIMEZONE.UTC-12:00'},
    {value: -11, name: 'TIMEZONE.UTC-11:00'},
    {value: -10, name: 'TIMEZONE.UTC-10:00'},
    {value: -9, name: 'TIMEZONE.UTC-9:00'},
    {value: -8, name: 'TIMEZONE.UTC-8:00'},
    {value: -7, name: 'TIMEZONE.UTC-7:00'},
    {value: -6, name: 'TIMEZONE.UTC-6:00'},
    {value: -5, name: 'TIMEZONE.UTC-5:00'},
    {value: -4, name: 'TIMEZONE.UTC-4:00'},
    {value: -3, name: 'TIMEZONE.UTC-3:00'},
    {value: -2, name: 'TIMEZONE.UTC-2:00'},
    {value: -1, name: 'TIMEZONE.UTC-1:00'},
    {value: 0, name: 'TIMEZONE.UTC+0:00'},
    {value: 1, name: 'TIMEZONE.UTC+1:00'},
    {value: 2, name: 'TIMEZONE.UTC+2:00'},
    {value: 3, name: 'TIMEZONE.UTC+3:00'},
    {value: 4, name: 'TIMEZONE.UTC+4:00'},
    {value: 5, name: 'TIMEZONE.UTC+5:00'},
    {value: 6, name: 'TIMEZONE.UTC+6:00'},
    {value: 7, name: 'TIMEZONE.UTC+7:00'},
    {value: 8, name: 'TIMEZONE.UTC+8:00'},
    {value: 9, name: 'TIMEZONE.UTC+9:00'},
    {value: 10, name: 'TIMEZONE.UTC+10:00'},
    {value: 11, name: 'TIMEZONE.UTC+11:00'},
    {value: 12, name: 'TIMEZONE.UTC+12:00'}
  ];

  static Places: Place[] = [
    {value: 'HOUSE', name: 'PLACES.HOUSE'},
    {value: 'COTTAGE', name: 'PLACES.COTTAGE'},
    {value: 'OFFICE', name: 'PLACES.OFFICE'},
    {value: 'PRODUCTION', name: 'PLACES.PRODUCTION'},
    {value: 'HANGAR', name: 'PLACES.HANGAR'},
    {value: 'GREENHOUSE', name: 'PLACES.GREENHOUSE'},
    {value: 'BAKERY', name: 'PLACES.BAKERY'}
  ];

  static Social = ['FACEBOOK', 'TWITTER', 'LINKEDIN', 'GOOGLE', 'NONE'];

  static CountriesPriorities = [
    'ua',
    'ru',
    'bl'
  ];

  static Languages: StaticdataLanguages[] = [
    {value: 'ru', name: 'RU'},
    {value: 'en', name: 'EN'},
    {value: 'uk', name: 'UK'}
  ];

  static Title = [
    {value: 'ru', name: 'Биопром'},
    {value: 'en', name: 'Bioprom'},
    {value: 'uk', name: 'Біопром'}
  ];

  static TypeOfContacts: TypeOfContacts[] = [
    {value: '', name: 'тип контакта'},
    {value: '', name: 'Address'},
    {value: 'tel: ', name: 'Phone'},
    {value: 'skype: ', name: 'Skype'},
    {value: 'mailto: ', name: 'E-mail'},
    {value: 'https://', name: 'WEBSite'}
  ];

  static Countries: CountriesModel[] = [
    {value: 'az', name: 'COUNTRIES.AZ'},
    {value: 'am', name: 'COUNTRIES.AM'},
    {value: 'bl', name: 'COUNTRIES.BL'},
    {value: 'kz', name: 'COUNTRIES.KZ'},
    {value: 'kg', name: 'COUNTRIES.KG'},
    {value: 'md', name: 'COUNTRIES.MD'},
    {value: 'ru', name: 'COUNTRIES.RU'},
    {value: 'tj', name: 'COUNTRIES.TJ'},
    {value: 'uz', name: 'COUNTRIES.UZ'},
    {value: 'ua', name: 'COUNTRIES.UA'},
    {value: 'tr', name: 'COUNTRIES.TR'},
    {value: 'ge', name: 'COUNTRIES.GE'}
  ];

  static Criterion = [
    {name: 'CRITERION.CRITERIA_1', value: 'CENTRAL_HEATING_TEMPERATURE'},
    {name: 'CRITERION.CRITERIA_2', value: 'CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE'},
    {name: 'CRITERION.CRITERIA_3', value: 'EXTERNAL_CENTRAL_HEATING_TEMPERATURE'},
    {name: 'CRITERION.CRITERIA_4', value: 'EXTERNAL_CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE'},
    {name: 'CRITERION.CRITERIA_5', value: 'OPTICAL_SENSOR_VALUE'},
    {name: 'CRITERION.CRITERIA_6', value: 'WORKING_POWER_IN_PERCENT'},
    {name: 'CRITERION.CRITERIA_7', value: 'ACTUAL_STATE'},
    {name: 'CRITERION.CRITERIA_8', value: 'ACTUAL_ERROR'},
    {name: 'CRITERION.CRITERIA_9', value: 'LEVEL_CURRENT'}
  ];

  static AdminSearchDeviceCriterias = [
    {name: 'id', value: 'BY_ID'},
    {name: 'ip', value: 'BY_IP'},
    {name: 'имени устройства', value: 'BY_NAME'},
    {name: 'email владельца', value: 'BY_OWNER_EMAIL'}
  ];

  static AdminSearchUserCriterias = [
    {name: 'id устройства', value: 'BY_DEVICE_ID'},
    {name: 'email', value: 'BY_EMAIL'}
  ];
  static Week = [
    'WEEK.MONDAY',
    'WEEK.TUESDAY',
    'WEEK.WEDNESDAY',
    'WEEK.THURSDAY',
    'WEEK.FRIDAY',
    'WEEK.SATURDAY',
    'WEEK.SUNDAY'
  ];
  static TypePermissions: TypePermission[] = [
    {name: 'DEVICES.READ', value: false},
    {name: 'DEVICES.WRITE', value: true}
  ];
  private static _typeConfig1: TypeConfig1[] = [
    {
      param: 'CENTRAL_HEATING_TEMPERATURE',
      name: 'TYPE_CONFIG_1.VALUE_1',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE',
      name: 'TYPE_CONFIG_1.VALUE_2',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'OPTICAL_SENSOR_VALUE',
      name: 'TYPE_CONFIG_1.VALUE_3',
      formatter: Formatters.formatCelsius,
      showPredicate: (data) => !data.SENSOR_TYPE
    }, // TODO: Filter it
    {
      param: 'OPTICAL_SENSOR_VALUE',
      name: 'TYPE_CONFIG_1.VALUE_4',
      formatter: null,
      showPredicate: (data) => data.SENSOR_TYPE
    }, // TODO: Filter it
    {
      param: 'SENSOR_TYPE',
      name: 'TYPE_CONFIG_1.VALUE_5',
      formatter: Formatters.formatSensorType,
      showPredicate: null
    },
    {
      param: 'WORKING_POWER_IN_PERCENT',
      name: 'TYPE_CONFIG_1.VALUE_6',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'ACTUAL_STATE',
      name: 'TYPE_CONFIG_1.VALUE_7',
      formatter: Formatters.formatAutomationState,
      showPredicate: null
    },
    {
      param: 'ACTUAL_ERROR',
      name: 'TYPE_CONFIG_1.VALUE_8',
      formatter: Formatters.formatError,
      showPredicate: null
    },
    {
      param: 'FUEL_AMOUNT',
      name: 'TYPE_CONFIG_1.VALUE_9',
      formatter: Formatters.formatKg,
      showPredicate: null
    },
    {
      param: 'EXTERNAL_CENTRAL_HEATING_TEMPERATURE',
      name: 'TYPE_CONFIG_1.VALUE_10',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'EXTERNAL_CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE',
      name: 'TYPE_CONFIG_1.VALUE_11',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'FAN_POWER_DURING_IGNITION',
      name: 'TYPE_CONFIG_1.VALUE_12',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'FAN_POWER_DURING_IGNITION_MAX',
      name: 'TYPE_CONFIG_1.VALUE_13',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'IGNITION_FAN_EXTERN_POWER_MIN',
      name: 'TYPE_CONFIG_1.VALUE_14',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'IGNITION_FAN_EXTERN_POWER_MAX',
      name: 'TYPE_CONFIG_1.VALUE_15',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'EXTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION',
      name: 'TYPE_CONFIG_1.VALUE_16',
      formatter: Formatters.formatSeconds,
      showPredicate: null
    },
    {
      param: 'INTERNAL_AUGER_CONVEYOR_WORK_TIME_IGNITION',
      name: 'TYPE_CONFIG_1.VALUE_17',
      formatter: Formatters.formatSeconds,
      showPredicate: null
    },
    {
      param: 'OPTICAL_SENSOR_TEMPERATURE_GROWING',
      name: 'TYPE_CONFIG_1.VALUE_18',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'IGNITION_TIME',
      name: 'TYPE_CONFIG_1.VALUE_19',
      formatter: Formatters.formatSeconds,
      showPredicate: null
    },
    {
      param: 'WORK_PRIORITY',
      name: 'TYPE_CONFIG_1.VALUE_20',
      formatter: Formatters.formatPriority,
      showPredicate: null
    },
    {
      param: 'INTERNAL_AUGER_CONVEYOR_WORK_TIME',
      name: 'TYPE_CONFIG_1.VALUE_21',
      formatter: (value, translateService: TranslateService) => Formatters.formatSeconds(value / 1000, translateService),
      showPredicate: null
    },
    {
      param: 'EXTERNAL_AUGER_CONVEYOR_PAUSE',
      name: 'TYPE_CONFIG_1.VALUE_22',
      formatter: (value, translateService: TranslateService) => Formatters.formatSeconds(value / 1000, translateService),
      showPredicate: null
    },
    {
      param: 'EXTERNAL_AUGER_CONVEYOR_WORK_TIME',
      name: 'TYPE_CONFIG_1.VALUE_23',
      formatter: (value, translateService: TranslateService) => Formatters.formatSeconds(value / 1000, translateService),
      showPredicate: null
    },
    {
      param: 'CLEANING_WORK_TIME',
      name: 'TYPE_CONFIG_1.VALUE_24',
      formatter: (value, translateService: TranslateService) => Formatters.formatSeconds(value / 1000, translateService),
      showPredicate: null
    },
    {
      param: 'CLEANING_CYCLES_COUNT',
      name: 'TYPE_CONFIG_1.VALUE_25',
      formatter: (value, translateService: TranslateService) => Formatters.formatSeconds(value / 1000, translateService),
      showPredicate: null
    },
    {
      param: 'MIN_FAN_WORKING_POWER',
      name: 'TYPE_CONFIG_1.VALUE_26',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'MAX_FAN_WORKING_POWER',
      name: 'TYPE_CONFIG_1.VALUE_27',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'RESERVE_FAN_START_TIMEOUT',
      name: 'TYPE_CONFIG_1.VALUE_28',
      formatter: Formatters.formatSeconds,
      showPredicate: null
    },
    {
      param: 'RESERVE_FAN_STOP_TIMEOUT',
      name: 'TYPE_CONFIG_1.VALUE_29',
      formatter: Formatters.formatSeconds,
      showPredicate: null
    },
    {
      param: 'RESERVE_FAN_MIN_POWER',
      name: 'TYPE_CONFIG_1.VALUE_30',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'RESERVE_FAN_WORKING_POWER',
      name: 'TYPE_CONFIG_1.VALUE_31',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'CENTRAL_HEATING_PUMP_HYSTERESIS',
      name: 'TYPE_CONFIG_1.VALUE_32',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'CENTRAL_HEATING_PUMP_START_TEMPERATURE',
      name: 'TYPE_CONFIG_1.VALUE_33',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'AUGER_CONVEYOR_WORK_MODE',
      name: 'TYPE_CONFIG_1.VALUE_34',
      formatter: Formatters.formatActivity,
      showPredicate: null
    },
    {
      param: 'DEVICE_HYSTERESIS',
      name: 'TYPE_CONFIG_1.VALUE_35',
      formatter: Formatters.formatCelsius,
      showPredicate: null
    },
    {
      param: 'MIN_AUTOMATICS_POWER',
      name: 'TYPE_CONFIG_1.VALUE_36',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'MAX_AUTOMATICS_POWER',
      name: 'TYPE_CONFIG_1.VALUE_37',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'AUTOMATICS_POWER_DURING_SUPPLY',
      name: 'TYPE_CONFIG_1.VALUE_38',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'CLEANING_SETTINGS_WORK_TIME',
      name: 'TYPE_CONFIG_1.VALUE_39',
      formatter: Formatters.formatSeconds,
      showPredicate: null
    },
    {
      param: 'CLEANING_SETTINGS_FAN_POWER',
      name: 'TYPE_CONFIG_1.VALUE_40',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'CLEANING_SETTINGS_FAN_EXTERN_POWER',
      name: 'TYPE_CONFIG_1.VALUE_41',
      formatter: Formatters.formatPercent,
      showPredicate: null
    },
    {
      param: 'CLEANING_SETTINGS_CLEANER',
      name: 'TYPE_CONFIG_1.VALUE_42',
      formatter: Formatters.formatActivity,
      showPredicate: null
    },
    {
      param: 'CLEANING_SETTINGS_FAN',
      name: 'TYPE_CONFIG_1.VALUE_43',
      formatter: Formatters.formatActivity,
      showPredicate: null
    }
  ];
  private static _typeConfig2 = [
    {
      param: 'LEVEL_CURRENT',
      name: 'TYPE_CONFIG_2.VALUE_1',
      formatter: Formatters.formatLevel
    },
    {
      param: 'RELAY_STATE',
      name: 'TYPE_CONFIG_2.VALUE_2',
      formatter: Formatters.formatRelayState
    },
    {
      param: 'SENSOR_1_STATE',
      name: 'TYPE_CONFIG_2.VALUE_3',
      formatter: Formatters.formatSensorState
    },
    {
      param: 'SENSOR_2_STATE',
      name: 'TYPE_CONFIG_2.VALUE_4',
      formatter: Formatters.formatSensorState
    }
  ];
  static DeviceTypesInfo: DeviceTypesInfoModel[] = [
    {
      value: StaticData.BIO_UNIVERSAL,
      name: 'Bio Universal',
      endpoint: 'type1',
      parameters: [
        'CENTRAL_HEATING_TEMPERATURE',
        'CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE',
        'EXTERNAL_CENTRAL_HEATING_TEMPERATURE',
        'EXTERNAL_CENTRAL_HOT_WATER_SUPPLY_TEMPERATURE',
        'OPTICAL_SENSOR_VALUE',
        'WORKING_POWER_IN_PERCENT',
        'ACTUAL_STATE',
        'ACTUAL_ERROR'
      ],
      historyConfig: StaticData._typeConfig1
    } as DeviceTypesInfoModel,
    {
      value: StaticData.PELLET_LEVEL,
      name: 'Pellete level',
      endpoint: 'type6',
      parameters: [
        'LEVEL_CURRENT'
      ],
      historyConfig: StaticData._typeConfig2
    } as DeviceTypesInfoModel,
    {
      value: StaticData.BIO_UNIVERSAL_GEFEST,
      name: 'Bio Universal Gefest',
      endpoint: null,
      parameters: null,
      historyConfig: null
    } as DeviceTypesInfoModel,
    {
      value: StaticData.BIO_UNIVERSAL_OVEN,
      name: 'Bio Universal Oven',
      endpoint: null,
      parameters: null,
      historyConfig: null
    } as DeviceTypesInfoModel,
    {
      value: StaticData.SMART_SOCKET,
      name: 'Smart socket',
      endpoint: null,
      parameters: null,
      historyConfig: null
    }  as DeviceTypesInfoModel
  ];

  static Errors: ServerError[] = [
    {
      errorName: 'INVALID_PASSWORD',
      message: 'ERRORS.INVALID_PASSWORD',
      errorCode: '1000101'
    },
    {
      errorName: 'MISMATCH_PASSWORDS',
      message: 'ERRORS.MISMATCH_PASSWORDS',
      errorCode: '1000102'
    },
    {
      errorName: 'TARGET_ALREADY_EXISTS',
      message: 'ERRORS.TARGET_ALREADY_EXISTS',
      errorCode: '1000200'
    },
    {
      errorName: 'EMAIL_EXISTS',
      message: 'ERRORS.EMAIL_EXISTS',
      errorCode: '1000201'
    },
    {
      errorName: 'PHONE_EXISTS',
      message: 'ERRORS.PHONE_EXISTS',
      errorCode: '1000202'
    },
    {
      errorName: 'TARGET_NOT_FOUND',
      message: 'ERRORS.TARGET_NOT_FOUND',
      errorCode: '1000210'
    },
    {
      errorName: 'EMAIL_NOT_EXISTS',
      message: 'ERRORS.EMAIL_NOT_EXISTS',
      errorCode: '1000211'
    },
    {
      errorName: 'CONSTRAINT_VIOLATION',
      message: 'ERRORS.CONSTRAINT_VIOLATION',
      errorCode: '1000300'
    },
    {
      errorName: 'TOKEN_NOT_VALID',
      message: 'ERRORS.TOKEN_NOT_VALID',
      errorCode: '1000301'
    },
    {
      errorName: 'SOCIAL_DATA_NOT_AVAILABLE',
      message: 'ERRORS.SOCIAL_DATA_NOT_AVAILABLE',
      errorCode: '1000302'
    },
    {
      errorName: 'RESTRICTED_NO_ACCESS',
      message: 'ERRORS.RESTRICTED_NO_ACCESS',
      errorCode: '1000303'
    },
    {
      errorName: 'INTERNAL_ERROR',
      message: 'ERRORS.INTERNAL_ERROR',
      errorCode: '1000500'
    }
  ];

  static Routs: Rout[] = [
    {path: '/home/users', name: 'userPage'},
    {path: '/home/support', name: 'isSupportPage'},
    {path: '/home/devices', name: 'devicesPage'},
    {path: '/home/contacts', name: 'contactsPage'},
    {path: '/home/instruction', name: 'instructionPage'},
    {path: '/admin/firmware', name: 'adminFirmwarePage'}
  ];

  static REFRESH_INTERVAL = 50000;

  static BIOPROM_LINK = 'http://bioprom.ua/';

  static GetDeviceTypeInfo(deviceType) {
    return StaticData.DeviceTypesInfo.find((item) => item.value === deviceType);
  }

}
