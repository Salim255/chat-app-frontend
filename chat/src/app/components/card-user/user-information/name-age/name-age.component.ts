import { Component, Input } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-name-age',
  templateUrl: './name-age.component.html',
styleUrls: ['./name-age.component.scss']
})

export class NameAgeComponent {
  @Input() profile: any;
  constructor (private router: Router) { }

  onViewProfile(){
    this.router.navigate(['/tabs/profile'])
 }
}
