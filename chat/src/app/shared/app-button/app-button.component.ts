import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss']
})
export class AppButtonComponent {
  @Input() btnText!: string;
  constructor(){

  }
}
