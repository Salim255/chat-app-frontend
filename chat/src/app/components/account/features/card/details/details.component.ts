import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-features-details',
  templateUrl: './details.component.html',
  styleUrls:['./details.component.scss']
})

export class DetailsComponent {
  @Input() category!: string;
  constructor() {}

  styleSeeFeature (category: string) {
    return `details-btn details-btn__${ category }`
  }
}
