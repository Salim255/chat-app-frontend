import { Component, Input} from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-place-holder',
  templateUrl: './app-place-holder.component.html',
  styleUrls: ['./app-place-holder.component.scss']
})
export class AppPlaceHolderComponent {
    @Input() pageName: any;
    placeHolderText: any;
    constructor(private router: Router) {}

    setPlaceHolderText() {
      if (this.pageName === 'discover') {
        return`There's no one around you. Expand your Discover Settings to see more people`;
      } else {
       return `You haven't any matches yet. Start exploring your perfect match!`;
      }
    }

    onExplore() {
      this.router.navigate(['tabs/community']);
    }

    setBtnText() {
      if (this.pageName === 'discover') {
        return `Go to Settings`
      } else {
        return `Explore your match`
      }
    }
}
