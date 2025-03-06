import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-features-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    standalone: false
})

export class DetailsComponent {
  @Input() category!: string;
  constructor() {}

  styleSeeFeature (category: string) {
    return `details-btn details-btn__${ category }`
  }

  getIncludeText1(category: string) {
    switch(category){
      case 'gold':
        return `See who's like you`;
      case 'platinum':
        return `Priority Likes`;
      case 'plus':
        return `See who's like you`;
      default:
        return ''
    }
  }

  getIncludeText2(category: string) {
    switch(category){
      case 'gold':
        return `Top Picks`;
      case 'platinum':
        return `Message before matching`;
      case 'plus':
        return `See who's like you`;
      default:
        return ''
    }
  }
}
