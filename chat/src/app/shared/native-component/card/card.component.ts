import { Component, Input, OnChanges, OnInit, SimpleChanges,ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges, OnInit {
  @Input() title!: string;
  @Input() header!: string;
  @Input() content!: string;
  constructor(private cdRef: ChangeDetectorRef){}
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello world');
    console.log(this.title, this.content, this.header);


  }
  ngOnChanges(changes: SimpleChanges) {

   console.log(this.title, this.content, this.header);
   this.cdRef.detectChanges();
  }
}
