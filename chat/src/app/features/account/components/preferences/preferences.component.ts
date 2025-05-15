import { Component } from "@angular/core";
import { Location } from "@angular/common";
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  standalone: false,
})

export class PreferencesComponent {
  constructor(private location: Location) {}
  onBack():void{
    this.location.back()
  }
}
