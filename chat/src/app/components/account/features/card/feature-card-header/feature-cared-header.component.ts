import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-feature-card-header',
  templateUrl: './feature-cared-header.component.html',
  styleUrls: ['./feature-cared-header.component.scss']
})

export class FeatureCardHeaderComponent {
  @Input() category!: string;
  constructor() {}

  styleBadge(category: string) {
     return `container__upgrade container__upgrade--${category}`
  }

  styleCategory(category: string) {
    return `container__category container__category--${category}`
  }

  styleLogo(category: string) {
    return `container__icon container__icon--${category}`
  }
}
