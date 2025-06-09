import { Component, Input } from "@angular/core";
import { PreferencesService, PrefFieldName } from "../../../services/preferences.service";
import { LookingFor } from "src/app/features/profile-viewer/components/looking-for/looking-for.component";

@Component({
  selector: 'app-looking-for-pref',
  templateUrl: './looking-for.component.html',
  styleUrls: ['./looking-for.component.scss'],
  standalone: false
})

export class LookingForPrefComponent {
  @Input() lookingFor: LookingFor[] = [];
  constructor(private preferencesService: PreferencesService){}

  onEditInterest(): void{
    this.preferencesService.presentPrefForm(PrefFieldName.LookingFor, this.lookingFor)
  }
}
