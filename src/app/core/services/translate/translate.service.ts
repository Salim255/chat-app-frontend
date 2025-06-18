import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export enum AppLanguage {
  English= 'english',
  French = 'français',
}
@Injectable({providedIn: 'root'})
export class AppTranslateService {
  constructor( private translateService: TranslateService ){}

  switchLanguage(lang: AppLanguage): void{
    if (lang === AppLanguage.English) {
      this.translateService.use('en');
    } else  {
      this.translateService.use('fr');
    }
  }

  get getCurrentLang(): string{
    return this.translateService.currentLang || AppLanguage.English;
  }
}
