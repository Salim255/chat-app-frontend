import { Component } from "@angular/core";
import { PreferencesService } from "../../services/preferences.service";
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  standalone: false,
})

export class PreferencesComponent {
  constructor(private preferencesService : PreferencesService ) {}
  onBack():void{
    this.preferencesService.dismissPreferences();
  }
}
