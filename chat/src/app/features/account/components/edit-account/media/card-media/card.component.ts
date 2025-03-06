import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
    selector: "app-card-media",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"],
    standalone: false
})
export class CardMediaComponent implements OnChanges {
  @Input() mediaIndex: any;
  mediaList: Array<any>;
  constructor () {
    this.mediaList = [1,2,3,4,5];
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('====================================');
    console.log(this.mediaIndex);
    console.log('====================================');
  }


}
