import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss']
})

export class FeatureCardComponent implements OnInit{
  @Input() category!: string
  constructor() {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('hello');
  }

  getCardCategoryStyle( category: string) {
     return `card card__${category}`
  }
}
