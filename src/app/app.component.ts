import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StaticData} from './utils/static-data';
import {Title} from '@angular/platform-browser';
import {Language} from './utils/language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lang: any;
  arrayOfTitle: Array<any>;
  title: string;

  constructor(translate: TranslateService, private titleService: Title) {
    this.arrayOfTitle = StaticData.Title;
    this.setTitle();
    this.titleService.setTitle(this.title);
    this.lang = Language.getLang();
    translate.addLangs(['ru', 'en']);
    translate.setDefaultLang('ru');
    translate.use(this.lang);
  }

  setTitle() {
    for (let i = 0; i < this.arrayOfTitle.length; i++) {
      if (this.lang === this.arrayOfTitle[i].value) {
        this.title = this.arrayOfTitle[i].name;
        return;
      }
    }
  }

}
