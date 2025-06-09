import { Component, Input } from "@angular/core";
import { PreferencesService, PrefFieldName } from "../../../services/preferences.service";
@Component({
  selector: 'app-distance-pref',
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.scss'],
  standalone: false
})
export class DistancePrefComponent {
  @Input() distance!: number;
  constructor(private preferencesService: PreferencesService){}

  onEditDistance(): void{
    this.preferencesService.presentPrefForm(PrefFieldName.Distance, this.distance);
  }
}
