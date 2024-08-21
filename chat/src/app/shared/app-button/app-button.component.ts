import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss']
})
export class AppButtonComponent implements OnInit {
  @Input() btnText!: string;
  constructor(){

  }

  ngOnInit(): void {
    console.log('Hello');
  }
}
