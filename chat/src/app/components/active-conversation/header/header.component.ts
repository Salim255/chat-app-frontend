import { Component, Input} from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-chat-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class headerComponent {
  @Input() partnerInfo: any;
  constructor(private router: Router) {}


  onBackArrow () {
    this.router.navigate(['./tabs/conversations']);
 }
}
