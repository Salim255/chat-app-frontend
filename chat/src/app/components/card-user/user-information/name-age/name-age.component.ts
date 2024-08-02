import { Component, Input } from "@angular/core";
import { Router } from '@angular/router';
import { TapService } from "src/app/services/tap/tap.service";

@Component({
  selector: 'app-name-age',
  templateUrl: './name-age.component.html',
styleUrls: ['./name-age.component.scss']
})

export class NameAgeComponent {
  @Input() profile: any;
  constructor (private router: Router, private tapService: TapService) { }

  onViewProfile(){
    //this.router.navigate(['/tabs/profile'])
    this.tapService.setTapHidingStatus('hide');
 }
}
