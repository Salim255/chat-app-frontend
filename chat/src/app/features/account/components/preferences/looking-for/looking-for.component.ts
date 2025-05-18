import { Component } from "@angular/core";
import { PreferencesService, PrefFieldName } from "../../../services/preferences.service";

@Component({
  selector: 'app-looking-for-pref',
  templateUrl: './looking-for.component.html',
  styleUrls: ['./looking-for.component.scss'],
  standalone: false
})

export class LookingForPrefComponent {
  constructor(private preferencesService: PreferencesService){}

  onEditInterest(): void{
    this.preferencesService.presentPrefForm(PrefFieldName.LookingFor)
  }
}
