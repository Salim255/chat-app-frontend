import { Component } from '@angular/core';
import { PreferencesService } from '../../../services/preferences.service';
import { PrefFieldName } from '../../../services/preferences.service';
@Component({
  selector: 'app-age-range-pref',
  templateUrl: './age-range.component.html',
  styleUrls: ['./age-range.component.scss'],
  standalone: false
})

export class AgeRangeRefComponent {
  constructor(private preferencesService : PreferencesService ){}
  onEditRange(): void{
    this.preferencesService.presentPrefForm(PrefFieldName.Age);
  }
}
