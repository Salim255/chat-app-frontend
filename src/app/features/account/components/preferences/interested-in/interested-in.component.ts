import { Component, Input } from "@angular/core";
import { PreferencesService, PrefFieldName } from "../../../services/preferences.service";
import { InterestedIn } from "src/app/features/auth/components/create-profile/create-profile.component";
@Component({
  selector: 'app-interested-in',
  templateUrl: './interested-in.component.html',
  styleUrls: ['./interested-in.component.scss'],
  standalone: false
})

export class InterestedInComponent{
  @Input() interestedIn!: InterestedIn;
  constructor(private preferencesService: PreferencesService){}

  onEditLookingFor(): void{
    this.preferencesService.presentPrefForm(PrefFieldName.InterestedIn, this.interestedIn)
  }
}
