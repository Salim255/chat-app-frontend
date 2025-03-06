import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-feature-card',
    templateUrl: './feature-card.component.html',
    styleUrls: ['./feature-card.component.scss'],
    standalone: false
})

export class FeatureCardComponent {
  @Input() category!: string
  constructor() {}



  getCardCategoryStyle( category: string) {
     return `card card__${category}`
  }
}
