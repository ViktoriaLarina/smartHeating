import { StaticData } from './static-data';

import { UsersService } from '../services/users.service';

export class Language {

  constructor(private service: UsersService) {

  }

  static saveLang(lang: string) {
    localStorage.setItem('lang', lang);
    location.reload();
  }

  static getLang() {
    let lang = localStorage.getItem('lang');
    if (!lang) {
      lang = StaticData.Languages[0].value;
      localStorage.setItem('lang', lang);
    }
    return lang;
  }

  static getRegion() {
    const lang = Language.getLang();
    switch (lang.toLowerCase()) {
      case 'en':
        return 'US';
      case 'uk':
        return 'UA';
      default:
        return 'RU';
    }
  }

  static getButtonCancel() {
    const lang = Language.getLang();
    switch (lang.toLowerCase()) {
      case 'en':
        return 'Cancel';
      case 'uk':
        return 'Відмінити';
      default:
        return 'Отменить';
    }
  }

  static getButtonSelect() {
    const lang = Language.getLang();
    switch (lang.toLowerCase()) {
      case 'en':
        return 'Select';
      case 'uk':
        return 'Обрати';
      default:
        return 'Выбрать';
    }
  }

  // ------------weather chart
  static getTemperature() {
    const lang = Language.getLang();
    switch (lang.toLowerCase()) {
      case 'en':
        return 'Temperature';
      case 'uk':
        return 'Температура';
      default:
        return 'Температура';
    }
  }

  static getTime() {
    const lang = Language.getLang();
    switch (lang.toLowerCase()) {
      case 'en':
        return 'Time';
      case 'uk':
        return 'Час';
      default:
        return 'Время';
    }
  }

  static getSwitchOff() {
    const lang = Language.getLang();
    switch (lang.toLowerCase()) {
      case 'en':
        return 'Switch off';
      case 'uk':
        return 'Вимк';
      default:
        return 'Выкл';
    }
  }

}
