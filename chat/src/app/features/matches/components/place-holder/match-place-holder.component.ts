import { Component } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: 'app-match-place-holder',
  templateUrl: './match-place-holder.component.html',
  styleUrls: ['./match-place-holder.component.scss']
})

export class MatchPlaceHolderComponent {
  constructor(private router: Router) {}

  onExplore() {
    this.router.navigate(['tabs/community']);
  }
}
