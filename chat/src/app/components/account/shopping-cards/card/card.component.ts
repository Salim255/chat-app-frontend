import { Component, Input, OnChanges, OnInit, SimpleChanges,ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'app-shopping-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges, OnInit {
  @Input() btnContent!: string;
  @Input() header!: string;
  @Input() content!: string;
  @Input() logo!: string;
  constructor(private cdRef: ChangeDetectorRef){}
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello world');



  }
  ngOnChanges(changes: SimpleChanges) {


   this.cdRef.detectChanges();
  }

  getCssByIcon( iconName: string) {
      switch(iconName) {
        case 'star':
          return 'icon-style icon-style__likes';
        case 'flash':
          return 'icon-style icon-style__boots';
        default:
          return 'icon-style icon-style__subs';
      }
  }

  getCssByBtn( iconName: string) {
    switch(iconName) {
      case 'star':
        return 'btn__text btn__text--likes';
      case 'flash':
        return 'btn__text btn__text--boots';
      default:
        return ;
    }
}
}
