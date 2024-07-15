import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-action-btn',
  templateUrl: './action-btn.component.html',
  styleUrls: ['./action-btn.component.scss']
})

export class ActionBtnComponent implements OnInit {
  @Input() btnType!: string;
   constructor() {

   }

   ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('====================================');
    console.log(this.btnType);
    console.log('====================================');
   }


   btnTypeClass(btnType: string) {
       return `btn btn__${btnType}`
   }

   getIconName(iconName: string) {
    let path = '../../../../../assets/icon/'
    switch(iconName) {
      case 'undo':
        return `${path}undo.svg`;
      case 'dislike':
        return  `${path}close.svg`;
      case 'stars':
        return `${path}star.svg`;
      case 'like':
        return `${path}heart.svg`;
      case 'boost':
        return  `${path}flash.svg`;
      default:
        return;
    }
   }
}
