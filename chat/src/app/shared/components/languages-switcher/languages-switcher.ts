import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonSelect } from "@ionic/angular";
import { AppLanguage, AppTranslateService } from "src/app/core/services/translate/translate.service";

@Component({
  selector: 'app-languages-switcher',
  templateUrl: './languages-switcher.html',
  styleUrls: ['./languages-switcher.scss'],
  standalone: false
})

export class LanguagesSwitcherComponent implements OnInit {
  @ViewChild('langSelect', { static: false }) langSelect!: IonSelect;
  languageForm!: FormGroup;
  AppLang = AppLanguage;
  langOptions = Object.values(AppLanguage);

  constructor(
    private fb: FormBuilder,
    private appTranslateService: AppTranslateService
  ){}

  ngOnInit(): void {
    const currentLang = this.appTranslateService.getCurrentLang;
    this.languageForm = this.fb.group({
      lang: [currentLang]
    })

     this.languageForm.get('lang')?.valueChanges.subscribe((selectedLang) => {
       this.appTranslateService.switchLanguage(selectedLang)
      //this.translate.use(selectedLang);
    });
  }
  onLanguage(): void{
    this.langSelect.open(); // Opens the hidden ion-select
  }
}
