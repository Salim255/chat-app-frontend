import { Component, Input, Renderer2 } from '@angular/core';



@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss'],
})
export class CardUserComponent  {
  @Input() foreigner!: any;


  constructor (private renderer: Renderer2) { }

}
