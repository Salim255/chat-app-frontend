import { Component, Input } from '@angular/core';
import { PreferencesService } from '../../../services/preferences.service';
import { PrefFieldName } from '../../../services/preferences.service';
@Component({
  selector: 'app-age-range-pref',
  templateUrl: './age-range.component.html',
  styleUrls: ['./age-range.component.scss'],
  standalone: false
})

export class AgeRangeRefComponent {
  @Input() minAge!: number;
  @Input() maxAge!: number;
  constructor(private preferencesService : PreferencesService ){}

  onEditRange(): void{
    this.preferencesService.presentPrefForm(PrefFieldName.Age, { minAge: this.minAge, maxAge: this.maxAge});
  }
}
