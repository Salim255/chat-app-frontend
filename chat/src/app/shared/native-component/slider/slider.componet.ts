import { Component } from "@angular/core";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})

export class SliderComponent {
  constructor(){}

  ngOnInit() {
    console.log('Hello from slider component');
  }
}
